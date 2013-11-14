IronbaneApp
.service('UnitSvc', ['$http', '$q', '$log', 'Unit', function($http, $q, $log, Unit) {
    this.getById = function(unitId) {
        var url = "/api/units/" + unitId;

        return $http.get(url).then(function(response) {
            return new Unit(response.data);
        }, function(err) {
            return $q.reject(err);
        });
    };
}]);