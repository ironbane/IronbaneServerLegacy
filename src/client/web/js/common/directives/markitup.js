// markitup.js
angular.module('IronbaneApp')
    .directive('markItUp', [
        function() {
            return {
                restrict: 'AE',
                replace: true,
                template: '<textarea></textarea>',
                link: function(scope, el, attrs) {
                    el.markItUp(myBbcodeSettings);
                }
            };
        }
    ]);