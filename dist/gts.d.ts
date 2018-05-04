export default class GTS {
    c: string;
    l: Object;
    a: Object;
    la?: number;
    v: any[][];
    constructor();
    readonly nameWithLabels: string;
    /**
     * Determine if an object is a GTS
     * @param {Object} g object to test
     * @return {boolean} is it a GTS ?
     */
    static isGTS(g: any): boolean;
    /**
     * Check all elements of any array to know if there are only GTS types
     * @param {Array<any>} gs array to check
     * @return {boolean} contains only GTS types ?
     */
    static isGTSArray(gs: any): boolean;
    /**
     * Return all the GTS in 1 array
     * @param {Array<any>} stack object where looking for
     * @return {Array<GTS>} all GTS
     */
    static stackFilter(stack: any[]): GTS[];
    /**
     * Return all GTS attributes
     * @return {string} all GTS
     */
    readonly formatedAttributes: string;
}
