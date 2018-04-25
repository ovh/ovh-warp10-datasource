System.register(["./datasource"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var datasource_1, Warp10ConfigCtrl;
    return {
        setters: [
            function (datasource_1_1) {
                datasource_1 = datasource_1_1;
            }
        ],
        execute: function () {
            Warp10ConfigCtrl = /** @class */ (function () {
                function Warp10ConfigCtrl(backendSrv, $routeParams) {
                    this.backendSrv = backendSrv;
                    this.$routeParams = $routeParams;
                    this.current = new datasource_1.default();
                    this.current.id = this.$routeParams.id;
                    if (this.current.id)
                        this._loadDatasourceConfig();
                }
                Warp10ConfigCtrl.prototype._loadDatasourceConfig = function () {
                    var _this = this;
                    this.backendSrv.get('/api/datasources/' + this.current.id)
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
                Warp10ConfigCtrl.prototype._editKey = function (key) {
                    this.newExtraKey = key;
                    this.newExtraVal = this.current.jsonData[key];
                };
                Warp10ConfigCtrl.templateUrl = 'template/config.html';
                return Warp10ConfigCtrl;
            }());
            exports_1("default", Warp10ConfigCtrl);
        }
    };
});
