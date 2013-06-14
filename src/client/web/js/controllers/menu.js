angular.module('IronbaneApp')
.controller('menuCtrl', ['$scope', 'Menu', function($scope, Menu) {
    Menu.getNavigation()
        .then(function(items) {
            $scope.menuitems = items;
        });
}]);