import {Datasource} from "../module";
import Q from "q";

describe('Warp10Datasource', function() {
    var ctx = {};

    beforeEach(function() {
        ctx.$q = Q;
        ctx.backendSrv = {};
        ctx.templateSrv = {};
        ctx.ds = new Datasource({}, ctx.$q, ctx.backendSrv, ctx.templateSrv);

    });

    it('should return an empty array when no targets are set', function(done) {
        done();
    });

});
