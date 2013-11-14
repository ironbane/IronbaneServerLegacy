IronbaneApp
.factory('UnitTemplate', ['$log', function($log) {
    var UnitTemplate = function(config) {
        angular.copy(config || {}, this);
    };

    return UnitTemplate;
}]);