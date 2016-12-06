'use strict';

System.register(['app/plugins/sdk', './css/query-editor.css!'], function (_export, _context) {
  "use strict";

  var QueryCtrl, _createClass, Warp10DatasourceQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      QueryCtrl = _appPluginsSdk.QueryCtrl;
    }, function (_cssQueryEditorCss) {}],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('Warp10DatasourceQueryCtrl', Warp10DatasourceQueryCtrl = function (_QueryCtrl) {
        _inherits(Warp10DatasourceQueryCtrl, _QueryCtrl);

        function Warp10DatasourceQueryCtrl($scope, $injector, uiSegmentSrv) {
          _classCallCheck(this, Warp10DatasourceQueryCtrl);

          var _this = _possibleConstructorReturn(this, (Warp10DatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(Warp10DatasourceQueryCtrl)).call(this, $scope, $injector));

          _this.scope = $scope;
          _this.uiSegmentSrv = uiSegmentSrv;
          _this.target.target = _this.target.target || 'select metric';

          System.import('/public/plugins/grafana-warp10-datasource/editor.js').then(function (editor) {

            // set a random ID
            $scope.textAreaID = Math.trunc(Math.random() * 1000);
            _this.textAreaID = $scope.textAreaID;
            $scope.val = _this.target.expr;

            // When CodeMirror editor change 
            $scope.$watch('val', function (t) {
              //$scope.target.expr = t;
              if ($scope.val != undefined && $scope.val != null) {
                _this.target.expr = $scope.val;
              }
            });
            console.log(uiSegmentSrv);

            // send scope to codeMirror
            _this.editor = editor;
            _this.editor($scope);
          });
          return _this;
        }

        _createClass(Warp10DatasourceQueryCtrl, [{
          key: 'getOptions',
          value: function getOptions() {
            return this.datasource.metricFindQuery(this.target).then(this.uiSegmentSrv.transformToSegments(false));
            // Options have to be transformed by uiSegmentSrv to be usable by metric-segment-model directive
          }
        }, {
          key: 'toggleEditorMode',
          value: function toggleEditorMode() {
            this.target.rawQuery = !this.target.rawQuery;
          }
        }, {
          key: 'onChangeInternal',
          value: function onChangeInternal() {
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
          }
        }]);

        return Warp10DatasourceQueryCtrl;
      }(QueryCtrl));

      _export('Warp10DatasourceQueryCtrl', Warp10DatasourceQueryCtrl);

      Warp10DatasourceQueryCtrl.templateUrl = './partials/query.editor.html';
    }
  };
});
//# sourceMappingURL=query_ctrl.js.map
