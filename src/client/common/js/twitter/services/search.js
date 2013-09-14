angular.module('TwitterServices')
    .service('TwitterSearch', ['$log', '$http', '$q',
        function($log, $http, $q) {
            // apparently this is deprecated, need to switch to API v1.1 which requires auth / app
            var url = 'http://search.twitter.com/search.json' +
                '?&rpp=100&include_entities=true&result_type=mixed' +
                '&callback=JSON_CALLBACK';

            this.search = function(searchTerm, lastID) {
                var params = '&q=' + searchTerm + (lastID ? '&since_id=' + lastID : '');
                //$log.log( params );

                // return a promise
                return $http.jsonp(url + params)
                    .then(function(response) {

                        // intercpet the response to parse the data items
                        // and format post dates

                        var data = response.data.results;
                        for (var i = 0; i < data.length; i++) {
                            data[i].date = Date.parse(data[i].created_at);
                        }

                        // Build special response
                        return {
                            items: data,
                            refreshURL: response.data.refresh_url,
                            query: response.data.query
                        };

                    });
            };
        }
    ]);
