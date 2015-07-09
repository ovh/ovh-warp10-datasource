define([
  'angular',
  'lodash',
  'kbn',
],
function (angular, _, kbn) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('EinsteinQueryCtrl', function($scope) {

    $scope.init = function() {

      console.log("Init called");
      
      $scope.target.errors = validateTarget();
      $scope.target.datasourceErrors = {};

      if (!$scope.target.expr) {
        $scope.target.expr = '';
      }
      $scope.target.metric = '';

      $scope.target.einsteinLink = $scope.linkToEinstein();

      $scope.$on('typeahead-updated', function() {
        $scope.$apply($scope.inputMetric);
        $scope.refreshMetricData();
      });

      $scope.datasource.lastErrors = {};
      $scope.$watch('datasource.lastErrors', function() {
        $scope.target.datasourceErrors = $scope.datasource.lastErrors;
      }, true);
    };

    $scope.refreshMetricData = function() {
      $scope.target.errors = validateTarget($scope.target);
      $scope.target.einsteinLink = $scope.linkToEinstein();

      // this does not work so good
      if (!_.isEqual($scope.oldTarget, $scope.target) && _.isEmpty($scope.target.errors)) {
        $scope.oldTarget = angular.copy($scope.target);
        $scope.get_data();
      }
    };

    $scope.inputMetric = function() {
      $scope.target.expr += $scope.target.metric;
      $scope.target.metric = '';
    };

    $scope.moveMetricQuery = function(fromIndex, toIndex) {
      _.move($scope.panel.targets, fromIndex, toIndex);
    };

    $scope.duplicate = function() {
      var clone = angular.copy($scope.target);
      $scope.panel.targets.push(clone);
    };

    $scope.linkToEinstein = function() {
      var from = kbn.parseDate($scope.dashboard.time.from);
      var to = kbn.parseDate($scope.dashboard.time.to);

      

      return $scope.datasource.url;
    };

    // TODO: validate target
    function validateTarget() {
      var errs = {};

      return errs;
    }

  });

});