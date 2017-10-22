import { QueryCtrl }   from 'app/plugins/sdk'
import { Warp10Query } from './query'

export class Warp10QueryCtrl extends QueryCtrl {

  static templateUrl = 'template/query.html'
  target: {
    friendlyQuery: Warp10Query,
    hide: boolean,
    target: string
  }
  changeTicker: any
  staticQuery: Warp10Query

  extraLabelKey: string
  extraLabelValue: string
  extraReducerLabel: string
  extraFilterLabel: string
  extraFilterParamMapKey: string
  extraFilterParamMapValue: string

  readOnly: boolean

  constructor(public $scope: any, private uiSegmentSrv: any, $injector: any) {
    super($scope, $injector)
    this.target.friendlyQuery = Object.assign(new Warp10Query(), this.target.friendlyQuery)
    // acces to static members from dom
    this.staticQuery = new Warp10Query()
    System.import('plugins/grafana-warp10-datasource/assets/lib/webcomponents-lite.js')
    .then((e) => {
      console.log('webcomponent loaded', e)
    })
    .catch((e) => {
      console.log("It's ok, it's not a module", e)
    })
  }

  /*getOptions() {
    //return Promise.resolve([this.uiSegmentSrv.newSegment('test'), this.uiSegmentSrv.newSegment('abcd')])
  }*/

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

  toggleEditorMode() {
    console.debug('Toggle readonly', this.readOnly)
    this.readOnly = !this.readOnly
  }

  onChangeInternal() {
    clearTimeout(this.changeTicker)
    this.changeTicker = setTimeout(() => {
      this.refresh()
    }, 1000)
  }
}
