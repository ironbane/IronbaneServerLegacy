// board.js
angular.module('IronbaneApp')
.controller('BoardCtrl', ['$log','$scope', 'ResolveData', '$location', function($log, $scope, ResolveData, $location) {
    $scope.board = ResolveData.board;
    $scope.topics = ResolveData.topics;

    $scope.newTopic = function() {
        $location.path('/forum/' + $scope.board.id + '/post');
    };

    $scope.$on('postSaveSuccess', function(event, returnedTopics) {
        angular.forEach(returnedTopics, function(topic) {
            $scope.topics.push(topic);
        });
    });

}]);
