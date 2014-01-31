angular.module('IronbaneApp')
    .controller('MessageSendCtrl', ['$scope', '$log', 'Message',
        function($scope, $log, Message) {

            $scope.send = function() {
                Message.send({
                    to_user: $scope.to_user,
                    subject: $scope.subject,
                    content: $scope.content
                });
            };
        }
    ]);