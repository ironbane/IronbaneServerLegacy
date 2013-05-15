// app.js
angular.module('IronbaneApp', [])
.constant('DEFAULT_AVATAR', '/images/noavatar.png')
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            templateUrl: '/views/home',
            controller: 'HomeCtrl'
        })
        .when('/forum', {
            templateUrl: '/views/forum',
            controller: 'ForumCtrl'
        })
        .when('/forum/:boardId', {
            templateUrl: '/views/board',
            controller: 'BoardCtrl',
            resolve: {
                ResolveData: ['Board', 'Post', '$q', '$route', function(Board, Post, $q, $route) {
                    var deferred = $q.defer(),
                        boardId = $route.current.params.boardId;

                    $q.all([Board.get(boardId), Post.getTopics(boardId)])
                        .then(function(results) {
                            deferred.resolve({board: results[0], posts: results[1]});
                        }, function(err) {
                            deferred.reject(err);
                        });

                    return deferred.promise;
                }]
            }
        })
        .otherwise({redirectTo: '/'});
}]);