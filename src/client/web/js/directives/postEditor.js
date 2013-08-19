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
                    title: $scope.post.subject,
                    time: (new Date()).valueOf() / 1000, // convert to mysql unix_timestamp
                    bbcontent: $scope.post.body,
                    user: $scope.$root.currentUser.id // temp for now
                });


                var savePromise;
                // has a topic? reply else new topic
                if($scope.topic && $scope.topic.id) {
                    savePromise = post.$save($scope.board.id, $scope.topic.topic_id);
                } else {
                    savePromise = post.$save($scope.board.id);
                }

                savePromise.then(function(result) {
                    // inject the post somewhere for auto rendering

                    // clear the form
                    delete $scope.post;
                    $scope.postEditorForm.$setPristine();
                });
            };
        }]
    };
}]);