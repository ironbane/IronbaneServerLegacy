// app.js - interim angular app
var IronbaneApp = angular.module('Ironbane', ['ngSanitize']);

IronbaneApp
.constant('GAME_HOST', window.ironbane_hostname) // todo: fill these in using server/grunt instead?
.constant('GAME_PORT', window.ironbane_port)
.run(['$log', '$window', 'Game', function($log, $window, Game) {
    var ironbane = new Game();

    // for the global references still pending...
    $window.ironbane = ironbane;

    // here we go!
    ironbane.start();
}]);
