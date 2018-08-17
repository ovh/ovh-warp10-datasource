System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * Check if object is an array of geo data
     * @param o object to check
     * @returns bool is it ?
     */
    function isGeoJson(o) {
        if (!Array.isArray(o))
            return false;
        for (var _i = 0, o_1 = o; _i < o_1.length; _i++) {
            var d = o_1[_i];
            if (!d.latitude || !d.longitude)
                return false;
        }
        return true;
    }
    exports_1("isGeoJson", isGeoJson);
    return {
        setters: [],
        execute: function () {
        }
    };
});
