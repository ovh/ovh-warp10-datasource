define([
  'angular',
  'lodash',
  'kbn',
  'moment',
  './queryCtrl'
],
function (angular, _, kbn) {
  'use strict';

  var module = angular.module('grafana.services');

  module.factory('WarpDatasource', function($q, $http, templateSrv) {

    function WarpDatasource(datasource) {
      this.type = 'einstein';
      this.editorSrc = 'app/features/warp/partials/query.editor.html';
      this.name = datasource.name;
      this.supportMetrics = true;

      var url = datasource.url;
      if (url[url.length-1] === '/') {
        // remove trailing slash
        url = url.substr(0, url.length - 1);
      }
      this.url = url;
      this.lastErrors = {};
    }

    // Called once per panel (graph)
    WarpDatasource.prototype.query = function(options) {

      console.log("Query begin");

      var end = convertToWarpTime(options.range.to);
      var start = convertToWarpTime(options.range.from);

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

            var einsteinJsonResponse = response.data[0];

            console.log("Response data", einsteinJsonResponse)

            _.each(einsteinJsonResponse, function(metricData) {
              console.log("Metric data",metricData);

              result.push(transformMetricData(metricData, options.targets[index]));
            });
          });

          return { data: result };
        });
    };

    /***********************************************************************************
    *Puts into the Einstein script a header to place start and end ont the stack
    ***********************************************************************************/
    WarpDatasource.prototype.prepareEinsteinQuery = function(query, start, end) {

      var endISO = convertToISO(end);
      var startISO = convertToISO(start);
      var interval = end - start;

      var einsteinScript =
            "" + start + " 'start' STORE " + end + " 'end' STORE " +
            "'" + startISO + "' 'startISO' STORE '" + endISO + "' 'endISO' STORE " +
            interval + " 'interval' STORE " + query.expr;
      return einsteinScript;
    }

    /***********************************************************************************
    * Generate @query Einstein http query to the Einstein API entry point
    ***********************************************************************************/
    WarpDatasource.prototype.performTimeSeriesQuery = function(query, start, end) {


      var einsteinScript = this.prepareEinsteinQuery(query, start, end);

      var backend = this.url;
      // If we have defined a backend in the query editor, it takes preecedence
      // over the datasource
      if ((query.backend !== undefined) && (query.backend.length >0)) {
        backend = query.backend;
      }

      var url = backend + '/api/v0/exec/einstein'

      var options = {
        method: 'POST',
        url: url,
        data: einsteinScript,
        headers: {
            'Accept': undefined,
            'Content-Type': undefined,
            'X-CityzenData-Token': 'token'
        }
      };

      return $http(options);
    };

    /***********************************************************************************
    * Transform from Einstein JSON to Grafana dps
    ***********************************************************************************/
    function transformMetricData(gts, options) {

      if (!isGts(gts)) {
        console.debug("Response item isn't a gts",gts);
        return;
      }

      var className = gts.c + JSON.stringify(gts.l);


      var dps = [];

      _.each(gts.v, function(value) {
        // Datapoint format: [ value, label]
        dps.push([value[value.length -1], Math.floor(value[0]/1000)]);
      });

      // Metric format {target: "Label text", datapoints: [ datapoints objects] }

      console.debug({ target: className, datapoints: dps });
      return { target: className, datapoints: dps };
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
    * Converts @date into µs since Epoch time (Einstein tick format)
    ***********************************************************************************/
    function convertToWarpTime(date) {
      date = kbn.parseDate(date);
      return date.getTime() * 1000;
    }

    /***********************************************************************************
    * Converts @timestamp into ISO 8601 format
    ***********************************************************************************/
    function convertToISO(timestamp) {
      var date = new Date(Math.floor(timestamp/1000));
      return date.toISOString();
    }

    return WarpDatasource;
  });

});
