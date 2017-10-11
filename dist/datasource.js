'use strict';

System.register(['moment', './css/app.css!'], function (_export, _context) {
  "use strict";

  var moment, _slicedToArray, _typeof, _createClass, Warp10Datasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_moment) {
      moment = _moment.default;
    }, function (_cssAppCss) {}],
    execute: function () {
      _slicedToArray = function () {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = undefined;

          try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value);

              if (i && _arr.length === i) break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i["return"]) _i["return"]();
            } finally {
              if (_d) throw _e;
            }
          }

          return _arr;
        }

        return function (arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
        };
      }();

      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('Warp10Datasource', Warp10Datasource = function () {
        function Warp10Datasource(instanceSettings, $q, backendSrv, templateSrv) {
          _classCallCheck(this, Warp10Datasource);

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


        _createClass(Warp10Datasource, [{
          key: 'metricFindQuery',
          value: function metricFindQuery(options) {
            var backend = this.url;
            while (backend[backend.length - 1] === '/') {
              // remove trailing slash
              backend = backend.substr(0, backend.length - 1);
            }
            var url = backend + '/api/v0/exec';

            console.debug(this.templateSrv);
            this.templateSrv.variables.forEach(function (variable) {
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
                'Content-Type': undefined
              }
            };
            return this.backendSrv.datasourceRequest(options).then(this.parseTemplatingResult);
          }
        }, {
          key: 'parseTemplatingResult',
          value: function parseTemplatingResult(o) {
            console.debug('tesmplating result', o);
            return o.data.map(function (data, indice) {
              return { text: data.toString() || indice, value: data };
            });
          }
        }, {
          key: 'testDatasource',
          value: function testDatasource() {
            return this.backendSrv.datasourceRequest({
              url: this.url + '/api/v0/exec',
              method: 'POST',
              data: '1 2 +',
              headers: {
                'Accept': undefined,
                'Content-Type': undefined
              }
            }).then(function (res) {
              if (res.status != 200) {
                return {
                  status: 'error',
                  message: 'Not a 200 receivend from server',
                  title: 'Error'
                };
              }
              if (res.data[0] != 3) {
                return {
                  status: 'error',
                  message: 'Can\'t execute test WarpScript: \'1 2 +\'not equals to ' + res.data,
                  title: 'Success'
                };
              }
              return {
                status: 'success',
                message: 'Datasource is working',
                title: 'Success'
              };
            }).catch(function (res) {
              return {
                status: 'error',
                message: res.err,
                title: 'Failed to contact server'
              };
            });
          }
        }, {
          key: 'query',
          value: function query(options) {
            var _this = this;

            console.debug('[grafana-warp10-datasource] Query begin', options);

            var end = this.convertToWarp10Time(options.range.to);
            var start = this.convertToWarp10Time(options.range.from);

            console.debug('[grafana-warp10-datasource] From: ' + start + ' To: ' + end);

            var queries = [];

            console.debug('[grafana-warp10-datasource] Before foreach');

            if (options.targets) {
              options.targets.forEach(function (target) {
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
              d.resolve({ data: [] });
              return d.promise;
            }

            var allQueryPromise = queries.map(function (query) {
              return _this.performTimeSeriesQuery(query, start, end);
            });

            var self = this;
            return this.q.all(allQueryPromise).then(function (allResponse) {
              var result = [];

              allResponse.forEach(function (response, index) {
                console.debug('[grafana-warp10-datasource] Response', response);
                if (response.data.type === 'error') {
                  self.lastErrors.query = response.data.value;
                  throw response.data.value;
                }
                delete self.lastErrors.query;

                if (!self.isArray(response.data) || response.data.length !== 1) {
                  console.debug('[grafana-warp10-datasource] Response isn\'t an Array or it has more than 1 element', response.data);
                  return {};
                }

                var warpscriptJsonResponse = response.data[0];
                warpscriptJsonResponse.forEach(function (metricData) {
                  console.debug('[grafana-warp10-datasource] Metric data', metricData);
                  result.push(self.transformMetricData(metricData, options.targets[index]));
                });
              });
              console.debug('[grafana-warp10-datasource] Response data', { data: result });
              return { data: result };
            });
          }
        }, {
          key: 'annotationQuery',
          value: function annotationQuery(options) {
            var _this2 = this;

            var end = this.convertToWarp10Time(options.range.to);
            var start = this.convertToWarp10Time(options.range.from);

            return this.performTimeSeriesQuery({
              expr: options.annotation.query
            }, start, end).then(function (res) {
              if (res.data.length != 1 || _typeof(res.data[0]) != 'object') {
                console.error('Annotation query must return exactly 1 GeoTimeSerie, current stack is:', res.data);
                return [];
              }
              var gts = res.data[0];
              console.debug('GTS', gts);
              var tags = [];
              for (var label in gts.l) {
                tags.push(label + ':' + gts.l[label]);
              }

              var annotations = [];

              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = gts.v[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var dp = _step.value;

                  annotations.push({
                    annotation: {
                      name: options.annotation.name,
                      enabled: true,
                      datasource: _this2.name
                    },
                    title: gts.c,
                    time: Math.trunc(dp[0] / 1000),
                    text: dp[1],
                    tags: tags.length > 0 ? tags.join(',') : null
                  });
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              console.de;
              return annotations;
            }).catch(function (err) {
              console.error('Failed to retrieve annotations', err, options);
              return [];
            });
          }
        }, {
          key: 'buildQueryParameters',
          value: function buildQueryParameters(options) {
            var _this3 = this;

            // remove placeholder targets
            options.targets = options.targets.filter(function (target) {
              return target.target !== 'select metric';
            });

            var targets = options.targets.map(function (target) {
              return {
                target: _this3.templateSrv.replace(target.target),
                refId: target.refId,
                hide: target.hide,
                expr: target.expr,
                backend: target.backend
              };
            });

            options.targets = targets;

            return options;
          }
        }, {
          key: 'performTimeSeriesQuery',
          value: function performTimeSeriesQuery(query, start, end) {
            var warpscriptScript = this.prepareWarpscriptQuery(query, start, end);

            var backend = this.url;
            // If we have defined a backend in the query editor, it takes preecedence
            // over the datasource
            if (query.backend !== undefined && query.backend.length > 0) {
              backend = query.backend;
            }

            while (backend[backend.length - 1] === '/') {
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
        }, {
          key: 'prepareWarpscriptQuery',
          value: function prepareWarpscriptQuery(query, start, end) {
            var endISO = this.convertToISO(end);
            var startISO = this.convertToISO(start);
            var interval = end - start;

            var warpscriptScript = ' ' + start + ' \'start\' STORE ' + end + ' \'end\' STORE ' + '\'' + startISO + '\' \'startISO\' STORE \'' + endISO + '\' \'endISO\' STORE ' + interval + ' \'interval\' STORE';

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = this.templateSrv.variables[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var variable = _step2.value;

                var tmp = variable.current.text;
                if (isNaN(variable.current.text)) {
                  // It's a string
                  tmp = '\'' + variable.current.text + '\'';
                }
                warpscriptScript += '\n' + tmp + ' \'' + variable.name + '\' STORE';
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            if (query.expr !== undefined) {
              warpscriptScript += ' ' + query.expr;
            }
            return warpscriptScript;
          }
        }, {
          key: 'transformMetricData',
          value: function transformMetricData(gts) {
            if (!this.isGts(gts)) {
              if ((typeof gts === 'undefined' ? 'undefined' : _typeof(gts)) == 'object') {
                console.debug('[grafana-warp10-datasource] Response item is an object', gts);
                return gts;
              }
              console.debug('[grafana-warp10-datasource] Response item isn\'t neither an object nor a GTS', gts);
              return;
            }

            console.debug('[grafana-warp10-datasource] Response item is a GTS', gts);
            var className = gts.c;

            var labels = Object.entries(gts.l).map(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  key = _ref2[0],
                  value = _ref2[1];

              return key + '=' + value;
            }).join(',');

            var metricName = className + '{' + labels + '}';
            var dps = [];

            gts.v.forEach(function (value) {
              // Datapoint format: [ value, label]
              dps.push([value[value.length - 1], Math.floor(value[0] / 1000)]);
            });

            // Metric format {target: "Label text", datapoints: [ datapoints objects] }

            console.debug({ target: metricName, datapoints: dps });
            return { target: metricName, datapoints: dps };
          }
        }, {
          key: 'isArray',
          value: function isArray(value) {
            return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value instanceof Array && typeof value.length === 'number' && typeof value.splice === 'function' && !value.propertyIsEnumerable('length');
          }
        }, {
          key: 'isGts',
          value: function isGts(gts) {
            if (gts.c == null || gts.l == null || gts.a == null || gts.v == null) {
              return false;
            }
            return true;
          }
        }, {
          key: 'convertToWarp10Time',
          value: function convertToWarp10Time(date) {
            date = this.parse(date);
            return date * 1000;
          }
        }, {
          key: 'convertToISO',
          value: function convertToISO(timestamp) {
            var date = new Date(Math.floor(timestamp / 1000));
            return date.toISOString();
          }
        }, {
          key: 'parse',
          value: function parse(text, roundUp) {
            if (!text) {
              return undefined;
            }
            if (moment.isMoment(text)) {
              return text;
            }
            if (Object.prototype.toString.call(text) === '[object Date]') {
              return moment(text);
            }

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
        }]);

        return Warp10Datasource;
      }());

      _export('Warp10Datasource', Warp10Datasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
