System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Warp10Datasource;
    return {
        setters: [],
        execute: function () {
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
            exports_1("Warp10Datasource", Warp10Datasource);
        }
    };
});
