angular.module('IronbaneApp')
.controller('menuCtrl', ['$scope', 'Menu', function($scope, Menu) {
    $scope.menuitems = Menu.getNavigation();
   }]);