import {QueryCtrl} from 'app/plugins/sdk';

export class Warp10DatasourceQueryCtrl extends QueryCtrl {

  constructor($scope, $injector, uiSegmentSrv)  {
    super($scope, $injector);
    this.scope = $scope;
    this.uiSegmentSrv = uiSegmentSrv;
    this.target.target = this.target.target || 'select metric';

    System.import('/public/plugins/grafana-warp10-datasource/editor.js')
    .then( (editor) => {

      // set a random ID
      this.scope.textAreaID = Math.trunc(Math.random() * 10000);
      this.textAreaID = $scope.textAreaID;

      if (!this.target.expr) this.target.expr = "";

      console.log('EDITOR', editor)
      // send controler to Ace
      this.editor = editor.Editor;
      this.editor(this);
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
  }
}
Warp10DatasourceQueryCtrl.templateUrl = './partials/query.editor.html';