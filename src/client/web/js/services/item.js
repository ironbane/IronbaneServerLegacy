// board.js
angular.module('IronbaneApp')
.factory('Item', ['$http', '$log','$q', function($http, $log,$q) {
    var Item = function(json) {
        angular.copy(json || {}, this);
    };

    Item.getAll = function() {
        return $http.get('/api/editor/item_template').
        then(function(results){
            $log.log("item_template received");
            $log.log(results);
            return results;
        }, function(error) {
            $q.reject();
        });
    };

    return Item;
}]);