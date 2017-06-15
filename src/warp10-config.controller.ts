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
    this
    .backendSrv
    .get('/api/datasources/' + this.current.id)
    .then((ds: any) => {
      Object.assign(this.current, ds)
    })
  }

  _addExtraVar() {
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

class Warp10Datasource {
  id: number = null
  orgId: number = null
  isDefault = false
  name = ''
  type = 'grafana-warp10-datasource'
  access = 'direct'

  user = ''
  password = ''

  url = 'https://warp.domain.tld'
  typeLogoUrl = ''

  basicAuth = false
  basicAuthUser = ''
  basicAuthPassword = ''

  database = ''
  jsonData: any = {}

  secureJsonFields = {}
  withCredentials = false
}
