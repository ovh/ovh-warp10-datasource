export declare class Table {
    type: string;
    columns: Column[];
    rows: any[][];
    constructor();
    static isTable(o: any): boolean;
}
export declare class Column {
    text: string;
    type: string;
    sort?: boolean;
    desc?: boolean;
}
