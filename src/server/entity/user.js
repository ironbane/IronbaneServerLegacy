// user.js - backend user entity / service
var Class = require('../../common/class'),
    log = require('util').log;

module.exports = function(db) {
    var Q = require('q'),
        _ = require('underscore');

    var User = Class.extend({
        init: function(json) {
            _.extend(this, json || {});
        },
        $save: function() {
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

                db.query('select count(id) as c from bcs_users where username = ?', [self.username], function(err, results) {
                    if (results['c'] === 1) {
                        return deferred.reject("usernametaken");
                    }
                });
                db.query('select count(id) as c from bcs_users where email = ?', [self.email], function(err, results) {
                    if (results['c'] === 1) {
                        return deferred.reject("this emailaddress is already taken");
                    }
                });

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
        }
    });

    // static methods

    // NOT SURE THIS WILL WORK AS IS
    User.query = function(query) {
        var deferred = Q.defer();

        db.query('select * from bcs_users where ?', query, function(err, results) {
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
                results[i] = new User(result);
                // todo: get roles async
            });
            deferred.resolve(results);
        });

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
                return;
            } else {
                var user = new User(results[0]);
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

    // used for the login process
    User.authenticate = function(username, password) {
        var deferred = Q.defer(),
            bcrypt = require('bcrypt-nodejs');

        db.query('select * from bcs_users where username = ?', [username], function(err, results) {
            if (err) {
                return deferred.reject(err);
            }

            if (results.length < 1) {
                return deferred.reject('Unknown user: ' + username);
            }

            bcrypt.compare(password, results[0].password, function(err, res) {
                if (err) {
                    deferred.reject('bcrypt error', err);
                    return;
                }

                if (res === false) {
                    deferred.reject('Invalid password');
                    return;
                } else {
                    var user = new User(results[0]);
                    // add in security roles
                    db.query('select name from bcs_roles inner join bcs_user_roles on bcs_roles.id = role_id where user_id = ?)', [user.id], function(err, results) {
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
        });

        return deferred.promise;
    };

    return User;
};