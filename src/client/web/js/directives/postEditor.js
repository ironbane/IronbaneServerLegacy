// postEditor.js
angular.module('IronbaneApp')
.directive('postEditor', [function() {
    return {
        scope: {
            board: '=',
            topic: '='
        },
        restrict: 'AE',
        templateUrl: '/partials/postEditor.html',
        controller: ['$scope', 'Post', '$log', function($scope, Post, $log) {
            $scope.save = function() {
                // todo: validate form
                var post = new Post({
                    time: (new Date()).valueOf() / 1000, // convert to mysql unix_timestamp
                    content: $scope.post.body,
                    user: $scope.$root.currentUser.id // temp for now
                });

                if($scope.topic === undefined) {
                    post.title = $scope.post.title;
                }

                post.$save({boardId: $scope.board, topicId: $scope.topic})
                    .then(function(result) {
                        $scope.$emit('postSaveSuccess', result);

                        // clear the form
                        delete $scope.post;
                        $scope.postEditorForm.$setPristine();
                    }, function(err) {
                        $log.error('error saving post!', err);
                        $scope.$emit('postSaveError');
                    });
            };
        }]
    };
}]);