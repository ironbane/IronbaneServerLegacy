angular.module('IronbaneApp')
    .controller('MessageListCtrl', ['$scope', 'Message', '$log', '$location', '$window',
        function($scope, Message, $log, $location, $window) {
            Message.getAll()
                .then(function(messages) {
                    $scope.messages = messages;
                }, function(error) {
                    $scope.message = error;
                });

            $scope.newPost = function() {

                $scope.message = "new post";
                $location.path('/messages/new');
            };

            $scope.$watch('messages', function(messages) {
                $scope.selectedCount = 0;
                angular.forEach(messages, function(message) {
                    if (message.checked) {
                        $scope.selectedCount += 1;
                    }
                });
            }, true);

            $scope.deletePost = function() {
                $log.log("deleting");
                var selectedPosts = [];
                angular.forEach($scope.messages, function(message) {
                    if (message.checked) {
                        selectedPosts.push(message.id);
                    }
                });
                Message.delete(selectedPosts);
            };
        }
    ]);