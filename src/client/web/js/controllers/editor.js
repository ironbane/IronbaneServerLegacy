// editor.js - controller for site editor tools
angular.module('IronbaneApp')
.controller('EditMenuCtrl', ['$scope', 'MenuData', function($scope, MenuData) {
    $scope.menu = MenuData;
}]);