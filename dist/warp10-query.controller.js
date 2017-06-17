System.register(["app/plugins/sdk"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    var sdk_1, Warp10QueryCtrl;
    return {
        setters: [
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }
        ],
        execute: function () {
            Warp10QueryCtrl = (function (_super) {
                __extends(Warp10QueryCtrl, _super);
                function Warp10QueryCtrl($scope, $injector, uiSegmentSrv) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.uiSegmentSrv = uiSegmentSrv;
                    _this.target.target = _this.target.target || 'select metric';
                    _this.advancedMode = true;
                    _this.className = '';
                    _this.bucketizer = {};
                    _this.bucketizers = [
                        'sum', 'max', 'min', 'mean', 'mean.circular', 'bucketizer.mean.circular.exclude-nulls', 'first', 'last', 'join', 'median', 'count', 'and', 'or'
                    ];
                    return _this;
                }
                /*getOptions() {
                  //return Promise.resolve([this.uiSegmentSrv.newSegment('test'), this.uiSegmentSrv.newSegment('abcd')])
                }*/
                Warp10QueryCtrl.prototype.toggleEditorMode = function () {
                    this.readOnly = !this.readOnly;
                };
                Warp10QueryCtrl.prototype.onChangeInternal = function () {
                    var _this = this;
                    clearTimeout(this.changeTicker);
                    this.changeTicker = setTimeout(function () {
                        _this.refresh();
                    }, 1000);
                };
                return Warp10QueryCtrl;
            }(sdk_1.QueryCtrl));
            Warp10QueryCtrl.templateUrl = 'template/query.html';
            exports_1("Warp10QueryCtrl", Warp10QueryCtrl);
        }
    };
});
