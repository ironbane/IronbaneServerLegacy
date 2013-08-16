// topic.js
angular.module('IronbaneApp')
.controller('TopicCtrl', ['$scope', 'ResolveData', function($scope, ResolveData) {
    $scope.board = ResolveData.board;

    $scope.posts = ResolveData.posts;
    $scope.topic = ResolveData.topic;
}]);