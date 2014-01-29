angular.module('IronbaneApp')
    .directive('userAdminPanel', ['$location', '$log',
        function($location, $log) {
            return {
                restrict: "E",
                scope: {
                    user: "="
                },
                templateUrl: '/partials/userAdminPanel.html',
                link: function(scope, el, attrs) {
                    scope.editUser = function(user) {
                        $location.path('/editor/users/' + user.id);
                    };

                    scope.deleteUser = function(user) {
                        // TODO: show confirm modal
                        // do soft delete
                        $log.warn('delete user clicked!', user);
                    };

                    scope.messageUser = function(user) {
                        // TODO: mailto link? or internal message?
                        $log.warn('message user clicked!', user);
                    };

                    scope.showCharacters = function(user) {
                        // TODO: nav to char mgmt page
                        $log.warn('show chars clicked', user);
                    };
                }
            };
        }
    ]);