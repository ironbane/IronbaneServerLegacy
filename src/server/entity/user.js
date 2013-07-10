// user.js - backend user entity / service
var Class = require('../../common/class'),
    config = require('../../../nconf'),
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
            var deferred = Q.defer(),
                crypto = require('crypto'),
                shasum = crypto.createHash('md5'),
                cryptSalt = config.get('cryptSalt');

            if(self.id && self.id > 0) {
                // then this is an update
                // TODO: perform update (currently update done on php site)
                deferred.resolve(self);
            } else {
                // new user
                self.reg_date = (new Date()).valueOf() / 1000;
                shasum.update(cryptSalt + self.pass);
                self.pass = shasum.digest('hex');

                // TODO: make sure that DB has email and name as unique index

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
        },
        $initRoles: function() {
            var user = this;

            user.roles = [];
            if(user.admin === 1) {
                user.roles.push('ADMIN');
            }
            if(user.editor === 1) {
                user.roles.push('EDITOR');
            }
            if(user.moderator === 1) {
                user.roles.push('MODERATOR');
            }
        }
    });

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
                var user = new User(results[0]);
                // add in security roles
                user.$initRoles();
                deferred.resolve(user);
            }
        });

        return deferred.promise;
    };

    // used for the login process
    User.authenticate = function(username, password) {
        var deferred = Q.defer(),
            crypto = require('crypto'),
            shasum = crypto.createHash('md5'),
            cryptSalt = config.get('cryptSalt');

        shasum.update(cryptSalt + password);
        var hashedPw = shasum.digest('hex');

        db.query('select * from bcs_users where name = ?', [username], function(err, results) {
            if (err) {
                return deferred.reject(err);
            }

            if (results.length < 1) {
                deferred.reject('Unknown user: ' + username);
            }

            if(hashedPw !== results[0].pass) {
                deferred.reject('invalid password!');
            } else {
                var user = new User(results[0]);
                // add in security roles
                user.$initRoles();
                deferred.resolve(user);
            }
        });

        return deferred.promise;
    };

    return User;
};