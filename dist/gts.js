System.register([], function (exports_1, context_1) {
    "use strict";
    var GTS;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            GTS = /** @class */ (function () {
                function GTS() {
                }
                Object.defineProperty(GTS.prototype, "nameWithLabels", {
                    get: function () {
                        var keyValues = [];
                        for (var key in this.l) {
                            keyValues.push(key + "=" + this.l[key]);
                        }
                        return this.c + "{" + keyValues.join(',') + "}";
                    },
                    enumerable: false,
                    configurable: true
                });
                /**
                 * Determine if an object is a GTS
                 * @param {Object} g object to test
                 * @return {boolean} is it a GTS ?
                 */
                GTS.isGTS = function (g) {
                    return g != undefined
                        && g.hasOwnProperty('c')
                        && g.hasOwnProperty('v')
                        && g.hasOwnProperty('l')
                        && typeof g.c === 'string'
                        && typeof g.l === 'object'
                        && Array.isArray(g.v);
                };
                /**
                 * Check all elements of any array to know if there are only GTS types
                 * @param {Array<any>} gs array to check
                 * @return {boolean} contains only GTS types ?
                 */
                GTS.isGTSArray = function (gs) {
                    if (!Array.isArray(gs))
                        return false;
                    for (var _i = 0, gs_1 = gs; _i < gs_1.length; _i++) {
                        var g = gs_1[_i];
                        if (!GTS.isGTS(g))
                            return false;
                    }
                    return true;
                };
                /**
                 * Return all the GTS in 1 array
                 * @param {Array<any>} stack object where looking for
                 * @return {Array<GTS>} all GTS
                 */
                GTS.stackFilter = function (stack) {
                    var gtss = [];
                    for (var _i = 0, stack_1 = stack; _i < stack_1.length; _i++) {
                        var entry = stack_1[_i];
                        if (GTS.isGTS(entry))
                            gtss.push(Object.assign(new GTS(), entry));
                        else if (GTS.isGTSArray(entry)) {
                            gtss = gtss.concat(entry.map(function (gts) {
                                return Object.assign(new GTS(), gts);
                            }));
                        }
                    }
                    return gtss;
                };
                Object.defineProperty(GTS.prototype, "formatedAttributes", {
                    /**
                     * Return all GTS attributes
                     * @return {string} all GTS
                     */
                    get: function () {
                        var attrs = [];
                        for (var attr in this.a) {
                            attrs.push(attr + "=" + this.a[attr]);
                        }
                        return "{" + attrs.join(',') + "}";
                    },
                    enumerable: false,
                    configurable: true
                });
                return GTS;
            }());
            exports_1("default", GTS);
        }
    };
});
