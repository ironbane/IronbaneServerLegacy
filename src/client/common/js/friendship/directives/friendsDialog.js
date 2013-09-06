angular.module('Friends')
.directive('friendsDialog', ['$log', function($log) {
    // todo: store as html file, compile during grunt
    var tmpl = [
        '<div class="dialog">',
            '<header><h2>Friends</h2></header>',
            '<div class="body">',
                '<ul>',
                    '<li ng-repeat="friend in friends">{{ friend.name }}</li>',
                '</ul>',
            '</div>',
            '<footer></footer>',
        '</div>'].join('');

    return {
        scope: {
            userId: '=',
            characterId: '='
        },
        template: tmpl,
        replace: true,
        controller: ['$scope', '$log', 'FriendService', function($scope, $log, FriendService) {
            $scope.friends = [];

            FriendService.get($scope.userId, $scope.characterId).then(function(friends) {
                $scope.friends = friends;
            }, function(err) {
                $log.error('error getting friends');
            });
        }]
    };
}]);
