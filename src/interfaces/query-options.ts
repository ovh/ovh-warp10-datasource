import { Moment } from '../../node_modules/moment/moment'
export interface QueryOptions {

    range: {
        from: Moment,
        to: Moment
    }

    rangeRaw: {
        from: Moment,
        to: Moment
    }

    interval: string
    intervalMs: number

    targets: Array<{
        refId: string,
        target: string,
        hide: boolean,
        expr: string,
        hideLabels: boolean
    }>

    format: string

    maxDataPoints: number
}
