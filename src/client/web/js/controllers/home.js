// controllers - home.js
angular.module('IronbaneApp')
    .controller('HomeCtrl', ['$scope', 'Article', '$log', '$location',
        function($scope, Article, $log, $location) {
            $scope.navTo = function(path) {
                $location.path(path);
            };

            Article.getFrontPage()
                .then(function(results) {
                    $scope.posts = results;
                }, function(error) {
                    $log.log('error getting frontpage ' + error);
                });
        }
    ]);