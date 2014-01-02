// chat.js

IronbaneApp
.directive('itemSlot', ['$log', '$window', '$timeout', function($log, $window, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        
        template: '<div id="is{{number}}" class="dragon-slot itemBarSlot"></div>',
        link: function(scope, el, attrs){
        	scope.number = attrs.number;
        }
    };
}]);