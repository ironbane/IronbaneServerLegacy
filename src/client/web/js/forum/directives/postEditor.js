// postEditor.js
angular.module('IronbaneApp')
    .directive('postEditor', [
        function() {
            return {
                scope: {
                    board: '=',
                    topic: '='
                },
                restrict: 'AE',
                templateUrl: '/partials/postEditor.html',
                controller: ['$scope', 'Post', '$log',
                    function($scope, Post, $log) {

                        $scope.save = function() {
                            // todo: validate form
                            var post = new Post({
                                content: $scope.post.body
                            });

                            var newTopic = false;

                            if ($scope.topic === undefined) {
                                post.title = $scope.post.title;
                                newTopic = true;
                            }

                            post.$save({
                                boardId: $scope.board,
                                topicId: $scope.topic
                            })
                                .then(function(result) {
                                    $scope.$emit('postSaveSuccess', result);

                                    // clear the form
                                    delete $scope.post;
                                    $scope.postEditorForm.$setPristine();

                                    if (newTopic) {
                                        // Todo: scroll to the actual thread
                                        // and give it a short highlight
                                        setTimeout(function() {
                                            $("body").animate({
                                                scrollTop: 0
                                            }, "slow");
                                        }, 1);
                                    }
                                }, function(err) {
                                    $log.error('error saving post!', err);
                                    $scope.$emit('postSaveError');
                                });
                        };
                    }
                ]
            };
        }
    ]);