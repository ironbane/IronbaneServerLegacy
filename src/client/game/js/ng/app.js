// app.js - interim angular app
var IronbaneApp = angular.module('Ironbane', ['ngSanitize']);

IronbaneApp.run(['$log', '$window', 'Game', function($log, $window, Game) {
    var ironbane = new Game();

    // for the global references still pending...
    $window.ironbane = ironbane;

    // here we go!
    ironbane.start();
}]);
