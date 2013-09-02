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
        .when('/faq', {
            templateUrl: '/views/faq',
            controller: 'FaqCtrl'
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
                ResolveData: ['Board', 'Topic', '$q', '$route', function(Board, Topic, $q, $route) {
                    var deferred = $q.defer(),
                        boardId = $route.current.params.boardId;

                    $q.all([Board.get(boardId), Topic.getTopics(boardId)])
                        .then(function(results) {
                            console.log(results);
                            deferred.resolve({board: results[0], topics: results[1]});
                        }, function(err) {
                            deferred.reject(err);
                        });

                    return deferred.promise;
                }]
            }
        })
        .when('/forum/:boardId/topics/:topicId', {
            templateUrl: '/views/topic',
            controller: 'TopicCtrl',
            resolve: {
                ResolveData: ['Board', 'Topic', '$q', '$route', function(Board, Topic, $q, $route) {
                    var deferred = $q.defer(),
                        boardId = $route.current.params.boardId,
                        topicId = $route.current.params.topicId;

                    $q.all([Board.get(boardId), Topic.getTopic(topicId), Topic.get(topicId)])
                        .then(function(results) {
                            deferred.resolve({board: results[0], posts: results[1], topic: results[2]});
                        }, function(err) {
                            deferred.reject(err);
                        });

                    return deferred.promise;
                }]
            }
        })
        .when('/editor', {
            templateUrl: '/views/editorMenu',
            resolve: {
                location: '$location'
            }
        })
        .when('/user/profile/:username' , {
            templateUrl: '/views/profile',
            controller: 'ProfileCtrl',
             resolve: {
                ResolveData: ['User', '$q', '$route', function(User, $q, $route) {
                    var deferred = $q.defer();
                    User.getProfile($route.current.params.username)
                        .then(function(userprofile) {
                            // should be processed already
                            deferred.resolve({profile: userprofile.data[0]});
                        }, function(err) {
                            // can't find such article, reject route change
                           deferred.reject();
                        });
                        return deferred.promise;
                }]
            }

        })
        .when('/editor/mainMenu', {
            templateUrl: '/views/editMainMenu',
            controller: 'EditMenuCtrl',
            resolve: {
                MenuData: ['$http', function($http) {
                    return $http.get('/api/editor/menu')
                        .then(function(response) {
                            return response.data;
                        });
                }]
            }
        })
        .otherwise({redirectTo: '/'});
}]);