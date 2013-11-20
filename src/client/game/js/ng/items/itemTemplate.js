IronbaneApp
.factory('ItemTemplate', ['$log', function($log) {
    var ItemTemplate = function(config) {
        angular.copy(config || {}, this);
    };

    return ItemTemplate;
}]);