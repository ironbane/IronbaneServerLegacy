// forum.js
angular.module('IronbaneApp')
.controller('ForumCtrl', ['$scope', 'Forum','$log', function($scope, Forum,$log) {
    Forum.getAllWithBoards().then(function(forum) { 
	    $scope.cats = forum;
	}, function(error) {
		 $log.log(error);
		});
    	
    Forum.getLatestOnlineUsers().then(function(users){
    	$log.log(users);
    	$scope.users = users.data;
    }, function(error) { 
    	$log.log(error);
    });
        
}]);