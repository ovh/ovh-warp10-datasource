import { Warp10Datasource } from './datasource';
import { Warp10DatasourceQueryCtrl } from './query-controller';

class Warp10ConfigCtrl {}
Warp10ConfigCtrl.templateUrl = 'partials/config.html';

class Warp10QueryOptionsCtrl {}
Warp10QueryOptionsCtrl.templateUrl = 'partials/query.options.html';

class Warp10AnnotationsQueryCtrl {}
Warp10AnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html'

export {
  Warp10Datasource as Datasource,
  Warp10DatasourceQueryCtrl as QueryCtrl,
  Warp10ConfigCtrl as ConfigCtrl,
  Warp10QueryOptionsCtrl as QueryOptionsCtrl,
  Warp10AnnotationsQueryCtrl as AnnotationsQueryCtrl
};
