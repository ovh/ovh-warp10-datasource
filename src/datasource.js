import _ from 'lodash';
import moment from 'moment';

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

    var options = {
      method: 'POST',
      url: url,
      data: options,
      headers: {
          'Accept': undefined,
          'Content-Type': undefined
      }
    };
    return this.backendSrv.datasourceRequest(options).then(this.parseTemplatingResult);
  }
  parseTemplatingResult(o) {
     return _.map(o.data, (d, i) => {
      return { text: d, value: i};
    });
  }

  // Called once per panel (graph)
  query(options) {

    console.log("Query begin");

    var end = this.convertToWarp10Time(options.range.to);
    var start = this.convertToWarp10Time(options.range.from);
    
    console.log("From: "+start+ " To: "+end);


    var queries = [];

    console.log("Before foreach");

    _.each(options.targets, _.bind(function(target) {

      console.log("Expre", target.expr);
      console.log("Backend URL", target.backend);

      queries.push(target);
    }, this));

    console.log("After foreach");

    // No valid targets, return the empty result to save a round trip.
    if (_.isEmpty(queries)) {

      console.log("Empty query");

      var d = this.q.defer();
      d.resolve({ data: [] });
      return d.promise;
    }

    var allQueryPromise = _.map(queries, _.bind(function(query) {
      return this.performTimeSeriesQuery(query, start, end);
    }, this));

    var self = this;
    return this.q.all(allQueryPromise)
      .then(function(allResponse) {
        var result = [];

        _.each(allResponse, function(response, index) {

          console.log("Response", response);
          if (response.data.type === 'error') {
            self.lastErrors.query = response.data.value;
            throw response.data.value;
          }
          delete self.lastErrors.query;

          if (!self.isArray(response.data) || (response.data.length !== 1)) {
            console.log("Response isn't an Array or it has more than 1 element", response.data);
            return {};
          }

          var warpscriptJsonResponse = response.data[0];

          console.log("Response data", warpscriptJsonResponse);

          _.each(warpscriptJsonResponse, function(metricData) {
            console.log("Metric data",metricData);

            result.push(self.transformMetricData(metricData, options.targets[index]));
          });
        });

        return { data: result };
      });
  
  }


  buildQueryParameters(options) {
    //remove placeholder targets
    options.targets = _.filter(options.targets, target => {
      return target.target !== 'select metric';
    });

    var targets = _.map(options.targets, target => {
      return {
        target: this.templateSrv.replace(target.target),
        refId: target.refId,
        hide: target.hide,
        expr: target.expr,
        backend: target.backend
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
          'Content-Type': undefined
      }
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
          " " + start + " 'start' STORE " + end + " 'end' STORE " +
          "'" + startISO + "' 'startISO' STORE '" + endISO + "' 'endISO' STORE " +
          interval + " 'interval' STORE";
    _.each(this.templateSrv.variables, function(variable) {
      var tmp = variable.current.value;
      if( isNaN(variable.current.value) ) {
        // It's a string
        tmp = "'" + variable.current.value + "'";
      }
      warpscriptScript += "\n" + tmp + " '"+variable.name+"' STORE";
    });
    if (query.expr !== undefined) {
      warpscriptScript += " " + query.expr;
    }
    return warpscriptScript;
  }

  /* ******************************************************/
  /* Transform from Warpscript JSON to Grafana dps
  /* ******************************************************/
  transformMetricData(gts) {

    if (!this.isGts(gts)) {
      console.log("Response item isn't a gts",gts);
      return;
    }

    var className = gts.c;

    var labels =
      _.map(gts.l, function(value, key) {
        return key+"="+value;
      }).join(",");

    var metricName = className+"{"+labels+"}";
    var dps = [];

    _.each(gts.v, function(value) {
      // Datapoint format: [ value, label]
      dps.push([value[value.length -1], Math.floor(value[0]/1000)]);
    });

    // Metric format {target: "Label text", datapoints: [ datapoints objects] }

    console.log({ target: metricName , datapoints: dps });
    return { target: metricName, datapoints: dps };
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
  if (_.isDate(text)) { return moment(text); }

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
