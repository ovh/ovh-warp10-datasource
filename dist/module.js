'use strict';

System.register(['./datasource', './query-controller'], function (_export, _context) {
  "use strict";

  var Warp10Datasource, Warp10DatasourceQueryCtrl, Warp10ConfigCtrl, Warp10QueryOptionsCtrl, Warp10AnnotationsQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_datasource) {
      Warp10Datasource = _datasource.Warp10Datasource;
    }, function (_queryController) {
      Warp10DatasourceQueryCtrl = _queryController.Warp10DatasourceQueryCtrl;
    }],
    execute: function () {
      _export('ConfigCtrl', Warp10ConfigCtrl = function Warp10ConfigCtrl() {
        _classCallCheck(this, Warp10ConfigCtrl);
      });

      Warp10ConfigCtrl.templateUrl = 'partials/config.html';

      _export('QueryOptionsCtrl', Warp10QueryOptionsCtrl = function Warp10QueryOptionsCtrl() {
        _classCallCheck(this, Warp10QueryOptionsCtrl);
      });

      Warp10QueryOptionsCtrl.templateUrl = 'partials/query.options.html';

      _export('AnnotationsQueryCtrl', Warp10AnnotationsQueryCtrl = function Warp10AnnotationsQueryCtrl() {
        _classCallCheck(this, Warp10AnnotationsQueryCtrl);
      });

      Warp10AnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';

      _export('Datasource', Warp10Datasource);

      _export('QueryCtrl', Warp10DatasourceQueryCtrl);

      _export('ConfigCtrl', Warp10ConfigCtrl);

      _export('QueryOptionsCtrl', Warp10QueryOptionsCtrl);

      _export('AnnotationsQueryCtrl', Warp10AnnotationsQueryCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
