// topic.js
angular.module('IronbaneApp')
.controller('ItemTemplateEditor', ['$scope', 'ResolveData', function($scope, ResolveData) {
    $scope.template = ResolveData.template;

}]);