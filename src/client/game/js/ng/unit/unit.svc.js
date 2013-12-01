IronbaneApp
.service('UnitSvc', ['$http', '$q', '$log', 'editUnit', function($http, $q, $log, editUnit) {
    this.getById = function(unitId) {
        var url = "/api/units/" + unitId;

        return $http.get(url).then(function(response) {
            return new editUnit(response.data);
        }, function(err) {
            return $q.reject(err);
        });
    };
}]);