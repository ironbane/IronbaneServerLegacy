IronbaneApp
.directive('alertBox', ['$log', function($log) {
    return {
        restrict: 'EA',
        scope: {
            alert: '='
        },
        templateUrl: '/game/templates/alertBox.html',
        replace: false,
        link: function(scope, el, attrs) {
            $log.log('alert-box link!');
            scope.$watch('alert', function(alert) {
                if(alert) {
                    el.show();
                } else {
                    el.hide();
                }
            }, true);
        }
    };
}]);
