///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import { loadPluginCss } from 'app/plugins/sdk'

import Datasource from './warp10-datasource'
import ConfigCtrl from './warp10-config.controller'
import QueryCtrl from './warp10-query.controller'
import AnnotationsQueryCtrl from './warp10-annotation.controller'
import QueryOptionsCtrl from './warp10-query-options.controller'

function getCSSPath(sheet) {
  return `plugins/ovh-warp10-datasource/style/${ sheet }.css`
}

loadPluginCss({
  dark: getCSSPath('dark'),
  light: getCSSPath('light')
})

export {
  Datasource,
  QueryCtrl,
  ConfigCtrl,
  AnnotationsQueryCtrl
}
