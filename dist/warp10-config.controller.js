System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Warp10ConfigCtrl, Warp10Datasource;
    return {
        setters: [],
        execute: function () {
            Warp10ConfigCtrl = (function () {
                function Warp10ConfigCtrl(backendSrv, $routeParams) {
                    this.backendSrv = backendSrv;
                    this.$routeParams = $routeParams;
                    this.current = new Warp10Datasource();
                    this.current.id = this.$routeParams.id;
                    if (this.current.id)
                        this._loadDatasourceConfig();
                }
                Warp10ConfigCtrl.prototype._loadDatasourceConfig = function () {
                    var _this = this;
                    this
                        .backendSrv
                        .get('/api/datasources/' + this.current.id)
                        .then(function (ds) {
                        Object.assign(_this.current, ds);
                    });
                };
                Warp10ConfigCtrl.prototype._addExtraVar = function () {
                    if (this.newExtraKey && this.newExtraVal) {
                        this.current.jsonData[this.newExtraKey] = this.newExtraVal;
                        this.newExtraKey = '';
                        this.newExtraVal = '';
                    }
                };
                Warp10ConfigCtrl.prototype._delExtraVar = function (key) {
                    delete this.current.jsonData[key];
                };
                return Warp10ConfigCtrl;
            }());
            Warp10ConfigCtrl.templateUrl = 'template/config.html';
            exports_1("Warp10ConfigCtrl", Warp10ConfigCtrl);
            Warp10Datasource = (function () {
                function Warp10Datasource() {
                    this.id = null;
                    this.orgId = null;
                    this.isDefault = false;
                    this.name = '';
                    this.type = 'grafana-warp10-datasource';
                    this.access = 'direct';
                    this.user = '';
                    this.password = '';
                    this.url = 'https://warp.domain.tld';
                    this.typeLogoUrl = '';
                    this.basicAuth = false;
                    this.basicAuthUser = '';
                    this.basicAuthPassword = '';
                    this.database = '';
                    this.jsonData = {};
                    this.secureJsonFields = {};
                    this.withCredentials = false;
                }
                return Warp10Datasource;
            }());
        }
    };
});
