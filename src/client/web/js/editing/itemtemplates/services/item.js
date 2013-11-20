// item template services
angular.module('IronbaneApp')
    .factory('Item', ['$http', '$log', '$q',
        function($http, $log, $q) {
            var Item = function(json) {
                angular.copy(json || {}, this);
            };

            Item.getAll = function() {
                return $http.get('/api/item_templates')
                    .then(function(results) {
                        var templates = [];
                        angular.forEach(results.data, function(item_template) {
                            templates.push(new Item(item_template));
                        });
                        return templates;
                    }, function(error) {
                        return $q.reject(error);
                    });
            };

            Item.get = function(templateId) {
                return $http.get('/api/item_templates/' + templateId)
                    .then(function(results) {
                        $log.log(results);
                        return new Item(results.data);
                    }, function(error) {
                        return $q.reject(error);
                    });
            };

            return Item;
        }
    ]);