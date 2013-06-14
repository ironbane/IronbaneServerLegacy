// board.js
angular.module('IronbaneApp')
.factory('Menu', ['$http', '$log', function($http, $log) {
    var Menu = function(json) {
        angular.copy(json || {}, this);
    };

    // get all categories by themselves
    Menu.getNavigation = function() {
        var promise = $http.get('/api/menu/main')
            .then(function(response) {
                 var result = [];

                angular.forEach(response.data, function(data) {
                    result.push(new Menu(data));
                });

                return result;
            }, function(err) {
                $log.log('error getting menu data', err);
            });

        return promise;
    };
    return Menu;
}]);