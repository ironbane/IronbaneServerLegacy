IronbaneApp
.directive('helpDialog', ['$log', function($log) {
    return {
        restrict: 'EA',
        templateUrl: '/game/templates/help_dialog.html',
        scope: true
    };
}]);