angular.module('IronbaneApp')
    .directive('userlink', [
        function() {
            return {
                restrict: "E",
                scope: {
                    name: "@"
                },
                template: '<a href="/user/profile/{{ name }}">{{ name }}</a>'
            };
        }
    ]);