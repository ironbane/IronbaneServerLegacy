// board.js
angular.module('IronbaneApp')
    .factory('Message', ['$http', '$log', '$q',
        function($http, $log, $q) {
            var Message = function(json) {
                angular.copy(json || {}, this);
            };

            Message.getAll = function() {
                $log.log("getting all messages");
                return $http.get('/api/messages/')
                    .then(function(results) {
                        var messages = [];
                        $log.log(results);
                        angular.forEach(results.data, function(Message_template) {
                            messages.push(new Message(Message_template));
                        });
                        return messages;
                    }, function(error) {
                        $q.reject();
                    });
            };

            Message.delete = function(messageIds) {
                return $http.post('/api/messages/delete', messageIds)
                    .then(function(results) {
                        $log.log("ALL OK!");
                    }, function(err) {
                        $log.log("WHOOPS");
                    });
            };

            Message.send = function(message) {
                return $http.post('/api/message', message)
                    .then(function(results) {
                        $log.log("ALL OK!");
                    }, function(err) {
                        $log.log("WHOOPS");
                    });
            };

            Message.get = function(messageId) {

                return $http.get('/api/message/' + messageId)
                    .then(function(results) {
                        $log.log(results);
                        return new Message(results.data);
                    }, function(error) {
                        $q.reject();
                    });
            };

            return Message;
        }
    ]);