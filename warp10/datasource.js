define([
  'angular',
  'lodash',
  'app/core/utils/datemath',
  'app/core/utils/kbn',
  'moment',
  './queryCtrl',
  './directives'
],
function (angular, _, dateMath, kbn) {
  'use strict';

  var module = angular.module('grafana.services');

  module.factory('Warp10Datasource', function($q, $http, templateSrv) {

    function Warp10Datasource(datasource) {
      this.type = 'warp10';
      this.name = datasource.name;
      this.supportMetrics = true;

      this.url = datasource.url;
      this.lastErrors = {};
    }

    // Called once per panel (graph)
    Warp10Datasource.prototype.query = function(options) {

      console.log("Query begin");

      var end = convertToWarp10Time(options.range.to);
      var start = convertToWarp10Time(options.range.from);

      console.log("From: "+start+ " To: "+end);

      var queries = [];

      console.log("Before foreach");

      _.each(options.targets, _.bind(function(target) {

        console.debug("Expre", target.expr);
        console.debug("Backend URL", target.backend);

        queries.push(target);
      }, this));

      console.log("After foreach");

      // No valid targets, return the empty result to save a round trip.
      if (_.isEmpty(queries)) {

        console.log("Empty query");

        var d = $q.defer();
        d.resolve({ data: [] });
        return d.promise;
      }

      var allQueryPromise = _.map(queries, _.bind(function(query) {
        return this.performTimeSeriesQuery(query, start, end);
      }, this));

      var self = this;
      return $q.all(allQueryPromise)
        .then(function(allResponse) {
          var result = [];

          _.each(allResponse, function(response, index) {


            console.log("Response", response);
            if (response.data.type === 'error') {
              self.lastErrors.query = response.data.value;
              throw response.data.value;
            }
            delete self.lastErrors.query;

            if (!isArray(response.data) || (response.data.length != 1)) {
              console.debug("Response isn't an Array or it has more than 1 element", response.data);
              return {};
            }

            var warpscriptJsonResponse = response.data[0];

            console.log("Response data", warpscriptJsonResponse)

            _.each(warpscriptJsonResponse, function(metricData) {
              console.log("Metric data",metricData);

              result.push(transformMetricData(metricData, options.targets[index]));
            });
          });

          return { data: result };
        });
    };

    /***********************************************************************************
    *Puts into the Warpscript script a header to place start and end ont the stack
    ***********************************************************************************/
    Warp10Datasource.prototype.prepareWarpscriptQuery = function(query, start, end) {

      var endISO = convertToISO(end);
      var startISO = convertToISO(start);
      var interval = end - start;

      var warpscriptScript =
            "" + start + " 'start' STORE " + end + " 'end' STORE " +
            "'" + startISO + "' 'startISO' STORE '" + endISO + "' 'endISO' STORE " +
            interval + " 'interval' STORE";
      if (query.expr !== undefined) {
         warpscriptScript += " " + query.expr;
      }
      return warpscriptScript;
    }

    /***********************************************************************************
    * Generate @query Warpscript http query to the Warpscript API entry point
    ***********************************************************************************/
    Warp10Datasource.prototype.performTimeSeriesQuery = function(query, start, end) {


      var warpscriptScript = this.prepareWarpscriptQuery(query, start, end);

      var backend = this.url;
      // If we have defined a backend in the query editor, it takes preecedence
      // over the datasource
      if ((query.backend !== undefined) && (query.backend.length >0)) {
        backend = query.backend;
      }

      while (backend[backend.length-1] === '/') {
        // remove trailing slash
        backend = backend.substr(0, backend.length - 1);
      }

      var url = backend + '/api/v0/exec'

      var options = {
        method: 'POST',
        url: url,
        data: warpscriptScript,
        headers: {
            'Accept': undefined,
            'Content-Type': undefined,
            'X-Warp10-Token': 'token'
        }
      };

      return $http(options);
    };

    /***********************************************************************************
    * Transform from Warpscript JSON to Grafana dps
    ***********************************************************************************/
    function transformMetricData(gts, options) {

      if (!isGts(gts)) {
        console.debug("Response item isn't a gts",gts);
        return;
      }

      var className = gts.c;

      var labels =
        _.map(gts.l, function(value, key){
          return key+"="+value
        }).join(",");


      var metricName = className+"{"+labels+"}"
      var dps = [];

      _.each(gts.v, function(value) {
        // Datapoint format: [ value, label]
        dps.push([value[value.length -1], Math.floor(value[0]/1000)]);
      });

      // Metric format {target: "Label text", datapoints: [ datapoints objects] }

      console.debug({ target: metricName , datapoints: dps });
      return { target: metricName, datapoints: dps };
    }

    /***********************************************************************************
    * Returns true if @value is an Array
    ***********************************************************************************/
    function isArray(value) {
      return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number'
        && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
    };

    /***********************************************************************************
    * Returns true if @gts is a JSON object version of a GTS
    ***********************************************************************************/
    function isGts(gts) {
      if ((gts.c == null) || (gts.l == null) || (gts.a == null) || (gts.v == null)) {
        return false;
      }
      return true;
    };

    /***********************************************************************************
    * Converts @date into µs since Epoch time (Warpscript tick format)
    ***********************************************************************************/
    function convertToWarp10Time(date) {
      date = dateMath.parse(date);
      return date * 1000;
    }

    /***********************************************************************************
    * Converts @timestamp into ISO 8601 format
    ***********************************************************************************/
    function convertToISO(timestamp) {
      var date = new Date(Math.floor(timestamp/1000));
      return date.toISOString();
    }

    return Warp10Datasource;
  });

});
