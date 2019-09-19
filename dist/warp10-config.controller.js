System.register([], function (exports_1, context_1) {
    "use strict";
    var Warp10ConfigCtrl;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Warp10ConfigCtrl = /** @class */ (function () {
                function Warp10ConfigCtrl(backendSrv, $routeParams) {
                    this.backendSrv = backendSrv;
                    this.$routeParams = $routeParams;
                    console.debug('[Warp 10] ConfigController', this);
                    if (!this.current.secureJsonData) {
                        this.current.secureJsonData = {};
                    }
                    if (!this.current.secureJsonFields) {
                        this.current.secureJsonFields = {};
                    }
                }
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
