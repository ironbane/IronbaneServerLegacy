// game state / workflow
IronbaneApp
.config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
        function($stateProvider, $locationProvider, $urlRouterProvider) {
            $locationProvider.html5Mode(true);

            //$urlRouterProvider.otherwise('/');

            // state machine router (since game doesn't have url routing)
            $stateProvider
                .state('mainMenu', {
                    templateUrl: '/game/templates/mainMenu.html',
                    controller: ['$scope', '$state', '$log',
                        function($scope, $state, $log) {
                            $scope.gameVersion = '0.3.1 alpha'; // todo: get elsewhere
                            if($scope.currentUser.authenticated) {
                                $state.go('mainMenu.charSelect', {startingIndex: 0}); // todo: starting index based on last used char
                            } else {
                                $state.go('mainMenu.unauthenticated');
                            }
                    }]
                })
                .state('mainMenu.unauthenticated', {
                    templateUrl: '/game/templates/pre-login.html',
                    controller: ['$scope', '$state', '$log', '$modal', '$window', function($scope, $state, $log, $modal, $window) {
                        $scope.guestPlay = function() {
                            $log.log('play clicked');
                            var modalInstance = $modal.open({
                                windowClass: 'dialog alert-box',
                                templateUrl: '/game/templates/basicAlert.html',
                                controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
                                    $scope.title = 'Server Down!';
                                    $scope.message = "We're very sorry but it appears that the server is not responding. Please try again later.";

                                    $scope.ok = function() {
                                        $modalInstance.dismiss('ok');
                                    };
                                }]
                            });
                        };

                        $scope.login = function() {
                            $state.go('mainMenu.login');
                        };

                        $scope.register = function() {
                            $state.go('mainMenu.register');
                        };

                        $scope.options = function() {
                            $state.go('mainMenu.options');
                        };

                        $scope.quit = function() {
                            // for us, quit means back to website
                            $window.location.href = '/';
                        };
                    }]
                })
                .state('mainMenu.login', {
                    templateUrl: '/game/templates/login.html',
                    controller: 'LoginCtrl'
                })
                .state('mainMenu.register', {
                    templateUrl: '/game/templates/register.html',
                    controller: 'RegisterCtrl'
                })
                .state('mainMenu.options', {
                    templateUrl: '/game/templates/options.html',
                    controller: 'OptionsCtrl'
                })
                .state('mainMenu.charSelect', {
                    templateUrl: '/game/templates/charSelect.html',
                    controller: 'CharSelectCtrl'
                })
                .state('mainMenu.charSelectNew', {
                    templateUrl: '/game/templates/charSelectNew.html',
                    controller: ['$log', '$scope', 'MAX_CHAR_SLOTS', 'User', function($log, $scope, MAX_CHAR_SLOTS, User) {
                        $scope.remainingSlots = MAX_CHAR_SLOTS -= $scope.currentUser.activeCharCount;

                        $scope.prev = function() {
                            $scope.$state.go('mainMenu.charSelect', {startingIndex: $scope.currentUser.activeCharCount - 1});
                        };

                        $scope.next = function() {
                            $scope.$state.go('mainMenu.charSelect');
                        };

                        $scope.logout = function() {
                            User.logout().then(function() {
                                $scope.$state.go('mainMenu.unauthenticated');
                            }, function(err) {
                                $log.error(err);
                            });
                        };

                        $scope.create = function() {
                            $scope.$state.go('mainMenu.charCreate');
                        };
                    }]
                })
                .state('mainMenu.charCreate', {
                    templateUrl: '/game/templates/charCreate.html',
                    controller: 'CharCreateCtrl'
                })
                .state('loading', {
                    url: '/',
                    template: '<div loading-bar fake="isProduction" messages="loadingMessages" message-index="$state.current.data.messageIndex"></div>',
                    data: {
                        messageIndex: 0
                    },
                    controller: ['$scope', '$state', 'funnyLoads', '$window', function($scope, $state, funnyLoads, $window) {
                        var devMessages = [
                            'Loading Terrain',
                            'Loading Cells',
                            'Loading Music',
                            'Loading Area'
                        ];

                        funnyLoads.unshift('Loading');
                        devMessages.unshift('Loading');

                        $scope.isProduction = $window.isProduction;
                        $scope.loadingMessages = $scope.isProduction ? funnyLoads : devMessages;
                    }]
                })
                .state('loading.terrain', {
                    data: {
                        messageIndex: 1
                    }
                })
                .state('loading.cells', {
                    data: {
                        messageIndex: 2
                    }
                })
                .state('loading.music', {
                    data: {
                        messageIndex: 3
                    }
                })
                .state('loading.area', {
                    data: {
                        messageIndex: 4
                    }
                })
                .state('playing', {
                    templateUrl: '/game/templates/playHud.html',
                    controller: 'PlayCtrl'
                });
        }
    ])
    .run(
        ['$rootScope', '$state', '$stateParams',
            function($rootScope, $state, $stateParams) {

                // It's very handy to add references to $state and $stateParams to the $rootScope
                // so that you can access them from any scope within your applications.For example,
                // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
                // to active whenever 'contacts.list' or one of its decendents is active.
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]);