import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'
import './css/codemirror.css!'
import './css/monokai-theme.css!'


export class Warp10DatasourceQueryCtrl extends QueryCtrl {

  constructor($scope, $injector, uiSegmentSrv)  {
    super($scope, $injector);
    this.scope = $scope;
    this.uiSegmentSrv = uiSegmentSrv;
    this.target.target = this.target.target || 'select metric';

    System.import('/public/plugins/grafana-warp10-datasource/editor.js')
    .then( (editor) => {
      
      // set a random ID
      this.textAreaID = Math.trunc(Math.random() * 1000);
       
      // When CodeMirror editor change 
      $scope.$watch('val', (t) => {
        //$scope.target.expr = t;
        if ($scope.val != undefined && $scope.val != null) {
          this.target.expr = $scope.val;
        }
      });


      // send scope to codeMirror
      this.editor = editor;
      editor($scope)
    }); 
  }

  getOptions() {
    return this.datasource.metricFindQuery(this.target)
      .then(this.uiSegmentSrv.transformToSegments(false));
      // Options have to be transformed by uiSegmentSrv to be usable by metric-segment-model directive
  }

  toggleEditorMode() {
    this.target.rawQuery = !this.target.rawQuery;
  }

  onChangeInternal() {
    this.panelCtrl.refresh(); // Asks the panel to refresh data.
    this.editor($scope);
  }
}

Warp10DatasourceQueryCtrl.templateUrl = './partials/query.editor.html';