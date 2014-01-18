angular.module('IronbaneApp')
    .directive('forumuserprofile', [
        function() {
            return {
                restrict: "E",
                scope: {
                    user: "="
                },
                templateUrl: '/partials/forumuserprofile.html'
            };
        }
    ]);