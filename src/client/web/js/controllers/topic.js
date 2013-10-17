// topic.js
angular.module('IronbaneApp')
.controller('TopicCtrl', ['User','Post','Topic','$log','$scope', 'ResolveData', function(User, Post, Topic, $log, $scope, ResolveData) {
    $scope.board = ResolveData.board;

    $scope.posts = ResolveData.posts;
    $scope.topic = ResolveData.topic.data;

    $scope.$on('postSaveSuccess', function(event, returnedPosts) {
        $log.log("save success: ");
        $log.log(returnedPosts);
        angular.forEach(returnedPosts, function(post) {
        $log.log(post);
            var p = new Post(post);
            p.user.avatar = p.user.avatar || User.getDefaultAvatar();
            $log.log(p);
            $scope.posts.push(p);
        });
        //post.user = $scope.$root.currentUser; // somehow need to get currentUser updated with forum data (avatar, posts, etc.)
        //$scope.posts.push(post);
    });

    $scope.likePost = function(post){
        $log.log("like");
        $log.log(post);
        Post.like(post)
        .then(function(success){
            $log.log("topic liked");
            angular.forEach($scope.posts, function(_post){
                $log.log($scope.posts);
                
                if(_post.id === post){
                    if(_post.likes===null){
                        _post.likes = [];
                    }
                    $log.log(_post);
                    _post.likes.push($scope.$root.currentUser.name);
                }
            });
        }, function(error){
            $log.log("whoops," + error);
        });
    };

    $scope.lock = function(){

    	Topic.lock($scope.topic.id)
    	.then(function(succes){
    		$log.log('topic locked');
            $scope.topic.locked=1;
    	}, function(error){
    		$log.log('error while locking topic');
    	});
    };

    $scope.unlock = function(){

    	Topic.unlock($scope.topic.id)
    	.then(function(succes){
    		$log.log('topic unlocked');
             $scope.topic.locked=0;
    	}, function(error){
    		$log.log('error while locking topic');
    	});
    };

    $scope.sticky = function(){

        Topic.sticky($scope.topic.id)
        .then(function(succes){
            $log.log('topic sticky');
            $scope.topic.sticky=1;
        }, function(error){
            $log.log('error while stickying topic');
        });
    };

    $scope.unsticky = function(){

        Topic.unsticky($scope.topic.id)
        .then(function(succes){
            $log.log('topic unsticky');
             $scope.topic.sticky=0;
        }, function(error){
            $log.log('error while unstickying topic');
        });
    };
}]);