// topic.js
angular.module('IronbaneApp')
.controller('TopicCtrl', ['Topic','$log','$scope', 'ResolveData', function(Topic, $log, $scope, ResolveData) {
    $scope.board = ResolveData.board;

    $scope.posts = ResolveData.posts;
    $scope.topic = ResolveData.topic.data;

    $scope.$on('postSaveSuccess', function(event, post) {
        post.user = $scope.$root.currentUser; // somehow need to get currentUser updated with forum data (avatar, posts, etc.)
        $scope.posts.push(post);
    });

    $scope.lock = function(){

    	Topic.lock($scope.topic.id)
    	.then(function(succes){
    		$log.log('topic locked');
            $scope.topic.locked=1;
    	}, function(error){
    		$log.log('error while locking topic');
    	});
    }

    $scope.unlock = function(){

    	Topic.unlock($scope.topic.id)
    	.then(function(succes){
    		$log.log('topic unlocked');
             $scope.topic.locked=0;
    	}, function(error){
    		$log.log('error while locking topic');
    	});
    }
}]);