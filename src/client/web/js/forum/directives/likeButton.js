angular.module('IronbaneApp')
    .directive('likebutton', [
        function() {
            return {
                restrict: "E",
                scope: {
                    post: "=",
                    likePost: '&like'
                },
                templateUrl: '/partials/likeButton.html'
            };
        }
    ]);