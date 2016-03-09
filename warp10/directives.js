define([
  'angular',
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.directives');

  module.directive('metricQueryEditorWarp10', function() {
    return {controller: 'Warp10QueryCtrl', templateUrl: 'app/plugins/datasource/warp10/partials/query.editor.html'};
  });

  module.directive('metricQueryOptionsWarp10', function() {
    return {templateUrl: 'app/plugins/datasource/warp10/partials/query.options.html'};
  });

});
