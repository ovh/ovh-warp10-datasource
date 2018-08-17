export class Table {

  type = 'table'
  columns: Column[]
  rows: any[][]

  constructor() {}

  static isTable(o: any): boolean {
    return o.columns
      && o.rows
      && Array.isArray(o.rows)
      && Array.isArray(o.columns)
  }
}

export class Column {
  text: string
  type: string
  sort?: boolean
  desc?: boolean
}
