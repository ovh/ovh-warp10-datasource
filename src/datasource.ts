export default class Warp10Datasource {
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