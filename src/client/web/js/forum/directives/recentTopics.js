angular.module('IronbaneApp')
    .directive('recentTopics', ['Topic', '$log',
        function(Topic, $log) {
            return {
                restrict: "E",
                scope: {},
                templateUrl: '/partials/recentTopics.html',
                controller: ['$scope', '$element', function($scope, $element) {
                    $scope.topicsLimit = 10;

                    // todo: config boardId and/or config via server
                    Topic.getRecentTopics().then(function(results) {
                        $scope.recentTopics = results;
                    }, function(err) {
                        $log.error('error getting news topics', err);
                    });

                    $scope.increase = function() {
                        $scope.topicsLimit += 10;
                    };

                    $scope.decrease = function() {
                        $scope.topicsLimit -= 10;
                    };
                }]
            };
        }
    ]);