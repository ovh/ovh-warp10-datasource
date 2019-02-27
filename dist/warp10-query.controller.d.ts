import { QueryCtrl } from 'app/plugins/sdk';
import Query from './query';
export default class Warp10QueryCtrl extends QueryCtrl {
    $scope: any;
    private uiSegmentSrv;
    static templateUrl: string;
    target: {
        friendlyQuery: Query;
        hide: boolean;
        expr: string;
    };
    changeTicker: any;
    staticQuery: Query;
    extraLabelKey: string;
    extraLabelValue: string;
    extraReducerLabel: string;
    extraFilterLabel: string;
    extraFilterParamMapKey: string;
    extraFilterParamMapValue: string;
    readOnly: boolean;
    constructor($scope: any, uiSegmentSrv: any, $injector: any);
    _addLabel(): void;
    _delLabel(key: any): void;
    _addReducerLabel(): void;
    _delReducerLabel(label: any): void;
    _addFilterLabel(): void;
    _delFilterLabel(label: any): void;
    _addFilterParamMapLabel(): void;
    _delFilterParamMapLabel(key: any): void;
    _buildQuery(): void;
    getCompleter(...o: any[]): void;
    toggleEditorMode(): void;
    onChangeInternal: () => void;
}
