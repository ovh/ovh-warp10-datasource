System.register(["app/plugins/sdk", "./warp10-datasource", "./warp10-config.controller", "./warp10-query.controller", "./warp10-annotation.controller", "./warp10-query-options.controller"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function getCSSPath(sheet) {
        return "plugins/grafana-warp10-datasource/style/" + sheet + ".css";
    }
    var sdk_1, warp10_datasource_1, warp10_config_controller_1, warp10_query_controller_1, warp10_annotation_controller_1, warp10_query_options_controller_1;
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
            },
            function (warp10_query_controller_1_1) {
                warp10_query_controller_1 = warp10_query_controller_1_1;
            },
            function (warp10_annotation_controller_1_1) {
                warp10_annotation_controller_1 = warp10_annotation_controller_1_1;
            },
            function (warp10_query_options_controller_1_1) {
                warp10_query_options_controller_1 = warp10_query_options_controller_1_1;
            }
        ],
        execute: function () {
            exports_1("Datasource", warp10_datasource_1.Warp10Datasource);
            exports_1("ConfigCtrl", warp10_config_controller_1.Warp10ConfigCtrl);
            exports_1("QueryCtrl", warp10_query_controller_1.Warp10QueryCtrl);
            exports_1("AnnotationsQueryCtrl", warp10_annotation_controller_1.Warp10AnnotationQueryCtrl);
            exports_1("QueryOptionsCtrl", warp10_query_options_controller_1.Warp10QueryOptionsCtrl);
            sdk_1.loadPluginCss({
                dark: getCSSPath('dark'),
                light: getCSSPath('light')
            });
        }
    };
});
