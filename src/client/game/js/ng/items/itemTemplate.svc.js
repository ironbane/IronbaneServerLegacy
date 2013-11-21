IronbaneApp
.service('ItemTemplateSvc', ['$http', '$q', '$log', 'ItemTemplate', function($http, $q, $log, ItemTemplate) {
    this.getAll = function() {
        var url = "/api/item_templates";

        return $http.get(url).then(function(response) {
            var results = [];

            angular.forEach(response.data, function(data) {
                results.push(new ItemTemplate(data));
            });

            return results;
        });
    };

    this.getAnalysis = function(itemId) {
        return $http.get('/api/item_templates/' + itemId + '/analysis').then(function(response) {
            return response.data;
        }, function(err) {
            return $q.reject(err);
        });
    };
}]);