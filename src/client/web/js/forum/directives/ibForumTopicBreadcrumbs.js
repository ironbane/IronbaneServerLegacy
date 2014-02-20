angular.module('IronbaneApp')
    .directive('ibForumTopicBreadcrumbs', [
        function() {
            return {
                restrict: "E",
                templateUrl: '/partials/ibForumTopicBreadcrumbs.html'
            };
        }
    ]);