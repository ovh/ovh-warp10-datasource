'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnnotationsQueryCtrl = exports.QueryOptionsCtrl = exports.ConfigCtrl = exports.QueryCtrl = exports.Datasource = undefined;

var _datasource = require('./datasource');

var _queryController = require('./query-controller');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Warp10ConfigCtrl = function Warp10ConfigCtrl() {
  _classCallCheck(this, Warp10ConfigCtrl);
};

Warp10ConfigCtrl.templateUrl = 'partials/config.html';

var Warp10QueryOptionsCtrl = function Warp10QueryOptionsCtrl() {
  _classCallCheck(this, Warp10QueryOptionsCtrl);
};

Warp10QueryOptionsCtrl.templateUrl = 'partials/query.options.html';

var Warp10AnnotationsQueryCtrl = function Warp10AnnotationsQueryCtrl() {
  _classCallCheck(this, Warp10AnnotationsQueryCtrl);
};

Warp10AnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';

exports.Datasource = _datasource.Warp10Datasource;
exports.QueryCtrl = _queryController.Warp10DatasourceQueryCtrl;
exports.ConfigCtrl = Warp10ConfigCtrl;
exports.QueryOptionsCtrl = Warp10QueryOptionsCtrl;
exports.AnnotationsQueryCtrl = Warp10AnnotationsQueryCtrl;
//# sourceMappingURL=module.js.map
