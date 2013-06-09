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
                var cats = response.data;
                cats.forEach(function(cat, i) {
                    cats[i] = new Menu(cats[i]);
                });

                return cats;
            }, function(err) {
                $log.error('Error retreiving menu from server.', err);
            });

        return promise;
    };
}]);