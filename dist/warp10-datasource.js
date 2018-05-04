System.register(["./gts", "./table", "./query"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var gts_1, table_1, query_1, Warp10Datasource;
    return {
        setters: [
            function (gts_1_1) {
                gts_1 = gts_1_1;
            },
            function (table_1_1) {
                table_1 = table_1_1;
            },
            function (query_1_1) {
                query_1 = query_1_1;
            }
        ],
        execute: function () {
            Warp10Datasource = /** @class */ (function () {
                function Warp10Datasource(instanceSettings, $q, backendSrv, templateSrv, $log) {
                    this.instanceSettings = instanceSettings;
                    this.$q = $q;
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.$log = $log;
                }
                /**
                 * used by panels to get data
                 * @param options
                 * @return {Promise<any>} Grafana datapoints set
                 */
                Warp10Datasource.prototype.query = function (opts) {
                    var _this = this;
                    var queries = [];
                    var wsHeader = this.computeTimeVars(opts) + this.computeGrafanaContext() + this.computePanelRepeatVars(opts);
                    opts.targets.forEach(function (queryRef) {
                        var query = Object.assign({}, queryRef); // Deep copy
                        //if (!query.hide) {
                        if (query.friendlyQuery)
                            query.friendlyQuery = Object.assign(new query_1.default(), query.friendlyQuery);
                        // Grafana can send empty Object at the first time, we need to check is there is something
                        if (query.expr || query.friendlyQuery) {
                            if (query.advancedMode === undefined)
                                query.advancedMode = true;
                            query.ws = wsHeader + "\n" + (query.advancedMode ? query.expr : query.friendlyQuery.warpScript);
                            queries.push(query);
                            console.debug('New Query: ', (query.advancedMode) ? query.expr : query.friendlyQuery);
                        }
                        //}
                    });
                    if (queries.length === 0) {
                        var d = this.$q.defer();
                        d.resolve({ data: [] });
                        return d.promise;
                    }
                    queries = queries.map(this.executeExec.bind(this));
                    return this.$q.all(queries)
                        .then(function (responses) {
                        // Grafana formated GTS
                        var data = [];
                        responses.forEach(function (res, i) {
                            if (res.data.type === 'error') {
                                console.error(res.data.value);
                                return;
                            }
                            // is it for a Table grpah ?
                            if (res.data.length === 1 && res.data[0] && table_1.Table.isTable(res.data[0])) {
                                var t = res.data[0];
                                t.type = 'table';
                                data.push(t);
                                return;
                            }
                            gts_1.default.stackFilter(res.data).forEach(function (gts) {
                                var grafanaGts = {
                                    target: (opts.targets[i].hideLabels) ? gts.c : gts.nameWithLabels,
                                    datapoints: []
                                };
                                // show attributes
                                if (opts.targets[i].hideAttributes !== undefined && !opts.targets[i].hideAttributes) {
                                    grafanaGts.target += gts.formatedAttributes;
                                }
                                gts.v.forEach(function (dp) {
                                    grafanaGts.datapoints.push([dp[dp.length - 1], dp[0] / 1000]);
                                });
                                data.push(grafanaGts);
                            });
                        });
                        return { data: data };
                    })
                        .catch(function (err) {
                        console.warn('[Warp10] Failed to execute query', err);
                        var d = _this.$q.defer();
                        d.resolve({ data: [] });
                        return d.promise;
                    });
                };
                /**
                 * used by datasource configuration page to make sure the connection is working
                 * @return {Promise<any>} response
                 */
                Warp10Datasource.prototype.testDatasource = function () {
                    return this.executeExec({ ws: '1 2 +' })
                        .then(function (res) {
                        if (res.data[0] !== 3) {
                            return {
                                status: 'error',
                                message: JSON.parse(res.data) || res.data,
                                title: 'Failed to execute basic WarpScript'
                            };
                        }
                        else {
                            return {
                                status: 'success',
                                message: 'Datasource is working',
                                title: 'Success'
                            };
                        }
                    })
                        .catch(function (res) {
                        console.debug('Error', res);
                        return {
                            status: 'error',
                            message: "Status code: " + res.err.status,
                            title: 'Failed to contact Warp10 platform'
                        };
                    });
                };
                /**
                 * used by dashboards to get annotations
                 * @param options
                 * @return {Promise<any>} results
                 */
                Warp10Datasource.prototype.annotationQuery = function (opts) {
                    var _this = this;
                    var ws = this.computeTimeVars(opts) + this.computeGrafanaContext() + opts.annotation.query;
                    return this.executeExec({ ws: ws })
                        .then(function (res) {
                        var annotations = [];
                        var _loop_1 = function (gts) {
                            var tags = [];
                            for (var label in gts.l) {
                                tags.push(label + ":" + gts.l[label]);
                            }
                            gts.v.forEach(function (dp) {
                                annotations.push({
                                    annotation: {
                                        name: opts.annotation.name,
                                        enabled: true,
                                        datasource: _this.instanceSettings.name,
                                    },
                                    title: gts.c,
                                    time: Math.trunc(dp[0] / (1000)),
                                    text: dp[dp.length - 1],
                                    tags: (tags.length > 0) ? tags.join(',') : null
                                });
                            });
                        };
                        /*if (!) {
                          console.error(`An annotation query must return exactly 1 GTS on top of the stack, annotation: ${ opts.annotation.name }`)
                          var d = this.$q.defer()
                          d.resolve([])
                          return d.promise
                        }*/
                        for (var _i = 0, _a = gts_1.default.stackFilter(res.data); _i < _a.length; _i++) {
                            var gts = _a[_i];
                            _loop_1(gts);
                        }
                        return annotations;
                    });
                };
                /**
                 * used by query editor to get metric suggestions and templating.
                 * @param options
                 * @return {Promise<any>}
                 */
                Warp10Datasource.prototype.metricFindQuery = function (ws) {
                    return this.executeExec({ ws: this.computeGrafanaContext() + ws })
                        .then(function (res) {
                        // only one object on the stack, good user
                        if (res.data.length === 1 && typeof res.data[0] === 'object') {
                            var entries_1 = [];
                            res.data[0].forEach(function (key) {
                                entries_1.push({
                                    text: key,
                                    value: res.data[0][key]
                                });
                            });
                            return entries_1;
                        }
                        // some elements on the stack, return all of them as entry
                        return res.data.map(function (entry, i) {
                            return {
                                text: entry.toString() || i,
                                value: entry
                            };
                        });
                    });
                };
                /**
                 * Execute WarpScript
                 * @param ws WarpScript string
                 * @return {Promise<any>} Response
                 */
                Warp10Datasource.prototype.executeExec = function (query) {
                    var endpoint = this.instanceSettings.url;
                    if ((query.backend !== undefined) && (query.backend.length > 0)) {
                        endpoint = query.backend;
                    }
                    if (endpoint.charAt(endpoint.length - 1) === '/') {
                        endpoint = endpoint.substr(0, endpoint.length - 1);
                    }
                    return this.backendSrv.datasourceRequest({
                        method: 'POST',
                        url: endpoint + '/api/v0/exec',
                        data: query.ws,
                        headers: {
                            'Accept': undefined,
                            'Content-Type': undefined
                        }
                    });
                };
                /**
                 * Find all metrics with the given selector
                 * @param selector
                 * @return {Promise<any>} results
                 */
                Warp10Datasource.prototype.executeFind = function (selector) {
                    return this.backendSrv.datasourceRequest({
                        method: 'GET',
                        url: this.instanceSettings.url + "/api/v0/find?selector=" + selector,
                        headers: {
                            'Accept': undefined,
                            'Content-Type': undefined
                        }
                    });
                };
                /**
                 * Compute Datasource variables and templating variables, store it on top of the stack
                 * @return {string} WarpScript header
                 */
                Warp10Datasource.prototype.computeGrafanaContext = function () {
                    var wsHeader = '';
                    // Datasource vars
                    for (var myVar in this.instanceSettings.jsonData) {
                        var value = this.instanceSettings.jsonData[myVar];
                        if (typeof value === 'string')
                            value = value.replace(/'/g, '"');
                        if (typeof value === 'string' && !value.startsWith('<%') && !value.endsWith('%>'))
                            value = "'" + value + "'";
                        wsHeader += (value || 'NULL') + " '" + myVar + "' STORE ";
                    }
                    // Dashboad templating vars
                    for (var _i = 0, _a = this.templateSrv.variables; _i < _a.length; _i++) {
                        var myVar = _a[_i];
                        var value = myVar.current.text;
                        if (myVar.current.value === '$__all' && myVar.allValue !== null)
                            value = myVar.allValue;
                        if (isNaN(value) || value.startsWith('0'))
                            value = "'" + value + "'";
                        wsHeader += (value || 'NULL') + " '" + myVar.name + "' STORE ";
                    }
                    return wsHeader;
                };
                Warp10Datasource.prototype.computeTimeVars = function (opts) {
                    var vars = {
                        start: opts.range.from.toDate().getTime() * 1000,
                        startISO: opts.range.from.toISOString(),
                        end: opts.range.to.toDate().getTime() * 1000,
                        endISO: opts.range.to.toISOString(),
                    };
                    vars.interval = vars.end - vars.start;
                    vars.__interval = Math.floor(vars.interval / (opts.maxDataPoints || 1));
                    vars.__interval_ms = Math.floor(vars.__interval / 1000);
                    var str = '';
                    for (var gVar in vars) {
                        str += (isNaN(vars[gVar]) ? "'" + vars[gVar] + "'" : vars[gVar]) + " '" + gVar + "' STORE ";
                    }
                    return str;
                };
                Warp10Datasource.prototype.computePanelRepeatVars = function (opts) {
                    var str = '';
                    if (opts.scopedVars) {
                        for (var k in opts.scopedVars) {
                            var v = opts.scopedVars[k];
                            if (v.selected) {
                                str += "'" + v.value + "' '" + k + "' STORE ";
                            }
                        }
                    }
                    return str;
                };
                return Warp10Datasource;
            }());
            exports_1("default", Warp10Datasource);
        }
    };
});
