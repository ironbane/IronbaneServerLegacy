// topic.js
angular.module('IronbaneApp')
.controller('TopicCtrl', ['$scope', 'ResolveData', function($scope, ResolveData) {
    $scope.board = ResolveData.board;

    $scope.posts = ResolveData.posts;
    $scope.topic = ResolveData.topic.data;

    $scope.$on('postSaveSuccess', function(event, post) {
        post.user = $scope.$root.currentUser; // somehow need to get currentUser updated with forum data (avatar, posts, etc.)
        $scope.posts.push(post);
    });
}]);