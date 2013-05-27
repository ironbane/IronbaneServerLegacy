// menu.js
var Class = require('../../common/class');

module.exports = function(db) {
    var Q = require('q'),
        _ = require('underscore');

    var MenuItem = Class.extend({
        init: function(json) {
            _.extend(this, json || {});
        }
    });

    MenuItem.getAll = function() {
        var deferred = Q.defer();

        db.query('select * from bcs_menu', [], function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            if(results.length === 0) {
                deferred.resolve([]);
                return;
            }

            // convert results into user objects
            results.forEach(function(result, i) {
                results[i] = new MenuItem(result);
            });
            deferred.resolve(results);
        });

        return deferred.promise;
    };

    return MenuItem;
};