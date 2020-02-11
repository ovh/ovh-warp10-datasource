System.register(["./gts", "./table", "./geo", "./query"], function (exports_1, context_1) {
    "use strict";
    var gts_1, table_1, geo_1, query_1, Warp10Datasource;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (gts_1_1) {
                gts_1 = gts_1_1;
            },
            function (table_1_1) {
                table_1 = table_1_1;
            },
            function (geo_1_1) {
                geo_1 = geo_1_1;
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
                                query.advancedMode = false;
                            query.ws = wsHeader + "\n" + (query.advancedMode ? query.expr : query.friendlyQuery.warpScript);
                            queries.push(query);
                            console.debug('New Query: ', query.ws);
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
                        responses.forEach(function (response, i) {
                            var res = response.result;
                            if (res.data.type === 'error') {
                                console.error(res.data.value);
                                return;
                            }
                            // is it for a Table graph ?
                            if (res.data.length === 1 && res.data[0] && table_1.Table.isTable(res.data[0])) {
                                var t = res.data[0];
                                t.type = 'table';
                                data.push(t);
                                return;
                            }
                            // World-map panel data type
                            if (res.data.length === 1 && res.data[0] && geo_1.isGeoJson(res.data[0])) {
                                var t = res.data[0];
                                t.type = 'table';
                                data = t;
                                return;
                            }
                            gts_1.default.stackFilter(res.data).forEach(function (gts) {
                                var grafanaGts = {
                                    target: (opts.targets[i].hideLabels) ? gts.c : gts.nameWithLabels,
                                    datapoints: [],
                                    refId: (response.query || {}).refId
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
                        var headers = err.headers ? err.headers() : {};
                        // security: ensure both error description headers are here.
                        var errorline = -1;
                        var errorMessage = "Unable to read x-warp10-error-line and x-warp10-error-line headers in server answer";
                        if (headers['x-warp10-error-line'] !== undefined && headers['x-warp10-error-message'] !== undefined) {
                            var wsHeadersOffset_1 = wsHeader.split('\n').length;
                            errorline = Number.parseInt(headers['x-warp10-error-line']) - wsHeadersOffset_1;
                            errorMessage = headers['x-warp10-error-message'];
                            // We must substract the generated header size everywhere in the error message.
                            errorMessage = errorMessage.replace(/\[Line #(\d+)\]/g, function (match, group1) { return '[Line #' + (Number.parseInt(group1) - wsHeadersOffset_1).toString() + ']'; });
                            // Also print the full error in the console
                        }
                        console.warn('[Warp 10] Failed to execute query', err);
                        var d = _this.$q.defer();
                        // Grafana handle this nicely !
                        throw { message: "WarpScript Failure on Line " + errorline + ", " + errorMessage };
                    });
                };
                /**
                 * used by datasource configuration page to make sure the connection is working
                 * @return {Promise<any>} response
                 */
                Warp10Datasource.prototype.testDatasource = function () {
                    return this.executeExec({ ws: '1 2 +' })
                        .then(function (response) {
                        var res = response.result;
                        if (res.data[0] !== 3) {
                            return {
                                status: 'error',
                                message: JSON.parse(res.data) || res.data,
                                title: 'Failed to execute basic WarpScript™'
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
                            title: 'Failed to contact Warp 10 Platform'
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
                        .then(function (response) {
                        var res = response.result;
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
                                    tags: tags
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
                        .then(function (response) {
                        var res = response.result;
                        if (!Array.isArray(res.data)) {
                            throw new Error('Warp 10 expects the response to be a stack (an array), it isn\'t');
                        }
                        // Grafana can handle different text/value for the variable drop list. User has three possibilites in the WarpScript result:
                        // 1 - let a list on the stack : text = value for each entry.
                        // 2 - let a map on the stack : text = map key, value = map value. value will be used in the WarpScript variable.
                        // 3 - let some strings or numbers on the stack : it will be considered as a list, refer to case 1.
                        // Values could be strings or number, ignore other objects.
                        var entries = [];
                        if (1 == res.data.length && Array.isArray(res.data[0])) {
                            // case 1
                            res.data[0].forEach(function (elt) {
                                if (typeof elt === 'string' || elt instanceof String || typeof elt === 'number') {
                                    entries.push({
                                        text: elt.toString(),
                                        value: elt.toString() // Grafana will turn every value to strings anyway !
                                    });
                                }
                            });
                        }
                        else if (res.data.length === 1 && typeof res.data[0] === 'object') {
                            // case 2
                            Object.keys(res.data[0]).forEach(function (key) {
                                var value = res.data[0][key];
                                if (typeof value === 'string' || value instanceof String || typeof value === 'number') {
                                    entries.push({
                                        text: key.toString(),
                                        value: value.toString() // Grafana will turn every value to strings anyway !
                                    });
                                }
                            });
                        }
                        else {
                            // case 3
                            res.data.forEach(function (elt) {
                                if (typeof elt === 'string' || elt instanceof String || typeof elt === 'number') {
                                    entries.push({
                                        text: elt.toString(),
                                        value: elt.toString() // Grafana will turn every value to strings anyway !
                                    });
                                }
                            });
                        }
                        return entries;
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
                    }).then(function (res) {
                        return {
                            result: res,
                            query: query
                        };
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
                        wsHeader += (value || 'NULL') + " '" + myVar + "' STORE\n";
                    }
                    // Dashboad templating vars
                    // current.text is the label. In case of multivalue, it is a string 'valueA + valueB'
                    // current.value is a string, depending on query output. In case of multivalue, it is an array of strings. array contains "$__all" if user selects All.
                    for (var _i = 0, _a = this.templateSrv.variables; _i < _a.length; _i++) {
                        var myVar = _a[_i];
                        var value = myVar.current.value;
                        if (((Array.isArray(value) && (value.length == 1 && value[0] === '$__all')) || value === "$__all")) {
                            // User checked the "select all" checkbox
                            if (myVar.allValue && myVar.allValue !== "") {
                                // User also defined a custom value in the variable settings
                                var customValue = myVar.allValue;
                                wsHeader += "[ '" + customValue + "' ] '" + myVar.name + "_list' STORE\n";
                                // custom all value is taken as it is. User may or may not use a regexp.
                                wsHeader += " '" + customValue + "' '" + myVar.name + "' STORE\n";
                            }
                            else {
                                // if no custom all value is defined :
                                // it means we shall create a list of all the values in WarpScript from options, ignoring "$__all" special option value.
                                var allValues = myVar.options.filter(function (o) { return o.value !== "$__all"; }).map(function (o) { return o.value; });
                                wsHeader += "[ " + allValues.map(function (s) { return "'" + s + "'"; }).join(" ") + " ] '" + myVar.name + "_list' STORE\n"; // all is stored as string in generated WarpScript.
                                // create a ready to use regexp in the variable
                                wsHeader += " '~' $" + myVar.name + "_list REOPTALT + '" + myVar.name + "' STORE\n";
                            }
                        }
                        else if (Array.isArray(value)) {
                            // user checks several choices
                            wsHeader += "[ " + value.map(function (s) { return "'" + s + "'"; }).join(" ") + " ] '" + myVar.name + "_list' STORE\n"; // all is stored as string in generated WarpScript.
                            if (1 == value.length) {
                                // one value checked : copy it as it is in WarpScript variable
                                wsHeader += " '" + value[0] + "' '" + myVar.name + "' STORE\n";
                            }
                            else {
                                // several values checked : do a regexp
                                //also create a ready to use regexp, suffixed by _wsregexp
                                wsHeader += " '~' $" + myVar.name + "_list REOPTALT + '" + myVar.name + "' STORE\n";
                            }
                        }
                        else {
                            // no multiple selection, variable is the string. As type is lost by Grafana, there is no safe way to assume something different than a string here.
                            // List is also created to create scripts compatible whatever the defined selection mode
                            wsHeader += "[ '" + value + "' ] '" + myVar.name + "_list' STORE\n";
                            wsHeader += "'" + value + "' '" + myVar.name + "' STORE\n";
                        }
                    }
                    wsHeader += "LINEON\n";
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
                            if (v.selected || this.scopedVarIsAll(k)) {
                                str += "'" + v.value + "' '" + k + "' STORE ";
                            }
                        }
                    }
                    return str;
                };
                /**
                 * Test if a named scoped variable is set to all
                 *
                 * @param name string The name of scoped variable
                 * @return bool If the scoped variable is set to all
                 */
                Warp10Datasource.prototype.scopedVarIsAll = function (name) {
                    for (var i = 0; i < this.templateSrv.variables.length; i++) {
                        var v = this.templateSrv.variables[i];
                        if (v.name === name && v.current.value.length === 1 && v.current.value[0] === '$__all') {
                            return true;
                        }
                    }
                    return false;
                };
                return Warp10Datasource;
            }());
            exports_1("default", Warp10Datasource);
        }
    };
});
