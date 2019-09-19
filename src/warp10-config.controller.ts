import Datasource from './datasource'

export default class Warp10ConfigCtrl {

  static templateUrl = 'template/config.html'
  current: Datasource

  // Dom needs
  newExtraKey: any
  newExtraVal: any
  newSecretKey: string
  newSecretVal: string

  constructor(private backendSrv: any, private $routeParams: any) {
    console.debug('[Warp 10] ConfigController', this)

    if (!this.current.secureJsonData) {
      this.current.secureJsonData = {}
    }
    if (!this.current.secureJsonFields) {
      this.current.secureJsonFields = {}
    }
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

  _editKey(key) {
    this.newExtraKey = key
    this.newExtraVal = this.current.jsonData[key]
  }

  /*_addSecretVar() {
    if (this.newSecretKey && this.newSecretVal) {
      this.current.secureJsonData[this.newSecretKey] = this.newSecretVal
      //this.current.secureJsonFields[this.newSecretKey] = this.newSecretVal
      this.newSecretKey = ''
      this.newSecretVal = ''
    }
    console.debug(this)
  }

  _delSecretVar(key) {
     this.current.secureJsonData[key] = undefined
     this.current.secureJsonFields[key] = undefined
  }*/
}
