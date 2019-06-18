export default class Warp10Datasource {
  id: number = null
  orgId: number = null
  isDefault = false
  name = ''
  type = 'ovh-warp10-datasource'
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
  secureJsonData: any = {}

  secureJsonFields = {}
  withCredentials = false
}
