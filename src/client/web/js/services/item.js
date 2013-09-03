// board.js
angular.module('IronbaneApp')
.factory('Item', ['$http', '$log','$q', function($http, $log,$q) {
    var Item = function(json) {
        angular.copy(json || {}, this);
    };

    Item.getAll = function() {
        return $http.get('/api/editor/item_template')
        .then(function(results){
             var templates = [];
               angular.forEach(results.data, function(item_template){
                    templates.push(new Item(item_template));
                });
                return templates;
        }, function(error) {
            $q.reject();
        });
    };

    Item.get = function(templateId){
        
        return $http.get('/api/editor/item_template/'+templateId)
        .then(function(results){
            $log.log(results);
            return new Item(results.data);
        }, function(error) {
            $q.reject();
        });
    };

    return Item;
}]);