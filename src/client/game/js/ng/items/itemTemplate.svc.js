IronbaneApp
.constant('ITEM_TYPE_ENUM', {
    armor: ['head', 'body', 'feet'],
    weapon: ['sword', 'axe', 'dagger', 'bow', 'staff'],
    consumable: ['restorative'],
    tool: ['', 'map', 'key', 'book'],
    cash: ['']
})
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

    this.create = function(item) {
        // send only what the request requires
        var data = {
            name: item.name,
            image: item.image,
            type: item.type,
            subtype: item.subtype,
            attr1: item.attr1,
            delay: item.delay,
            particle: item.particle,
            basevalue: item.baseValue
        };

        return $http.post('/api/item_templates', data).then(function(response) {
            // merge memory obj with response
            var updated = response.data;
            item.id = updated.id;

            return item;
        }, function(err) {
            return $q.reject(err);
        });
    };

    this.update = function(item) {
        // send only what the request requires
        var data = {
            name: item.name,
            image: item.image,
            type: item.type,
            subtype: item.subtype,
            attr1: item.attr1,
            delay: item.delay,
            particle: item.particle,
            basevalue: item.baseValue
        };

        return $http.put('/api/item_templates/' + item.id, data).then(function(response) {
            return item;
        }, function(err) {
            return $q.reject(err);
        });
    };
}]);