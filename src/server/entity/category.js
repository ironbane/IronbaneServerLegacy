/*
    This file is part of Ironbane MMO.

    Ironbane MMO is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Ironbane MMO is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Ironbane MMO.  If not, see <http://www.gnu.org/licenses/>.
*/
var Class = require('../../common/class'),
    db = require('../db');
module.exports = function() {
    var Q = require('q'),
        _ = require('underscore');

    var Category = Class.extend({
        init: function(json) {
            _.extend(this, json || {});
        }
    });

    Category.get = function(bookId) {
        var deferred = Q.defer();

        db.query('select * from forum_cats where id=?', [bookId], function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            if(results.length === 0) {
                deferred.reject('Category not found.');
                return;
            }

            deferred.resolve(new Category(results[0]));
        });

        return deferred.promise;
    };

    return Category;
};