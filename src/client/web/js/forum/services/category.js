// board.js
angular.module('IronbaneApp')
    .factory('Category', ['$http', 'Board', '$log',
        function($http, Board, $log) {
            var Category = function(json) {
                angular.copy(json || {}, this);
            };

            // get all categories by themselves
            Category.getAll = function() {
                var promise = $http.get('/api/forum/cats')
                    .then(function(response) {
                        var cats = response.data;
                        cats.forEach(function(cat, i) {
                            cats[i] = new Category(cats[i]);
                        });

                        return cats;
                    }, function(err) {
                        $log.error('Error retreiving categories from server.', err);
                    });

                return promise;
            };



            return Category;
        }
    ]);