// controllers - home.js
angular.module('IronbaneApp')
    .controller('HomeCtrl', ['$scope', 'Article', '$log', '$location', '$window',
        function($scope, Article, $log, $location, $window) {
            $scope.navTo = function(path) {
                // better way to do this?
                if(path === '/game') {
                    $window.location.href = path;
                } else {
                    $location.path(path);
                }
            };

            Article.getFrontPage()
                .then(function(results) {
                    $scope.posts = results;
                }, function(error) {
                    $log.log('error getting frontpage ' + error);
                });
        }
    ]);