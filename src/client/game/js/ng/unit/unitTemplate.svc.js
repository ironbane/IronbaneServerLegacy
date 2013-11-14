IronbaneApp
.service('UnitTemplateSvc', ['$http', '$q', '$log', 'UnitTemplate', function($http, $q, $log, UnitTemplate) {
    this.getAll = function() {
        var url = "/api/unit_templates";

        return $http.get(url).then(function(response) {
            var results = [];

            angular.forEach(response.data, function(data) {
                results.push(new UnitTemplate(data));
            });

            return results;
        });
    };
}]);