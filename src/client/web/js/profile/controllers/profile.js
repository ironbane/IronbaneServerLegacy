// board.js
angular.module('IronbaneApp')
.controller('ProfileCtrl', ['$scope', 'ResolveData', '$location', function($scope, ResolveData, $location) {
    $scope.profile = ResolveData.profile;
    $scope.profile.info_gender === 0 ? $scope.profile.info_gender = 'male' : $scope.profile.info_gender = 'female';

}]);
