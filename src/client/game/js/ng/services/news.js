IronbaneApp
    .factory('News', ['$http', '$q', '$log',
        function($http, $q, $log) {
            var getNews = function() {
                return $http.get('/api/forum/news/topics')
                    .then(function(response) {
                        return response.data; // for now no processing...
                    }, function(err) {
                        $log.warn('error getting news!', err);
                        return [];
                    });
            };

            return {
                get: getNews
            };
        }
    ]);
