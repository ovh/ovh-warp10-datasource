///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import { QueryCtrl }   from 'app/plugins/sdk'
import Query from './query'
import initWarp10AceMode from './ace-mode-warpscript'

function initAce () {
  if (! initWarp10AceMode()) {
    setTimeout(initAce, 500);
  }
}
initAce()

export default class Warp10QueryCtrl extends QueryCtrl {

  static templateUrl = 'template/query.html'
  target: {
    friendlyQuery: Query,
    hide: boolean,
    expr: string
  }
  changeTicker: any
  staticQuery: Query

  extraLabelKey: string
  extraLabelValue: string
  extraReducerLabel: string
  extraFilterLabel: string
  extraFilterParamMapKey: string
  extraFilterParamMapValue: string

  readOnly: boolean

  constructor(public $scope: any, private uiSegmentSrv: any, $injector: any) {
    super($scope, $injector)
    this.target.friendlyQuery = Object.assign(new Query(), this.target.friendlyQuery)
    // acces to static members from dom
    this.staticQuery = new Query()

    // prevent wrapped ace-editor to crash
    if (!this.target.expr) this.target.expr = ''
  }

  _addLabel() {
    if (!this.extraLabelKey || !this.extraLabelValue) return
    this.target.friendlyQuery.addLabel(this.extraLabelKey, this.extraLabelValue)
    this.extraLabelKey = ''
    this.extraLabelValue = ''
  }

  _delLabel(key) {
    this.target.friendlyQuery.delLabel(key)
  }

  _addReducerLabel() {
    if (!this.extraReducerLabel) return
    this.target.friendlyQuery.addReducerLabel(this.extraReducerLabel)
    this.extraReducerLabel = ''
  }

  _delReducerLabel(label) {
    this.target.friendlyQuery.delReducerLabel(label)
  }

  _addFilterLabel() {
    if (!this.extraFilterLabel) return
    this.target.friendlyQuery.addFilterLabel(this.extraFilterLabel)
    this.extraFilterLabel = ''
  }

  _delFilterLabel(label) {
    this.target.friendlyQuery.delFilterLabel(label)
  }

  _addFilterParamMapLabel() {
    if (!this.extraFilterParamMapKey || !this.extraFilterParamMapValue) return
    this.target.friendlyQuery.addFilterParamMapLabel(this.extraFilterParamMapKey, this.extraFilterParamMapValue)
    this.extraFilterParamMapKey = ''
    this.extraFilterParamMapValue = ''
  }

  _delFilterParamMapLabel(key) {
    this.target.friendlyQuery.delFilterParamMapLabel(key)
  }

  _buildQuery() {
    this._addLabel()
    this._addReducerLabel()
  }

  getCompleter(...o) {
    console.debug('[Warp 10 Query] COMPLETER called', o)
  }

  toggleEditorMode() {
    console.debug('Toggle readonly', this.readOnly)
    this.readOnly = !this.readOnly
  }

  onChangeInternal = () => {
    this.refresh()
  }
}
