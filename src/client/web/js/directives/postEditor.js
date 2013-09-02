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
        controller: ['$scope', 'Post', '$log', '$route', function($scope, Post, $log, $route) {
            $scope.save = function() {
                // todo: validate form
                $log.log($scope);
                    $log.log("saving post");
                var post = new Post({
                    time: (new Date()).valueOf() / 1000, // convert to mysql unix_timestamp
                    content: $scope.post.body,
                    user: $scope.$root.currentUser.id // temp for now
                });
                $log.log("topic: " + $scope.topic);
                if($scope.topic === undefined ){

                    post.title = $scope.post.title;
                }
                $log.log(post);


                var savePromise;
                $log.log("scope: "+ $scope.board);
                // has a topic? reply else new topic
                if($scope.topic) {
                    savePromise = post.$save($scope.board, $scope.topic);
                } else {
                    savePromise = post.$save($scope.board);
                }

                savePromise.then(function(result) {
                    // inject the post somewhere for auto rendering

                    // clear the form
                    delete $scope.post;
                    $scope.postEditorForm.$setPristine();
                    $route.reload();
                });
            };
        }]
    };
}]);