// app.js - interim angular app
var IronbaneApp = angular.module('Ironbane', ['ngSanitize', 'ui.router', 'User', 'Friends']);

IronbaneApp
    .constant('GAME_HOST', window.ironbane_hostname) // todo: fill these in using server/grunt instead?
    .constant('GAME_PORT', window.ironbane_port)
/*
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
        function($stateProvider, $locationProvider, $urlRouterProvider) {
            $locationProvider.html5Mode(true);

            //$urlRouterProvider.otherwise('/');

            // state machine router (since game doesn't have url routing)
            $stateProvider
                // root state
                .state('mainMenu', {
                    url: '/',
                    templateUrl: '/game/templates/mainMenu.html',
                    controller: ['$scope', '$state', '$log',
                        function($scope, $state, $log) {
                            $scope.
                            switch = function() {
                                $log.log('switch clicked!');
                                $state.go('playing');
                            };
                        }
                    ]
                })
                .state('playing', {
                    template: '<p>main menu test</p>'
                });
        }
    ])
*/
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
        ])
    .run(['User', '$rootScope',
        function(User, $rootScope) {
            $rootScope.currentUser = {};
            User.getCurrentUser()
                .then(function(user) {
                    angular.copy(user, $rootScope.currentUser);
                });
        }
    ])
    .run(['$log', '$window', 'Game',
        function($log, $window, Game) {
            var ironbane = new Game();

            // for the global references still pending...
            $window.ironbane = ironbane;

            // here we go!
            ironbane.start();
        }
    ]);