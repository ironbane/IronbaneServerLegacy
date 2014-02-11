angular.module('IronbaneApp')
    .directive('userlink', [
        function() {
            return {
                restrict: "E",
                scope: {
                    name: "@"
                },
                template: '<a class="user-link" href="/user/profile/{{ name }}">{{ name }}</a>'
            };
        }
    ]);