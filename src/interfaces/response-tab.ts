export interface TableResponse {

    columns: Array<{
        text: string
        type: string
        sort: boolean
        desc: boolean
    }>

    rows: any[][]
    type: string
}
