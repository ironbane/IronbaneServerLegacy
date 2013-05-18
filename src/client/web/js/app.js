// app.js
angular.module('IronbaneApp', [])
.constant('DEFAULT_AVATAR', '/images/noavatar.png')
.run(['User', '$rootScope', function(User, $rootScope) {
    $rootScope.currentUser = {};
    User.getCurrentUser()
        .then(function(user) {
            angular.copy(user, $rootScope.currentUser);
        });
}])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            templateUrl: '/views/home',
            controller: 'HomeCtrl'
        })
        .when('/register', {
            templateUrl: '/views/register',
            controller: 'RegisterCtrl'
        })
        .when('/login', {
            templateUrl: '/views/login',
            controller: 'LoginCtrl'
        })
        .when('/article/:articleId', {
            templateUrl: '/views/article',
            controller: 'ArticleCtrl',
            resolve: {
                ArticleData: ['Article', '$q', '$log', '$route', function(Article, $q, $log, $route) {
                    var deferred = $q.defer();

                    Article.get($route.current.params.articleId)
                        .then(function(article) {
                            // should be processed already
                            deferred.resolve(article);
                        }, function(err) {
                            // can't find such article, reject route change
                            deferred.reject(err);
                        });

                    return deferred.promise;
                }]
            }
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
        .when('/forum/:boardId/post', {
            templateUrl: '/views/postEdit',
            controller: 'PostEditCtrl',
            resolve: {
                BoardData: ['Board', '$route', function(Board, $route) {
                    return Board.get($route.current.params.boardId);
                }]
            }
        })
        .otherwise({redirectTo: '/'});
}]);