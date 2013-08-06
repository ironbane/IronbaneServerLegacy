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
                pHash = crypto.createHash('md5'),
                aHash = crypto.createHash('md5'),
                cryptSalt = config.get('cryptSalt');

            if(self.id && self.id > 0) {
                // then this is an update
                // TODO: perform update (currently update done on php site)
                deferred.resolve(self);
            } else {
                // new user
                self.reg_date = (new Date()).valueOf() / 1000;
                pHash.update(cryptSalt + self.pass);
                self.pass = pHash.digest('hex');

                aHash.update(cryptSalt + self.reg_date);
                self.activationkey = aHash.digest('hex');

                db.query('insert into bcs_users set ?', self, function(err, result) {
                    if(err) {
                        // the DB should be setup to catch duplicates, specifically call them out
                        if(err.code === 'ER_DUP_ENTRY') {
                            deferred.reject('Duplicate username or email');
                        } else {
                            log('SQL error during user save: ' + JSON.stringify(err));
                            // generic error as it trickles down to the UI
                            deferred.reject('Unknown SQL error.');
                        }
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

            var genericMessage = "Invalid username or password!";

            if (results.length < 1) {
                return deferred.reject(genericMessage);
            }

            if(results[0].banned !== 0) {
                return deferred.reject('User is banned!');
            }

            if(hashedPw !== results[0].pass) {
                deferred.reject(genericMessage);
            } else {
                var user = new User(results[0]);
                // add in security roles
                user.$initRoles();
                deferred.resolve(user);
            }
        });

        return deferred.promise;
    };

    // test if username is already taken
    User.isNameAvailable = function(name) {
        var deferred = Q.defer();

        db.query('select name from bcs_users where name=?', [name], function(err, results) {
            if(err) {
                return deferred.reject('db error ' + err);
            }

            if(results.length > 0) {
                return deferred.reject('name already taken: ' + name);
            }

            deferred.resolve();
        });

        return deferred.promise;
    };

    // criteria for valid username
    User.validateUsername = function(username) {
        var test = /^[A-Za-z0-9 _.@]*$/;

        return test.test(username) && username.length > 3 && username.length <= 20;
    };

    // criteria for valid email address
    User.validateEmail = function(email) {
        var test = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

        return test.test(email) && email.length <= 254;
    };

    // password test only works on pre-hashed
    User.validatePassword = function(password) {
        // since it gets hashed it can really be anything
        return password.length > 3 && password.length <= 254;
    };

    // register a new user
    User.register = function(username, password, email, sendEmail) {
        var deferred = Q.defer();

        // default to send registration confirmation
        if(_.isUndefined(sendEmail)) {
            sendEmail = true;
        }

        var uValid = User.validateUsername(username),
            eValid = User.validateEmail(email),
            pValid = User.validatePassword(password);

        if(!uValid) {
            deferred.reject('Username is invalid!');
        }

        if(!eValid) {
            deferred.reject('Email is invalid!');
        }

        if(!pValid) {
            deferred.reject('Password is invalid!');
        }

        if(uValid && eValid && pValid) {
            var user = new User({
                name: username,
                pass: password,
                email: email
            });

            user.$save().then(function(ref) {
                if(sendEmail) {
                    // TODO: actually send email for registration, activationkey isn't currently checked for login either.
                    // https://github.com/andris9/Nodemailer
                }

                // ref should be updated with id
                deferred.resolve(user);
            }, function(err) {
                deferred.reject(err);
            });
        }

        return deferred.promise;
    };

    return User;
};