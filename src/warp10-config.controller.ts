import { Warp10Datasource } from './datasource'

export class Warp10ConfigCtrl {

  static templateUrl = 'template/config.html'
  current: Warp10Datasource

  // Dom needs
  newExtraKey: any
  newExtraVal: any

  constructor(private backendSrv: any, private $routeParams: any) {
    this.current = new Warp10Datasource()
    this.current.id = this.$routeParams.id
    if (this.current.id)
      this._loadDatasourceConfig()
  }

  _loadDatasourceConfig() {
    this.backendSrv.get('/api/datasources/' + this.current.id)
    .then((ds: any) => {
      Object.assign(this.current, ds)
    })
  }

  _addExtraVar() {
    console.log(this.newExtraKey,  this.newExtraVal, typeof this.newExtraVal)
    if (this.newExtraKey && this.newExtraVal) {
      this.current.jsonData[this.newExtraKey] = this.newExtraVal
      this.newExtraKey = ''
      this.newExtraVal = ''
    }
  }

  _delExtraVar(key) {
    delete this.current.jsonData[key]
  }
}
