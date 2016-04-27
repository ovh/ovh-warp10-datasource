define([
  'angular',
  'lodash',
],
function (angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('Warp10QueryCtrl', function($scope) {

    $scope.init = function() {

      console.log("Init called");

      $scope.target.errors = validateTarget();
      $scope.target.datasourceErrors = {};

      if (!$scope.target.expr) {
        $scope.target.expr = '';
      }
      $scope.target.metric = '';

      $scope.target.warpscriptLink = $scope.linkToWarp();

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
      $scope.target.warpscriptLink = $scope.linkToWarp();

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

    $scope.linkToWarp = function() {
      return $scope.datasource.url;
    };

    // TODO: validate target
    function validateTarget() {
      var errs = {};

      return errs;
    }

  });

});
