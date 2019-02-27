System.register([], function (exports_1, context_1) {
    "use strict";
    var Table, Column;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Table = /** @class */ (function () {
                function Table() {
                    this.type = 'table';
                }
                Table.isTable = function (o) {
                    return o.columns
                        && o.rows
                        && Array.isArray(o.rows)
                        && Array.isArray(o.columns);
                };
                return Table;
            }());
            exports_1("Table", Table);
            Column = /** @class */ (function () {
                function Column() {
                }
                return Column;
            }());
            exports_1("Column", Column);
        }
    };
});
