import { QueryOptions } from './interfaces/query-options'
import { AnnotationOptions } from './interfaces/annotation-options'
import { GTS } from './gts'

export class Warp10Datasource {

  constructor(private instanceSettings: any, private $q: any, private backendSrv: any, private templateSrv: any) {}

  /**
   * used by panels to get data
   * @param options
   * @return {any} Grafana datapoints set
   */
  query(opts: QueryOptions): any {

    /*let test = [
      {
      c: "test",
      l: {
        a: "b"
      },
      v: [
        [10, 10],
        [20, 20]
      ]
    }, {
      c: "test",
      v: [
        [10, 10],
        [20, 20]
      ]
    }]*/

    console.debug('QUERY OPTIONS', opts)
    let queries = []
    let end = opts.range.to.toDate().getTime() * 1000
    let start = opts.range.from.toDate().getTime() * 1000
    let interval = end - start
    let startISO = opts.range.from.toISOString()
    let endISO = opts.range.to.toISOString()
    let wsHeader = `${end} 'end' STORE ${start} 'start' STORE '${endISO}' 'endISO' STORE '${startISO}' 'startISO' STORE ${interval} 'interval' STORE `

    wsHeader += this.computeGrafanaContext()

    for (let query of opts.targets) {
      queries.push(`${ wsHeader }\n${ query.expr }`)
    }

    queries = queries.map(this.executeExec.bind(this))

    return this.$q.all(queries)
    .then((responses) => {
      let result = []
      responses.forEach((res, i) => {
        if (res.data.type === 'error') {
          console.error(res.data.value)
          return
        }
        let gtss = GTS.stackFilter(res.data)

        for (let gts of gtss) {
          let grafanaGts = {
            target: (opts.targets[i].hideLabels)? gts.c : gts.nameWithLabels,
            datapoints: []
          }

          for (let dp of gts.v) {
            grafanaGts.datapoints.push([ dp[dp.length - 1], dp[0] / 1000 ])
          }
          result.push(grafanaGts)
        }
      })
      return { data: result }
    })
  }

  /**
   * used by datasource configuration page to make sure the connection is working
   */
  testDatasource(): any {
      return this.executeExec('1 2 +')
      .then(res => {
        console.debug('Success', res)
        if (res.data[0] != 3) {
          return {
            status: 'error',
            message: JSON.parse(res.data) || res.data,
            title: 'Failed to execute basic WarpScript'
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
          message: `Status code: ${ res.err.status }`,
          title: 'Failed to contact Warp10 platform'
        }
      })
  }

  /**
   * used by dashboards to get annotations
   * @param options
   */
  annotationQuery(opts: AnnotationOptions) {
    let end = opts.range.to.toDate().getTime() * 1000
    let start = opts.range.from.toDate().getTime() * 1000
    let interval = end - start
    let startISO = opts.range.from.toISOString()
    let endISO = opts.range.to.toISOString()
    let wsHeader = `${end} 'end' STORE ${start} 'start' STORE '${endISO}' 'endISO' STORE '${startISO}' 'startISO' STORE ${interval} 'interval' STORE `
    wsHeader += this.computeGrafanaContext()

    return this.executeExec(wsHeader)
  }

  /**
   * used by query editor to get metric suggestions.
   * @param options
   */
  metricFindQuery(opts: any) {
    return this.executeExec(this.computeGrafanaContext() + opts)
    .then((res) => {

      // only one object on the stack, good user
      if (res.data.length === 1 &&  typeof res.data[0] === 'object') {
        let entries = []
        for (let key of res.data[0]) {
          entries.push({
            text: key,
            value: res.data[0][key]
          })
        }
        return entries
      }
      // some elements on the stack, return all of them as entry
      return res.data.map((entry, i) => {
        return {
          text: entry.toString() || i,
          value: entry
        }
      })
    })
  }

  /**
   * Execute WarpScript
   * @param ws WarpScript string
   * @return {Promise<any>} Response
   */
  private executeExec(ws: string): Promise<any> {
    return this.backendSrv.datasourceRequest({
        method: 'POST',
        url: this.instanceSettings.url + '/api/v0/exec',
        data: ws,
        headers: {
            'Accept': undefined,
            'Content-Type': undefined
        }
    })
  }
  private executeFind(selector): Promise<any> {
    return this.backendSrv.datasourceRequest({
        method: 'GET',
        url: `${ this.instanceSettings.url }/api/v0/find?selector=${selector}`,
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
      if (isNaN(parseFloat(value)))
        value = `'${value}'`
      wsHeader += `${value} '${myVar}' STORE `
    }
    // Dashboad templating vars
    for (let myVar of this.templateSrv.variables) {
      let value = myVar.current.value
      if (isNaN(parseFloat(value)))
        value = `'${value}'`
      wsHeader += `${value} '${myVar.name}' STORE `
    }
    return wsHeader
  }
}