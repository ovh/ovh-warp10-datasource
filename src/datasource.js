import moment from 'moment';
import './css/app.css!';

export class Warp10Datasource {
  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.lastErrors = {};
  }

  // Optional
  // Required for templating
  metricFindQuery(options) {
    var backend = this.url;
    while (backend[backend.length-1] === '/') {
      // remove trailing slash
      backend = backend.substr(0, backend.length - 1);
    }
    var url = backend + '/api/v0/exec';

    console.debug(this.templateSrv);
    this.templateSrv.variables.forEach((variable) => {
      if (isNaN(variable.current.value)) {
        options = options.replace(new RegExp('\\$' + variable.name, 'g'), '\'$' + variable.name + '\'');
      }
    });
    options = this.templateSrv.replace(options, null, 'regex');

    options = {
      method: 'POST',
      url: url,
      data: options,
      headers: {
          'Accept': undefined,
          'Content-Type': undefined,
      },
    };
    return this.backendSrv.datasourceRequest(options).then(this.parseTemplatingResult);
  }

  parseTemplatingResult(o) {
    console.debug('tesmplating result', o);
    return o.data.map((data, indice) => {
      return {text: data.toString() || indice, value: data};
    });
  }

  // Used by Grafana to test a Datasource when one is added
  testDatasource() {
    return this.backendSrv.datasourceRequest({
      url: this.url + '/api/v0/exec',
      method: 'POST',
      data: '1 2 +',
      headers: {
          'Accept': undefined,
          'Content-Type': undefined,
      },
    })
    .then((res) => {
      if (res.status != 200) {
        return {
          status: 'error',
          message: 'Not a 200 receivend from server',
          title: 'Error',
        };
      }
      if (res.data[0] != 3) {
        return {
          status: 'error',
          message: 'Can\'t execute test WarpScript: \'1 2 +\'not equals to ' + res.data,
          title: 'Success',
        };
      }
      return {
        status: 'success',
        message: 'Datasource is working',
        title: 'Success',
      };
    })
    .catch((res) => {
      return {
        status: 'error',
        message: res.err,
        title: 'Failed to contact server',
      };
    });
  }

  // Called once per panel (graph)
  query(options) {
    console.debug('[grafana-warp10-datasource] Query begin', options);

    var end = this.convertToWarp10Time(options.range.to);
    var start = this.convertToWarp10Time(options.range.from);

    console.debug('[grafana-warp10-datasource] From: '+start+ ' To: '+end);


    var queries = [];

    console.debug('[grafana-warp10-datasource] Before foreach');

    if (options.targets) {
      options.targets.forEach((target) => {
        console.debug('[grafana-warp10-datasource] Expr', target.expr);
        console.debug('[grafana-warp10-datasource] Backend URL', target.backend);
        queries.push(target);
      });
    }

    console.debug('[grafana-warp10-datasource] After foreach');

    // No valid targets, return the empty result to save a round trip.

    if (!queries || queries.length == 0) {
      console.debug('[grafana-warp10-datasource] Empty query');

      var d = this.q.defer();
      d.resolve({data: []});
      return d.promise;
    }

    var allQueryPromise = queries.map( (query) => {
      return this.performTimeSeriesQuery(query, start, end);
    });

    var self = this;
    return this.q.all(allQueryPromise)
      .then(function(allResponse) {
        var result = [];

        allResponse.forEach( (response, index) => {
          console.debug('[grafana-warp10-datasource] Response', response);
          if (response.data.type === 'error') {
            self.lastErrors.query = response.data.value;
            throw response.data.value;
          }
          delete self.lastErrors.query;

          if (!self.isArray(response.data) || (response.data.length !== 1)) {
            console.debug('[grafana-warp10-datasource] Response isn\'t an Array or it has more than 1 element', response.data);
            return {};
          }

          var warpscriptJsonResponse = response.data[0];
          warpscriptJsonResponse.forEach((metricData) => {
            console.debug('[grafana-warp10-datasource] Metric data', metricData);
            result.push(self.transformMetricData(metricData, options.targets[index]));
          });
        });
        console.debug('[grafana-warp10-datasource] Response data', {data: result});
        return {data: result};
      });
  }

  // Used by Grafana for Dashboard annotations
  annotationQuery(options) {
    var end = this.convertToWarp10Time(options.range.to);
    var start = this.convertToWarp10Time(options.range.from);

    return this.performTimeSeriesQuery({
      expr: options.annotation.query,
    }, start, end)
    .then((res) => {
      if (res.data.length != 1 || typeof res.data[0] != 'object') {
        console.error('Annotation query must return exactly 1 GeoTimeSerie, current stack is:', res.data);
        return [];
      }
      let gts = res.data[0];
      console.debug('GTS', gts);
      let tags = [];
      for (let label in gts.l) {
        tags.push(label+':'+gts.l[label]);
      }

      let annotations = [];

      for (let dp of gts.v) {
        annotations.push({
          annotation: {
            name: options.annotation.name,
            enabled: true,
            datasource: this.name,
          },
          title: gts.c,
          time: Math.trunc(dp[0] / 1000),
          text: dp[1],
          tags: (tags.length > 0) ? tags.join(',') : null,
        });
      }
      console.de;
      return annotations;
    })
    .catch((err) => {
      console.error('Failed to retrieve annotations', err, options);
      return [];
    });
  }

  buildQueryParameters(options) {
    // remove placeholder targets
    options.targets = options.targets.filter((target) => {
      return target.target !== 'select metric';
    });

    var targets = options.targets.map((target) => {
      return {
        target: this.templateSrv.replace(target.target),
        refId: target.refId,
        hide: target.hide,
        expr: target.expr,
        backend: target.backend,
      };
    });

    options.targets = targets;

    return options;
  }

  /* ******************************************************/
  /* Puts into the Warpscript script a header to place
  /* start and end ont the stacks
  /* ******************************************************/
  performTimeSeriesQuery(query, start, end) {
    var warpscriptScript = this.prepareWarpscriptQuery(query, start, end);

    var backend = this.url;
    // If we have defined a backend in the query editor, it takes preecedence
    // over the datasource
    if ((query.backend !== undefined) && (query.backend.length >0)) {
      backend = query.backend;
    }

    while (backend[backend.length-1] === '/') {
      // remove trailing slash
      backend = backend.substr(0, backend.length - 1);
    }

    var url = backend + '/api/v0/exec';

    var options = {
      method: 'POST',
      url: url,
      data: warpscriptScript,
      headers: {
          'Accept': undefined,
          'Content-Type': undefined,
      },
    };

    return this.backendSrv.datasourceRequest(options);
  }

  /* ******************************************************/
  /* Puts into the Warpscript script a header to place
  /* start and end ont the stack
  /* ******************************************************/
  prepareWarpscriptQuery(query, start, end) {
    var endISO = this.convertToISO(end);
    var startISO = this.convertToISO(start);
    var interval = end - start;

    var warpscriptScript =
          ' ' + start + ' \'start\' STORE ' + end + ' \'end\' STORE ' +
          '\'' + startISO + '\' \'startISO\' STORE \'' + endISO + '\' \'endISO\' STORE ' +
          interval + ' \'interval\' STORE';

    for (let variable of this.templateSrv.variables) {
      var tmp = variable.current.text;
      if ( isNaN(variable.current.text) ) {
        // It's a string
        tmp = '\'' + variable.current.text + '\'';
      }
      warpscriptScript += '\n' + tmp + ' \''+variable.name+'\' STORE';
    }
    if (query.expr !== undefined) {
      warpscriptScript += ' ' + query.expr;
    }
    return warpscriptScript;
  }

  /* ******************************************************/
  /* Transform from Warpscript JSON to Grafana dps
  /* ******************************************************/
  transformMetricData(gts) {
    if (!this.isGts(gts)) {
      if ( typeof gts == 'object') {
        console.debug('[grafana-warp10-datasource] Response item is an object', gts);
        return gts;
      }
      console.debug('[grafana-warp10-datasource] Response item isn\'t neither an object nor a GTS', gts);
      return;
    }

    console.debug('[grafana-warp10-datasource] Response item is a GTS', gts);
    var className = gts.c;

    var labels = Object.entries(gts.l).
      map(([key, value]) => {
        return key+'='+value;
      }).
      join(',');

    var metricName = className+'{'+labels+'}';
    var dps = [];

    gts.v.forEach((value) => {
      // Datapoint format: [ value, label]
      dps.push([value[value.length -1], Math.floor(value[0]/1000)]);
    });

    // Metric format {target: "Label text", datapoints: [ datapoints objects] }

    console.debug({target: metricName, datapoints: dps});
    return {target: metricName, datapoints: dps};
  }

  /* ******************************************************/
  /* Returns true if @value is an Array
  /* ******************************************************/
  isArray(value) {
    return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number'
      && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
  }

  /* ******************************************************/
  /* Returns true if @gts is a JSON object version of a GTS
  /* ******************************************************/
  isGts(gts) {
    if ((gts.c == null) || (gts.l == null) || (gts.a == null) || (gts.v == null)) {
      return false;
    }
    return true;
  }

  /* ******************************************************/
  /* Converts @date into µs since Epoch time
  /* (Warpscript tick format)
  /* ******************************************************/
  convertToWarp10Time(date) {
    date = this.parse(date);
    return date * 1000;
  }

  /* ******************************************************/
  /* Converts @timestamp into ISO 8601 format
  /* ******************************************************/
  convertToISO(timestamp) {
    var date = new Date(Math.floor(timestamp/1000));
    return date.toISOString();
  }

  parse(text, roundUp) {
    if (!text) { return undefined; }
    if (moment.isMoment(text)) { return text; }
    if (Object.prototype.toString.call(text) === '[object Date]') { return moment(text); }

    var time;
    var mathString = '';
    var index;
    var parseString;

    if (text.substring(0, 3) === 'now') {
      time = moment();
      mathString = text.substring('now'.length);
    } else {
      index = text.indexOf('||');
      if (index === -1) {
        parseString = text;
        mathString = ''; // nothing else
      } else {
        parseString = text.substring(0, index);
        mathString = text.substring(index + 2);
      }
      // We're going to just require ISO8601 timestamps, k?
      time = moment(parseString, moment.ISO_8601);
    }

    if (!mathString.length) {
      return time;
    }

    return parseDateMath(mathString, time, roundUp);
  }
}
