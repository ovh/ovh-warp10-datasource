import {QueryCtrl} from 'app/plugins/sdk'

export class Warp10QueryCtrl extends QueryCtrl {

  static templateUrl = 'template/query.html'
  uiSegmentSrv: any
  target: any

  className: string
  readToken: string
  bucketizer: any

  readOnly: boolean
  advancedMode: boolean

  bucketizers: string[]

  constructor($scope, $injector, uiSegmentSrv) {
    super($scope, $injector)

    this.uiSegmentSrv = uiSegmentSrv
    this.target.target = this.target.target || 'select metric'
    this.advancedMode = true
    this.className = ''

    this.bucketizer = {}
    this.bucketizers = [
      'sum', 'max', 'min', 'mean', 'mean.circular', 'bucketizer.mean.circular.exclude-nulls', 'first', 'last', 'join', 'median', 'count', 'and', 'or'
    ]
  }

  /*getOptions() {
    //return Promise.resolve([this.uiSegmentSrv.newSegment('test'), this.uiSegmentSrv.newSegment('abcd')])
  }*/

  toggleEditorMode() {
    this.readOnly = !this.readOnly
  }

  onChangeInternal() {}
}
