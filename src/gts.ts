export class GTS {

    c: string
    l: Object
    a: Object
    v: any[][]

    constructor() {}

    get nameWithLabels(): string {
        let keyValues = []
        for (let key in this.l) {
            keyValues.push(`${ key }=${ this.l[key] }`)
        }
        return `${ this.c }{${ keyValues.join(',') }}`
    }

    /**
     * Determine if an object is a GTS
     * @param {Object} g object to test
     * @return {boolean} is it a GTS ?
     */
    static isGTS(g: any) {
        return g != undefined && g.hasOwnProperty('c') && g.hasOwnProperty('v') && g.hasOwnProperty('l')
          && typeof g.c === 'string' && typeof g.l === 'object' && Array.isArray(g.v)
    }

    /**
     * Check all elements of any array to know if there are only GTS types
     * @param {Array<any>} gs array to check
     * @return {boolean} contains only GTS types ?
     */
    static isGTSArray(gs: any) {
        if (!Array.isArray(gs))
            return false
        for (let g of gs) {
            if (!GTS.isGTS(g))
                return false
        }
        return true
    }

    /**
     * Return all the GTS in 1 array
     * @param {Array<any>} stack object where looking for
     * @return {Array<GTS>} all GTS
     */
    static stackFilter(stack: any[]): GTS[] {
        let gtss = []
        for (let entry of stack) {
            if (GTS.isGTS(entry))
                gtss.push((<any>Object).assign(new GTS(), entry))

            else if (GTS.isGTSArray(entry)) {
                entry = entry.map((gts) => {
                    return (<any>Object).assign(new GTS(), gts)
                })
                gtss = gtss.concat(entry)
            }
        }
        return gtss
    }
}