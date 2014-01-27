angular.module('IronbaneApp')
    .factory('myHttpInterceptor', ['$q',
        function($q) {
            return function(promise) {
                return promise.then(function(response) {
                    // do something on success
                    // todo hide the spinner
                    $('#loading').hide();
                    return response;

                }, function(response) {
                    // do something on error
                    // todo hide the spinner
                    $('#loading').hide();
                    return $q.reject(response);
                });
            };
        }
    ]);