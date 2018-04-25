import { Moment } from '../../node_modules/moment/moment'
export default interface AnnotationOptions {

    range: {
        from: Moment
        to: Moment
    }

    rangeRaw: {
        from: Moment
        to: Moment
    }

    annotation: {
        datasource: string,
        enable: boolean,
        name: string,
        query: string
    }
}
