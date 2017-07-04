System.register(["./gts", "./query"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var gts_1, query_1, Warp10Datasource;
    return {
        setters: [
            function (gts_1_1) {
                gts_1 = gts_1_1;
            },
            function (query_1_1) {
                query_1 = query_1_1;
            }
        ],
        execute: function () {
            Warp10Datasource = (function () {
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
                    var wsHeader = this.computeTimeVars(opts) + this.computeGrafanaContext();
                    for (var _i = 0, _a = opts.targets; _i < _a.length; _i++) {
                        var query = _a[_i];
                        //if (!query.hide) {
                        console.log('WARP10 QUERY', query);
                        if (query.friendlyQuery)
                            query.friendlyQuery = Object.assign(new query_1.Warp10Query(), query.friendlyQuery);
                        // Grafana can send empty Object at the first time, we need to check is there is something
                        if (query.expr || query.friendlyQuery) {
                            if (query.advancedMode === undefined)
                                query.advancedMode = true;
                            queries.push(wsHeader + "\n" + (query.advancedMode ? query.expr : query.friendlyQuery.warpScript));
                            console.log('New Query: ', (query.advancedMode) ? query.expr : query.friendlyQuery);
                        }
                        //}
                    }
                    queries = queries.map(this.executeExec.bind(this));
                    return this.$q.all(queries)
                        .then(function (responses) {
                        // Grafana formated GTS
                        var data = [];
                        responses.forEach(function (res, i) {
                            if (res.data.type === 'error') {
                                console.error(res.data.value);
                                var d = _this.$q.defer();
                                d.resolve({ data: [] });
                                return d.promise;
                            }
                            var gtss = gts_1.GTS.stackFilter(res.data);
                            for (var _i = 0, gtss_1 = gtss; _i < gtss_1.length; _i++) {
                                var gts = gtss_1[_i];
                                var grafanaGts = {
                                    target: (opts.targets[i].hideLabels) ? gts.c : gts.nameWithLabels,
                                    datapoints: []
                                };
                                for (var _a = 0, _b = gts.v; _a < _b.length; _a++) {
                                    var dp = _b[_a];
                                    grafanaGts.datapoints.push([dp[dp.length - 1], dp[0] / 1000]);
                                }
                                data.push(grafanaGts);
                            }
                        });
                        return { data: data };
                    });
                };
                /**
                 * used by datasource configuration page to make sure the connection is working
                 * @return {Promise<any>} response
                 */
                Warp10Datasource.prototype.testDatasource = function () {
                    return this.executeExec('1 2 +')
                        .then(function (res) {
                        console.debug('Success', res);
                        if (res.data[0] != 3) {
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
                    return this.executeExec(ws)
                        .then(function (res) {
                        var annotations = [];
                        if (!gts_1.GTS.isGTS(res.data[0])) {
                            console.error("An annotation query must return exactly 1 GTS on top of the stack, annotation: " + opts.annotation.name);
                            var d = _this.$q.defer();
                            d.resolve([]);
                            return d.promise;
                        }
                        var gts = Object.assign(new gts_1.GTS(), res.data[0]);
                        var tags = [];
                        for (var label in gts.l) {
                            tags.push(label + ":" + gts.l[label]);
                        }
                        for (var _i = 0, _a = gts.v; _i < _a.length; _i++) {
                            var dp = _a[_i];
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
                        }
                        return annotations;
                    });
                };
                /**
                 * used by query editor to get metric suggestions.
                 * @param options
                 * @return {Promise<any>}
                 */
                Warp10Datasource.prototype.metricFindQuery = function (ws) {
                    console.log("metricFindQuery OPTS", ws);
                    return this.executeExec(this.computeGrafanaContext() + ws)
                        .then(function (res) {
                        // only one object on the stack, good user
                        if (res.data.length === 1 && typeof res.data[0] === 'object') {
                            var entries = [];
                            for (var _i = 0, _a = res.data[0]; _i < _a.length; _i++) {
                                var key = _a[_i];
                                entries.push({
                                    text: key,
                                    value: res.data[0][key]
                                });
                            }
                            return entries;
                        }
                        // some elements on the stack, return all of them as entry
                        return res.data.map(function (entry, i) {
                            console.log('ENTRY', typeof entry);
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
                Warp10Datasource.prototype.executeExec = function (ws) {
                    return this.backendSrv.datasourceRequest({
                        method: 'POST',
                        url: this.instanceSettings.url + '/api/v0/exec',
                        data: ws,
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
                    console.debug('CONTEXT', this.instanceSettings.jsonData);
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
                    console.log('TEMPLATING', this.templateSrv);
                    for (var _i = 0, _a = this.templateSrv.variables; _i < _a.length; _i++) {
                        var myVar = _a[_i];
                        var value = (!!myVar.current.value) ? myVar.current.value : myVar.current.text;
                        if (isNaN(value) || value.startsWith('0'))
                            value = "'" + value + "'";
                        wsHeader += (value || 'NULL') + " '" + myVar.name + "' STORE ";
                    }
                    return wsHeader;
                };
                Warp10Datasource.prototype.computeTimeVars = function (opts) {
                    var end = opts.range.to.toDate().getTime() * 1000;
                    var start = opts.range.from.toDate().getTime() * 1000;
                    var interval = end - start;
                    var startISO = opts.range.from.toISOString();
                    var endISO = opts.range.to.toISOString();
                    return end + " 'end' STORE " + start + " 'start' STORE '" + endISO + "' 'endISO' STORE '" + startISO + "' 'startISO' STORE " + interval + " 'interval' STORE ";
                };
                return Warp10Datasource;
            }());
            exports_1("Warp10Datasource", Warp10Datasource);
        }
    };
});
