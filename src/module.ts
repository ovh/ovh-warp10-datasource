import { loadPluginCss } from 'app/plugins/sdk'

import { Warp10Datasource } from './warp10-datasource'
import { Warp10ConfigCtrl } from './warp10-config.controller'
import { Warp10QueryCtrl } from './warp10-query.controller'
import { Warp10AnnotationQueryCtrl } from './warp10-annotation.controller'
import { Warp10QueryOptionsCtrl } from './warp10-query-options.controller'

function getCSSPath(sheet) {
  return `plugins/grafana-warp10-datasource/style/${ sheet }.css`
}
loadPluginCss({
  dark: getCSSPath('dark'),
  light: getCSSPath('light')
})

export {
  Warp10Datasource as Datasource,
  Warp10QueryCtrl as QueryCtrl,
  Warp10ConfigCtrl as ConfigCtrl,
  Warp10QueryOptionsCtrl as QueryOptionsCtrl,
  Warp10AnnotationQueryCtrl as AnnotationsQueryCtrl
}