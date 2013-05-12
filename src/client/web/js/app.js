// app.js
angular.module('IronbaneApp', [])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            templateUrl: '/views/home',
            controller: 'HomeCtrl'
        })
        .otherwise({redirectTo: '/'});
}]);