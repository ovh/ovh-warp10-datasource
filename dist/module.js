System.register(["app/plugins/sdk", "./warp10-datasource", "./warp10-config.controller"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function getCSSPath(sheet) {
        return "plugins/grafana-warp10-datasource/style/" + sheet + ".css";
    }
    var sdk_1, warp10_datasource_1, warp10_config_controller_1, Warp10DatasourceQueryCtrl, Warp10QueryOptionsCtrl, Warp10AnnotationsQueryCtrl;
    return {
        setters: [
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (warp10_datasource_1_1) {
                warp10_datasource_1 = warp10_datasource_1_1;
            },
            function (warp10_config_controller_1_1) {
                warp10_config_controller_1 = warp10_config_controller_1_1;
            }
        ],
        execute: function () {
            sdk_1.loadPluginCss({
                dark: getCSSPath('dark'),
                light: getCSSPath('light')
            });
            exports_1("Datasource", warp10_datasource_1.Warp10Datasource);
            exports_1("ConfigCtrl", warp10_config_controller_1.Warp10ConfigCtrl);
            Warp10DatasourceQueryCtrl = (function () {
                function Warp10DatasourceQueryCtrl() {
                }
                return Warp10DatasourceQueryCtrl;
            }());
            exports_1("QueryCtrl", Warp10DatasourceQueryCtrl);
            Warp10QueryOptionsCtrl = (function () {
                function Warp10QueryOptionsCtrl() {
                }
                return Warp10QueryOptionsCtrl;
            }());
            exports_1("QueryOptionsCtrl", Warp10QueryOptionsCtrl);
            Warp10AnnotationsQueryCtrl = (function () {
                function Warp10AnnotationsQueryCtrl() {
                }
                return Warp10AnnotationsQueryCtrl;
            }());
            exports_1("AnnotationsQueryCtrl", Warp10AnnotationsQueryCtrl);
        }
    };
});
