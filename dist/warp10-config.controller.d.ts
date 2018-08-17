import Datasource from './datasource';
export default class Warp10ConfigCtrl {
    private backendSrv;
    private $routeParams;
    static templateUrl: string;
    current: Datasource;
    newExtraKey: any;
    newExtraVal: any;
    constructor(backendSrv: any, $routeParams: any);
    _loadDatasourceConfig(): void;
    _addExtraVar(): void;
    _delExtraVar(key: any): void;
    _editKey(key: any): void;
}
