export default class Warp10Query {
    readToken: string;
    className: string;
    labels: {
        [key: string]: string;
    };
    bucketizer: any;
    bucketCount: number;
    reducer: any;
    reducerLabels: string[];
    filter: any;
    filterLabels: string[];
    filterParamNumber: number;
    filterParamMap: {
        [key: string]: string;
    };
    filterParamClass: string;
    nameFormat: string;
    bucketizers: string[];
    reducers: string[];
    filters: {
        name: string;
        type: string;
    }[];
    constructor();
    addLabel(key: string, val: string): void;
    delLabel(key: string): void;
    addReducerLabel(key: string): void;
    delReducerLabel(key: string): void;
    addFilterLabel(key: string): void;
    delFilterLabel(key: string): void;
    addFilterParamMapLabel(key: string, val: string): void;
    delFilterParamMapLabel(key: string): void;
    private static formatStringVar;
    readonly warpScript: string;
}
