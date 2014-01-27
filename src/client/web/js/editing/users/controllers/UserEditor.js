angular.module('IronbaneApp')
    .controller('UserEditor', ['$log', '$http', '$scope', 'ResolveData',
        function($log, $http, $scope, ResolveData) {
            $scope.user = ResolveData.user;
            $scope.message = "";

            $scope.resetPassword = function() {
                $http.post('/api/user/admin/resetPassword' + $scope.user.id)
                    .success(function(response) {
                        $scope.message = "update succes";
                    })
                    .error(function(response) {
                        $log.warn("error resetting password", response);
                    });
            };

            $scope.updateUser = function() {
                var saveData = {
                    banned: $scope.user.banned,
                    editor: $scope.user.editor,
                    moderator: $scope.user.moderator,
                    admin: $scope.user.admin
                };

                $http.post('/api/user/' + $scope.user.id, saveData)
                    .success(function(response) {
                        $scope.message = "update success";
                    })
                    .error(function(response) {
                        $log.warn("error updating user rights");
                    });
            };
        }
    ]);