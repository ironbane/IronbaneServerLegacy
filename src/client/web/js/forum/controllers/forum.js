// forum.js
angular.module('IronbaneApp')
    .controller('ForumCtrl', ['$scope', 'Forum', '$log',
        function($scope, Forum, $log) {
            Forum.getAllWithBoards().then(function(forum) {
                $scope.cats = forum;
            }, function(error) {
                $log.log(error);
            });

            Forum.getLatestOnlineUsers().then(function(users) {
                $scope.users = users;
            }, function(error) {
                $log.log(error);
            });

            Forum.getStatistics().then(function(statistics) {
                $scope.statistics = statistics;

            }, function(error) {
                $log.log(error);
            });

        }
    ]);