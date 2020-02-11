import QueryOptions from './interfaces/query-options'
import AnnotationOptions from './interfaces/annotation-options'
import GTS from './gts'
import { Table } from './table'
import { isGeoJson } from './geo'
import Query from './query'

export default class Warp10Datasource {

  constructor(private instanceSettings: any,
    private $q: any,
    private backendSrv: any,
    private templateSrv: any,
    private $log: any) {}

  /**
   * used by panels to get data
   * @param options
   * @return {Promise<any>} Grafana datapoints set
   */
  query(opts: QueryOptions): Promise<any> {
    let queries = []
    let wsHeader = this.computeTimeVars(opts) + this.computeGrafanaContext() + this.computePanelRepeatVars(opts)
    opts.targets.forEach(queryRef => {
      let query = Object.assign({}, queryRef) // Deep copy
      //if (!query.hide) {
      if (query.friendlyQuery)
        query.friendlyQuery = Object.assign(new Query(), query.friendlyQuery)
      // Grafana can send empty Object at the first time, we need to check is there is something
      if (query.expr || query.friendlyQuery) {
        if (query.advancedMode === undefined)
          query.advancedMode = false
        query.ws = `${wsHeader}\n${query.advancedMode ? query.expr : query.friendlyQuery.warpScript}`
        queries.push(query)
        console.debug('New Query: ', query.ws)
      }
      //}
    })

    if (queries.length === 0) {
      let d = this.$q.defer();
      d.resolve({ data: [] });
      return d.promise;
    }

    queries = queries.map(this.executeExec.bind(this))

    return this.$q.all(queries)
      .then((responses) => {
        // Grafana formated GTS
        let data = []
        responses.forEach((response, i) => {
          const res = response.result
          if (res.data.type === 'error') {
            console.error(res.data.value)
            return
          }

          // is it for a Table graph ?
          if (res.data.length === 1 && res.data[0] && Table.isTable(res.data[0])) {
            const t = res.data[0]
            t.type = 'table'
            data.push(t)
            return
          }

          // World-map panel data type
          if (res.data.length === 1 && res.data[0] && isGeoJson(res.data[0])) {
            const t = res.data[0]
            t.type = 'table'
            data = t
            return
          }

          GTS.stackFilter(res.data).forEach(gts => {
            let grafanaGts = {
              target: (opts.targets[i].hideLabels) ? gts.c : gts.nameWithLabels,
              datapoints: [],
              refId: (response.query || {}).refId
            }
            // show attributes
            if (opts.targets[i].hideAttributes !== undefined && !opts.targets[i].hideAttributes) {
              grafanaGts.target += gts.formatedAttributes
            }

            gts.v.forEach(dp => {
              grafanaGts.datapoints.push([dp[dp.length - 1], dp[0] / 1000])
            })
            data.push(grafanaGts)
          })
        })
        return { data }
      })
      .catch((err) => {
        const headers = err.headers ? err.headers(): {};
        // security: ensure both error description headers are here.
        let errorline: number = -1;
        let errorMessage: String = "Unable to read x-warp10-error-line and x-warp10-error-line headers in server answer";
        if (headers['x-warp10-error-line'] !== undefined && headers['x-warp10-error-message'] !== undefined) {
          const wsHeadersOffset: number = wsHeader.split('\n').length;
          errorline = Number.parseInt(headers['x-warp10-error-line']) - wsHeadersOffset;
          errorMessage = headers['x-warp10-error-message'];
          // We must substract the generated header size everywhere in the error message.
          errorMessage = errorMessage.replace(/\[Line #(\d+)\]/g, (match, group1) => '[Line #' + (Number.parseInt(group1) - wsHeadersOffset).toString() + ']');
          // Also print the full error in the console
        }
        console.warn('[Warp 10] Failed to execute query', err);
        let d = this.$q.defer();
        // Grafana handle this nicely !
        throw { message: `WarpScript Failure on Line ${errorline}, ${errorMessage}` };
      })
  }

  /**
   * used by datasource configuration page to make sure the connection is working
   * @return {Promise<any>} response
   */
  testDatasource(): Promise<any> {
    return this.executeExec({ ws: '1 2 +' })
      .then(response => {
        const res = response.result
        if (res.data[0] !== 3) {
          return {
            status: 'error',
            message: JSON.parse(res.data) || res.data,
            title: 'Failed to execute basic WarpScript™'
          }
        } else {
          return {
            status: 'success',
            message: 'Datasource is working',
            title: 'Success'
          }
        }
      })
      .catch((res) => {
        console.debug('Error', res)
        return {
          status: 'error',
          message: `Status code: ${res.err.status}`,
          title: 'Failed to contact Warp 10 Platform'
        }
      })
  }

  /**
   * used by dashboards to get annotations
   * @param options
   * @return {Promise<any>} results
   */
  annotationQuery(opts: AnnotationOptions): Promise<any> {
    let ws = this.computeTimeVars(opts) + this.computeGrafanaContext() + opts.annotation.query

    return this.executeExec({ ws })
      .then((response) => {
        const res = response.result
        const annotations = []
        /*if (!) {
          console.error(`An annotation query must return exactly 1 GTS on top of the stack, annotation: ${ opts.annotation.name }`)
          var d = this.$q.defer()
          d.resolve([])
          return d.promise
        }*/

        for (let gts of GTS.stackFilter(res.data)) {
          let tags = []

          for (let label in gts.l) {
            tags.push(`${label}:${gts.l[label]}`)
          }

          gts.v.forEach(dp => {
            annotations.push({
              annotation: {
                name: opts.annotation.name,
                enabled: true,
                datasource: this.instanceSettings.name,
              },
              title: gts.c,
              time: Math.trunc(dp[0] / (1000)),
              text: dp[dp.length - 1],
              tags: tags
            })
          })
        }
        return annotations
      })
  }

  /**
   * used by query editor to get metric suggestions and templating.
   * @param options
   * @return {Promise<any>}
   */
  metricFindQuery(ws: string): Promise<any> {
    return this.executeExec({ ws: this.computeGrafanaContext() + ws })
      .then(response => {
        const res = response.result
        if (!Array.isArray(res.data)) {
          throw new Error('Warp 10 expects the response to be a stack (an array), it isn\'t')
        }

        // Grafana can handle different text/value for the variable drop list. User has three possibilites in the WarpScript result:
        // 1 - let a list on the stack : text = value for each entry.
        // 2 - let a map on the stack : text = map key, value = map value. value will be used in the WarpScript variable.
        // 3 - let some strings or numbers on the stack : it will be considered as a list, refer to case 1.
        // Values could be strings or number, ignore other objects.

        let entries = [];
        if (1 == res.data.length && Array.isArray(res.data[0])) {
          // case 1
          res.data[0].forEach(elt => {
            if (typeof elt === 'string' || elt instanceof String || typeof elt === 'number') {
              entries.push({
                text: elt.toString(),
                value: elt.toString() // Grafana will turn every value to strings anyway !
              })
            }
          });
        } else if (res.data.length === 1 && typeof res.data[0] === 'object') {
          // case 2
          Object.keys(res.data[0]).forEach(key => {
            const value = res.data[0][key];
            if (typeof value === 'string' || value instanceof String || typeof value === 'number') {
              entries.push({
                text: key.toString(), // in WarpScript, key might not be a string.
                value: value.toString() // Grafana will turn every value to strings anyway !
              })
            }
          });
        } else {
          // case 3
          res.data.forEach(elt => {
            if (typeof elt === 'string' || elt instanceof String || typeof elt === 'number') {
              entries.push({
                text: elt.toString(),
                value: elt.toString() // Grafana will turn every value to strings anyway !
              })
            }
          });
        }
        return entries;
      })
  }

  /**
   * Execute WarpScript
   * @param ws WarpScript string
   * @return {Promise<any>} Response
   */
  private executeExec(query: any): Promise<any> {

    let endpoint = this.instanceSettings.url
    if ((query.backend !== undefined) && (query.backend.length > 0)) {
      endpoint = query.backend;
    }

    if (endpoint.charAt(endpoint.length - 1) === '/') {
      endpoint = endpoint.substr(0, endpoint.length - 1);
    }

    return this.backendSrv.datasourceRequest({
      method: 'POST',
      url: endpoint + '/api/v0/exec',
      data: query.ws,
      headers: {
        'Accept': undefined,
        'Content-Type': undefined
      }
    }).then(res => {
      return {
        result: res,
        query: query
      }
    })
  }

  /**
   * Find all metrics with the given selector
   * @param selector
   * @return {Promise<any>} results
   */
  private executeFind(selector): Promise<any> {
    return this.backendSrv.datasourceRequest({
      method: 'GET',
      url: `${this.instanceSettings.url}/api/v0/find?selector=${selector}`,
      headers: {
        'Accept': undefined,
        'Content-Type': undefined
      }
    })
  }

  /**
   * Compute Datasource variables and templating variables, store it on top of the stack
   * @return {string} WarpScript header
   */
  private computeGrafanaContext(): string {
    let wsHeader = ''
    // Datasource vars
    for (let myVar in this.instanceSettings.jsonData) {
      let value = this.instanceSettings.jsonData[myVar]
      if (typeof value === 'string')
        value = value.replace(/'/g, '"')
      if (typeof value === 'string' && !value.startsWith('<%') && !value.endsWith('%>'))
        value = `'${value}'`
      wsHeader += `${value || 'NULL'} '${myVar}' STORE\n`
    }
    // Dashboad templating vars
    // current.text is the label. In case of multivalue, it is a string 'valueA + valueB'
    // current.value is a string, depending on query output. In case of multivalue, it is an array of strings. array contains "$__all" if user selects All.

    for (let myVar of this.templateSrv.variables) {
      const value = myVar.current.value;

      if (((Array.isArray(value) && (value.length == 1 && value[0] === '$__all')) || value === "$__all")) {
        // User checked the "select all" checkbox
        if (myVar.allValue && myVar.allValue !== "") {
          // User also defined a custom value in the variable settings
          const customValue: String = myVar.allValue;
          wsHeader += `[ '${customValue}' ] '${myVar.name}_list' STORE\n`
          // custom all value is taken as it is. User may or may not use a regexp.
          wsHeader += ` '${customValue}' '${myVar.name}' STORE\n`
        } else {
          // if no custom all value is defined :
          // it means we shall create a list of all the values in WarpScript from options, ignoring "$__all" special option value.
          const allValues: String[] = myVar.options.filter(o => o.value !== "$__all").map(o => o.value);
          wsHeader += `[ ${allValues.map(s => `'${s}'`).join(" ")} ] '${myVar.name}_list' STORE\n`; // all is stored as string in generated WarpScript.
          // create a ready to use regexp in the variable
          wsHeader += ` '~' $${myVar.name}_list REOPTALT + '${myVar.name}' STORE\n`
        }
      } else if (Array.isArray(value)) {
        // user checks several choices
        wsHeader += `[ ${value.map(s => `'${s}'`).join(" ")} ] '${myVar.name}_list' STORE\n`; // all is stored as string in generated WarpScript.
        if (1 == value.length) {
          // one value checked : copy it as it is in WarpScript variable
          wsHeader += ` '${value[0]}' '${myVar.name}' STORE\n`
        } else {
          // several values checked : do a regexp
          //also create a ready to use regexp, suffixed by _wsregexp
          wsHeader += ` '~' $${myVar.name}_list REOPTALT + '${myVar.name}' STORE\n`
        }
      } else {
        // no multiple selection, variable is the string. As type is lost by Grafana, there is no safe way to assume something different than a string here.
        // List is also created to create scripts compatible whatever the defined selection mode
        wsHeader += `[ '${value}' ] '${myVar.name}_list' STORE\n`;
        wsHeader += `'${value}' '${myVar.name}' STORE\n`;
      }
    }
    wsHeader += "LINEON\n";
    return wsHeader
  }

  private computeTimeVars(opts): string {
    let vars: any = {
      start: opts.range.from.toDate().getTime() * 1000,
      startISO: opts.range.from.toISOString(),
      end: opts.range.to.toDate().getTime() * 1000,
      endISO: opts.range.to.toISOString(),
    }
    vars.interval = vars.end - vars.start
    vars.__interval = Math.floor(vars.interval / (opts.maxDataPoints || 1))
    vars.__interval_ms = Math.floor(vars.__interval / 1000)

    let str = ''
    for (let gVar in vars) {
      str += `${isNaN(vars[gVar]) ? `'${vars[gVar]}'` : vars[gVar]} '${gVar}' STORE `
    }

    return str
  }

  private computePanelRepeatVars(opts): string {
    let str = ''
    if (opts.scopedVars) {
      for (let k in opts.scopedVars) {
        let v = opts.scopedVars[k]
        if (v.selected || this.scopedVarIsAll(k)) {
          str += `'${v.value}' '${k}' STORE `
        }
      }
    }
    return str
  }

  /**
   * Test if a named scoped variable is set to all
   *
   * @param name string The name of scoped variable
   * @return bool If the scoped variable is set to all
   */
  private scopedVarIsAll(name: string): boolean {
    for (let i = 0; i < this.templateSrv.variables.length; i++) {
      const v = this.templateSrv.variables[i]
      if (v.name === name && v.current.value.length === 1 && v.current.value[0] === '$__all') {
        return true
      }
    }

    return false
  }
}
