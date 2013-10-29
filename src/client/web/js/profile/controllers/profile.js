// board.js
angular.module('IronbaneApp')
.controller('ProfileCtrl', ['$scope', 'ResolveData', '$location', function($scope, ResolveData, $location) {
    $scope.profile = ResolveData.profile;
   

}]);
