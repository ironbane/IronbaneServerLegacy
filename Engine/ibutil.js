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

var fs = require('fs');
var Q = require('q');

var me = {
  walk: function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var i = 0;
      (function next() {
        var file = list[i++];
        if (!file) return done(null, results);
        file = dir + '/' + file;
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            me.walk(file, function(err, res) {
              results = results.concat(res);
              next();
            });
          } else {
            results.push(file);
            next();
          }
        });
      })();
    });
  },
  randomClamped: function() {
    return (Math.random()*2)-1;
  },
  passwordHash: function(password) {
    var shasum = crypto.createHash('md5');
    shasum.update(cryptSalt+password);
    return shasum.digest('hex');
  },
  deferredQuery: function(db, query) {
    var deferred = Q.defer();

    var mainArguments = Array.prototype.slice.call(arguments);
    mainArguments.shift();
    mainArguments.push(function(err, results) {
        if (err) {
            deferred.reject('error with query: ' + err);
            return;
        }

        deferred.resolve(results);
    });

    db.query.apply(db, mainArguments);

    return deferred.promise;
  }
};

module.exports = me;