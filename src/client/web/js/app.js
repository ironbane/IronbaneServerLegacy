// app.js
angular.module('IronbaneApp', ['ui.utils', 'ui.bootstrap', 'IBCommon', 'User'])
.constant('DEFAULT_AVATAR', '/images/noavatar.png')
.run(['User','$rootScope', function(User, $rootScope) {
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
        .when('/messages', {
            templateUrl: '/views/messagelist',
            controller: 'MessageListCtrl'
        })
        .when('/login', {
            templateUrl: '/views/login',
            controller: 'LoginCtrl'
        })
        .when('/profile', {
            templateUrl: '/views/myProfile',
            controller: 'MyProfileCtrl'
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
                            deferred.resolve({profile: userprofile});
                        }, function(err) {
                            // can't find such article, reject route change
                           deferred.reject();
                        });
                        return deferred.promise;
                }]
            }

        })
        .when('/editor/item_template', {
            templateUrl: '/views/item_template_list',
            controller: 'ItemTemplateList'

        })
        .when('/editor/item_template/:id', {
            templateUrl: '/views/item_template_editor',
            controller: 'ItemTemplateEditor',
            resolve: {
                ResolveData: ['Item', '$q', '$route', '$location', function(Item, $q, $route, $location) {
                    var deferred = $q.defer();
                    Item.get($route.current.params.id)
                        .then(function(template) {
                            if(template.id == null){

                                $location.path('/editor/item_template');
                                deferred.reject();
                                return;
                            }
                            deferred.resolve({template: template});
                        }, function(err) {
                           deferred.reject();
                        });
                        return deferred.promise;
                }]
            }

        })
        .when('/editor/unit_template', {
            templateUrl: '/views/unit_template_list',
            controller: 'UnitTemplateList'

        })
        .when('/editor/unit_template/:id', {
            templateUrl: '/views/unit_template_editor',
            controller: 'UnitTemplateEditor',
            resolve: {
                ResolveData: ['User', '$q', '$route', function(User, $q, $route) {
                    var deferred = $q.defer();
                    Item.get($route.current.params.id)
                        .then(function(template) {
                            deferred.resolve({template: template});
                        }, function(err) {
                           deferred.reject();
                        });
                        return deferred.promise;
                }]
            }

        })
        .when('/editor/article', {
            templateUrl: '/views/articlelist',
            controller: 'ArticleList'
        })
        .when('/editor/article/:id', {
            templateUrl: '/views/articleedit',
            controller: 'ArticleEditor',
            resolve: {
                ResolveData: ['Article', '$q', '$route', '$location', function(Article, $q, $route, $location) {
                    var deferred = $q.defer();
                    Article.get($route.current.params.id)
                        .then(function(article) {
                            if(article.articleId == null){

                                $location.path('/editor/article');
                                deferred.reject();
                                return;
                            }
                            deferred.resolve({article: article});
                        }, function(err) {
                           deferred.reject();
                        });
                        return deferred.promise;
                }]
            }
        })
        .when('/editor/users', {
            templateUrl: '/views/userslist',
            controller: 'UsersList'
        })
        .when('/editor/users/:id', {
            templateUrl: '/views/useredit',
            controller: 'useredit'
        })
        .otherwise({redirectTo: '/'});
}]);