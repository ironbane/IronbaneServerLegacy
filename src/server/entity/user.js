// user.js - backend user entity / service
module.exports = function(db) {
    var Q = require('q'),
        _ = require('underscore');

    var User = function(json) {
        _.extend(this, json || {});
    };

    User.prototype.$save = function() {
        var self = this;
        var bcrypt = require('bcrypt-nodejs'),
            deferred = Q.defer();

        if(self.id && self.id > 0) {
            // then this is an update
            // TODO: perform update
            deferred.resolve(self);
        } else {
            // new user
            self.reg_date = (new Date()).valueOf() / 1000;
            self.password = bcrypt.hashSync(self.password);

            db.query('insert into bcs_users set ?', self, function(err, result) {
                if(err) {
                    deferred.reject(err);
                    return;
                }

                // result will contain id
                self.id = result.insertId;
                deferred.resolve(self);
            });
        }

        return deferred.promise;
    };

    User.getById = function(id) {
        var deferred = Q.defer();

        db.query('select * from bcs_users where id = ?', [id], function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            if(results.length === 0) {
                deferred.reject("no user found");
            } else {
                var user = results[0];
                // add in security roles
                db.query('select name from bcs_roles where id in (select role_id from bcs_user_roles where user_id = ?)', [user.id], function(err, results) {
                    if(err) {
                        log('error getting roles!', err);
                        user.roles = [];
                    } else {
                        user.roles = results.map(function(r) { return r.name; });
                    }
                    // at this point still send the user, error isn't fatal
                    deferred.resolve(user);
                });
            }
        });

        return deferred.promise;
    };

    return User;
};