// controllers - home.js
angular.module('IronbaneApp')
    .controller('HomeCtrl', ['$scope', 'Topic', '$log', '$location', '$window',
        function($scope, Topic, $log, $location, $window) {
            $scope.navTo = function(path) {
                // better way to do this?
                if (path === '/game') {
                    $window.location.href = path;
                } else {
                    $location.path(path);
                }
            };

            // todo: config boardId and/or config via server
            Topic.getTopics("news").then(function(results) {
                $scope.posts = results;
            }, function(err) {
                $log.error('error getting news topics', err);
            });
        }
    ]);