import QueryOptions from './interfaces/query-options';
import AnnotationOptions from './interfaces/annotation-options';
export default class Warp10Datasource {
    private instanceSettings;
    private $q;
    private backendSrv;
    private templateSrv;
    private $log;
    constructor(instanceSettings: any, $q: any, backendSrv: any, templateSrv: any, $log: any);
    /**
     * used by panels to get data
     * @param options
     * @return {Promise<any>} Grafana datapoints set
     */
    query(opts: QueryOptions): Promise<any>;
    /**
     * used by datasource configuration page to make sure the connection is working
     * @return {Promise<any>} response
     */
    testDatasource(): Promise<any>;
    /**
     * used by dashboards to get annotations
     * @param options
     * @return {Promise<any>} results
     */
    annotationQuery(opts: AnnotationOptions): Promise<any>;
    /**
     * used by query editor to get metric suggestions and templating.
     * @param options
     * @return {Promise<any>}
     */
    metricFindQuery(ws: string): Promise<any>;
    /**
     * Execute WarpScript
     * @param ws WarpScript string
     * @return {Promise<any>} Response
     */
    private executeExec;
    /**
     * Find all metrics with the given selector
     * @param selector
     * @return {Promise<any>} results
     */
    private executeFind;
    /**
     * Compute Datasource variables and templating variables, store it on top of the stack
     * @return {string} WarpScript header
     */
    private computeGrafanaContext;
    private computeTimeVars;
    private computePanelRepeatVars;
    /**
     * Test if a named scoped variable is set to all
     *
     * @param name string The name of scoped variable
     * @return bool If the scoped variable is set to all
     */
    private scopedVarIsAll;
}
