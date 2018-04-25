import { Moment } from '../../node_modules/moment/moment'
import { Warp10Query } from '../query'
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
        ws: string,
        hideLabels: boolean
        hideAttributes: boolean
        advancedMode: boolean
        friendlyQuery: Warp10Query
    }>

    format: string

    maxDataPoints: number
}
