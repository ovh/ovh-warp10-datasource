System.register(["app/plugins/sdk", "./query"], function (exports_1, context_1) {
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
    var sdk_1, query_1, Warp10QueryCtrl;
    return {
        setters: [
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (query_1_1) {
                query_1 = query_1_1;
            }
        ],
        execute: function () {
            Warp10QueryCtrl = /** @class */ (function (_super) {
                __extends(Warp10QueryCtrl, _super);
                function Warp10QueryCtrl($scope, uiSegmentSrv, $injector) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.$scope = $scope;
                    _this.uiSegmentSrv = uiSegmentSrv;
                    _this.target.friendlyQuery = Object.assign(new query_1.Warp10Query(), _this.target.friendlyQuery);
                    // acces to static members from dom
                    _this.staticQuery = new query_1.Warp10Query();
                    System.import('plugins/grafana-warp10-datasource/assets/lib/webcomponents-lite.js').then(function (e) {
                        console.log('webcomponent loaded', e);
                    });
                    return _this;
                }
                /*getOptions() {
                  //return Promise.resolve([this.uiSegmentSrv.newSegment('test'), this.uiSegmentSrv.newSegment('abcd')])
                }*/
                Warp10QueryCtrl.prototype._addLabel = function () {
                    if (!this.extraLabelKey || !this.extraLabelValue)
                        return;
                    this.target.friendlyQuery.addLabel(this.extraLabelKey, this.extraLabelValue);
                    this.extraLabelKey = '';
                    this.extraLabelValue = '';
                };
                Warp10QueryCtrl.prototype._delLabel = function (key) {
                    this.target.friendlyQuery.delLabel(key);
                };
                Warp10QueryCtrl.prototype._addReducerLabel = function () {
                    if (!this.extraReducerLabel)
                        return;
                    this.target.friendlyQuery.addReducerLabel(this.extraReducerLabel);
                    this.extraReducerLabel = '';
                };
                Warp10QueryCtrl.prototype._delReducerLabel = function (label) {
                    this.target.friendlyQuery.delReducerLabel(label);
                };
                Warp10QueryCtrl.prototype._addFilterLabel = function () {
                    if (!this.extraFilterLabel)
                        return;
                    this.target.friendlyQuery.addFilterLabel(this.extraFilterLabel);
                    this.extraFilterLabel = '';
                };
                Warp10QueryCtrl.prototype._delFilterLabel = function (label) {
                    this.target.friendlyQuery.delFilterLabel(label);
                };
                Warp10QueryCtrl.prototype._addFilterParamMapLabel = function () {
                    if (!this.extraFilterParamMapKey || !this.extraFilterParamMapValue)
                        return;
                    this.target.friendlyQuery.addFilterParamMapLabel(this.extraFilterParamMapKey, this.extraFilterParamMapValue);
                    this.extraFilterParamMapKey = '';
                    this.extraFilterParamMapValue = '';
                };
                Warp10QueryCtrl.prototype._delFilterParamMapLabel = function (key) {
                    this.target.friendlyQuery.delFilterParamMapLabel(key);
                };
                Warp10QueryCtrl.prototype._buildQuery = function () {
                    this._addLabel();
                    this._addReducerLabel();
                };
                Warp10QueryCtrl.prototype.toggleEditorMode = function () {
                    console.debug('Toggle readonly', this.readOnly);
                    this.readOnly = !this.readOnly;
                };
                Warp10QueryCtrl.prototype.onChangeInternal = function () {
                    var _this = this;
                    clearTimeout(this.changeTicker);
                    this.changeTicker = setTimeout(function () {
                        _this.refresh();
                    }, 1000);
                };
                Warp10QueryCtrl.templateUrl = 'template/query.html';
                return Warp10QueryCtrl;
            }(sdk_1.QueryCtrl));
            exports_1("Warp10QueryCtrl", Warp10QueryCtrl);
        }
    };
});
