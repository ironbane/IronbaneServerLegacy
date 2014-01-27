// app.js
angular.module('IronbaneApp', ['ngRoute', 'ui.utils', 'IBCommon', 'User'])
    .constant('DEFAULT_AVATAR', '/images/noavatar.png')
    .run(['User', '$rootScope', '$log', '$location',
        function(User, $rootScope, $log, $location) {

            // load it up for rootscope
            User.getCurrentUser();

            $rootScope.logout = function() {
                User.logout().then(function() {
                    $location.path('/');
                }, function(err) {
                    $log.error('Error logging out! ' + err);
                });
            };

            $rootScope.$on("$routeChangeError", function(event, current, previous, rejection) {
                $log.debug('routeChangeError: ', arguments);

                if (previous && previous.path) {
                    $location.path(previous.path);
                } else {
                    $location.path('/');
                }
            });
        }
    ])
    .service('RouteSecurity', ['User', '$q', '$log',
        function(User, $q, $log) {
            this.secureEditor = function() {
                var deferred = $q.defer();

                User.getCurrentUser().then(function(user) {
                    $log.debug('secured route attempt: ', user);
                    if (!user.authenticated || !user.$hasRole('EDITOR')) {
                        deferred.reject('not allowed');
                    } else {
                        deferred.resolve('proceed');
                    }
                });

                return deferred.promise;
            };
        }
    ])
    .config(['$routeProvider', '$locationProvider', '$httpProvider',
        function($routeProvider, $locationProvider, $httpProvider) {

            $httpProvider.responseInterceptors.push('myHttpInterceptor');
            var spinnerFunction = function(data, headersGetter) {
                // todo start the spinner here
                $('#loading').show();
                return data;
            };
            $httpProvider.defaults.transformRequest.push(spinnerFunction);

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
                .when('/messages/new', {
                    templateUrl: '/views/newmessage',
                    controller: 'MessageSendCtrl'
                })
                .when('/login', {
                    templateUrl: '/views/login',
                    controller: 'LoginCtrl'
                })
                .when('/profile', {
                    templateUrl: '/views/preferences',
                    controller: 'PreferencesCtrl'
                })
                .when('/article/:articleId', {
                    templateUrl: '/views/article',
                    controller: 'ArticleCtrl',
                    resolve: {
                        ArticleData: ['Article', '$q', '$log', '$route',
                            function(Article, $q, $log, $route) {
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
                            }
                        ]
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
                        ResolveData: ['Board', 'Topic', '$q', '$route',
                            function(Board, Topic, $q, $route) {
                                var deferred = $q.defer(),
                                    boardId = $route.current.params.boardId;

                                $q.all([Board.get(boardId), Topic.getTopics(boardId)])
                                    .then(function(results) {
                                        deferred.resolve({
                                            board: results[0],
                                            topics: results[1]
                                        });
                                    }, function(err) {
                                        deferred.reject(err);
                                    });

                                return deferred.promise;
                            }
                        ]
                    }
                })
                .when('/forum/:boardId/topics/:topicId', {
                    templateUrl: '/views/topic',
                    controller: 'TopicCtrl',
                    resolve: {
                        ResolveData: ['Board', 'Topic', '$q', '$route',
                            function(Board, Topic, $q, $route) {
                                var deferred = $q.defer(),
                                    boardId = $route.current.params.boardId,
                                    topicId = $route.current.params.topicId;

                                $q.all([Board.get(boardId), Topic.getTopic(topicId), Topic.get(topicId)])
                                    .then(function(results) {
                                        deferred.resolve({
                                            board: results[0],
                                            posts: results[1],
                                            topic: results[2]
                                        });
                                    }, function(err) {
                                        deferred.reject(err);
                                    });

                                return deferred.promise;
                            }
                        ]
                    }
                })
                .when('/editor', {
                    templateUrl: '/views/editorMenu',
                    resolve: {
                        location: '$location',
                        authorized: ['RouteSecurity',
                            function(RouteSecurity) {
                                return RouteSecurity.secureEditor();
                            }
                        ]
                    }
                })
                .when('/user/profile/:username', {
                    templateUrl: '/views/profile',
                    controller: 'ProfileCtrl',
                    resolve: {
                        ResolveData: ['User', '$q', '$route',
                            function(User, $q, $route) {
                                var deferred = $q.defer();
                                User.getProfile($route.current.params.username)
                                    .then(function(userprofile) {
                                        // should be processed already
                                        deferred.resolve({
                                            profile: userprofile
                                        });
                                    }, function(err) {
                                        // can't find such article, reject route change
                                        deferred.reject();
                                    });
                                return deferred.promise;
                            }
                        ]
                    }

                })
                .when('/editor/article', {
                    templateUrl: '/views/articleList',
                    controller: 'ArticleList',
                    resolve: {
                        authorized: ['RouteSecurity',
                            function(RouteSecurity) {
                                return RouteSecurity.secureEditor();
                            }
                        ],
                        articles: ['Article',
                            function(Article) {
                                return Article.getAll();
                            }
                        ]
                    }
                })
                .when('/editor/article/:id', {
                    templateUrl: '/views/articleEdit',
                    controller: 'ArticleEditor',
                    resolve: {
                        authorized: ['RouteSecurity',
                            function(RouteSecurity) {
                                return RouteSecurity.secureEditor();
                            }
                        ],
                        ResolveData: ['Article', '$q', '$route', '$location',
                            function(Article, $q, $route, $location) {
                                var deferred = $q.defer();
                                // don't get the rendered version, because we're editing
                                Article.get($route.current.params.id, false)
                                    .then(function(article) {
                                        if (article.articleId === null) {

                                            $location.path('/editor/article');
                                            deferred.reject();
                                            return;
                                        }

                                        deferred.resolve({
                                            article: article
                                        });
                                    }, function(err) {
                                        deferred.reject();
                                    });

                                return deferred.promise;
                            }
                        ]
                    }
                })
                .when('/editor/users', {
                    templateUrl: '/views/userslist',
                    controller: 'UsersList',
                    resolve: {
                        authorized: ['RouteSecurity',
                            function(RouteSecurity) {
                                return RouteSecurity.secureEditor();
                            }
                        ]
                    }
                })
                .when('/editor/users/:id', {
                    templateUrl: '/views/useredit',
                    controller: 'UserEditor',
                    resolve: {
                        authorized: ['RouteSecurity',
                            function(RouteSecurity) {
                                return RouteSecurity.secureEditor();
                            }
                        ],
                        ResolveData: ['User', '$q', '$route', '$location',
                            function(User, $q, $route, $location) {
                                var deferred = $q.defer();
                                User.get($route.current.params.id)
                                    .then(function(user) {
                                        deferred.resolve({
                                            user: user
                                        });
                                    }, function(err) {
                                        deferred.reject();
                                    });
                                return deferred.promise;
                            }
                        ]
                    }
                })
                .when('/bootstrap', {
                    templateUrl: '/views/bootstrap'
                    // controller: 'ForumCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }
    ])
    .run(['$rootScope', '$location', '$anchorScroll', '$routeParams', '$timeout',
        function($rootScope, $location, $anchorScroll, $routeParams, $timeout) {
            //when the route is changed scroll to the proper element.
            $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
                // $location.hash($routeParams.scrollTo);
                // $anchorScroll();
                if ($routeParams.scrollTo) {
                    // TODO: this should be a directive
                    $timeout(function() {
                        // Scroll to the element minus the navbar height
                        $("body").animate({
                            scrollTop: $("#" + $routeParams.scrollTo).offset().top - 80
                        }, "slow");
                    }, 1);
                }
            });
        }
    ]);