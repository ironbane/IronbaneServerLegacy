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

        $adminUpdate: function(parameters){
            this.banned = parameters.banned;
            this.admin = parameters.admin;
            this.editor = parameters.editor;
            this.moderator = parameters.moderator;
            log(parameters);
        },

        $adminResetPassword: function(){

            var crypto = require('crypto'),
                pHash = crypto.createHash('md5'),
                cryptSalt = config.get('cryptSalt');
                 pHash.update(cryptSalt + "welcome");
            this.pass = pHash.digest('hex');

        },

        $update: function(parameters) {
            //validate
            var crypto = require('crypto'),
                pHash = crypto.createHash('md5'),
                cryptSalt = config.get('cryptSalt');
            this.email = parameters.email;
            this.info_realname = parameters.info_realname;
            this.info_country = parameters.info_country;
            this.info_location = parameters.info_location;
            this.info_birthday = parameters.info_birthday;
            this.info_occupation = parameters.info_occupation;
            this.info_interests = parameters.info_interests;
            this.info_website = parameters.info_website;
            this.show_email = parameters.show_email;
            this.newsletter = parameters.newsletter;


            pHash.update(cryptSalt + parameters.passwordnewconfirm);
            this.pass = pHash.digest('hex');

        },

        $save: function() {
            log("saving!");
            var self = this;
            var deferred = Q.defer(),
                crypto = require('crypto'),
                pHash = crypto.createHash('md5'),
                aHash = crypto.createHash('md5'),
                cryptSalt = config.get('cryptSalt');

            if (self.id && self.id > 0) {
                // then this is an update
                // TODO: perform update (currently update done on php site)
                delete self.roles;
                db.query("UPDATE bcs_users set ? where id = ?", [self,self.id], function(err, result){
                    if(err){
                        log(err);
                        log(JSON.stringify(self));
                        return deferred.reject(err);
                    }
                    return deferred.resolve(self);

                });
            } else {
                // new user
                self.reg_date = (new Date()).valueOf() / 1000;
                pHash.update(cryptSalt + self.pass);
                self.pass = pHash.digest('hex');

                aHash.update(cryptSalt + self.reg_date);
                self.activationkey = aHash.digest('hex');

                db.query('insert into bcs_users set ?', self, function(err, result) {
                    if (err) {
                        // the DB should be setup to catch duplicates, specifically call them out
                        if (err.code === 'ER_DUP_ENTRY') {
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
        // at some point using this it would be possible to define other roles in a DB table
        $initRoles: function() {
            var user = this;

            user.roles = [];
            if (user.admin === 1) {
                user.roles.push('ADMIN');
            }
            if (user.editor === 1) {
                user.roles.push('EDITOR');
            }
            if (user.moderator === 1) {
                user.roles.push('MODERATOR');
            }
        },
        $hasRole: function(role) {
            return this.roles.indexOf(role) >= 0;
        },
        // having these getters allows for additional future business logic to be added if needed
        // i.e. return this.$hasRole('ADMIN') || this.id === 1
        $isAdmin: function() {
            return this.$hasRole('ADMIN');
        },
        $isEditor: function() {
            return this.$hasRole('EDITOR');
        },
        $isModerator: function() {
            return this.$hasRole('MODERATOR');
        },
        $addFriend: function(friendId, tags) {
            var deferred = Q.defer();

            var obj = {
                user_id: this.id,
                friend_id: friendId,
                date_added: (new Date()).valueOf() / 1000
            };

            // tags should be an array
            if(tags) {
                obj.tags = JSON.stringify(tags);
            }

            db.query('insert into users_friends SET ?', obj, function(err, results) {
                if(err) {
                    deferred.reject(err);
                    return;
                }

                // modify the input for the output
                obj.id = results.insertId;

                deferred.resolve(obj);
            });

            return deferred.promise;
        },
        $removeFriend: function(friendId) {
            var deferred = Q.defer();

            db.query('delete from users_friends where user_id = ? and friend_id = ?', [this.id, friendId], function(err, results) {
                if(err) {
                    deferred.reject(err);
                    return;
                }

                deferred.resolve(results);
            });

            return deferred.promise;
        },
        $getFriends: function() {
            var deferred = Q.defer();

            db.query('select * from users_friends where user_id = ?', [this.id], function(err, friends) {
                if(err) {
                    deferred.reject(err);
                    return;
                }

                if(friends.length < 1) {
                    deferred.resolve([]);
                    return; // no friends!
                }

                db.query("select id, name from bcs_users WHERE id IN (" + _.pluck(friends, 'friend_id').join(',') + ")", function(err, results) {
                    if(err) {
                        deferred.reject(err);
                        return;
                    }

                    // todo: check some flag like "allow my friends to see my email"?
                    _.each(results, function(friend) {
                        var f = _.findWhere(friends, {friend_id: friend.id});
                        if(f) {
                            f.name = friend.name;
                        }
                    });

                    deferred.resolve(friends);
                });
            });

            return deferred.promise;
        }
    });

    User.getOnlineUsersLastDay = function() {
        var deferred = Q.defer();
        db.query('SELECT name from bcs_users WHERE last_session > ' + (Date.now() / 1000 - 86400) + ' ORDER BY last_session', function(err, results) {
            if (err) {
                deferred.reject();
                return;
            }
            deferred.resolve(results);
        });
        return deferred.promise;
    };

    User.getById = function(id) {
        var deferred = Q.defer();

        db.query('select * from bcs_users where id = ?', [id], function(err, results) {
            if (err) {
                return deferred.reject(err);

            }

            if (results.length === 0) {
                return deferred.reject("no user found");
            } else {
                //log("getting user");

                var user = new User(results[0]);
                //log(JSON.stringify(user));
                // add in security roles
                user.$initRoles();
                deferred.resolve(user);
            }
        });

        return deferred.promise;
    };

    User.getAll = function(){
        var deferred = Q.defer();
        db.query('select id, name from bcs_users', function(err, results){
            if(err){
                deferred.reject(err);
                return;
            }
            deferred.resolve(results);

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

            if (results[0].banned !== 0) {
                return deferred.reject('User is banned!');
            }

            if (hashedPw !== results[0].pass) {
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

    User.getUserByNameView = function(username) {
        var deferred = Q.defer();
        db.query("select id, name, reg_date, info_website, info_interests, info_occupation, info_birthday, info_location, info_country, info_realname, show_email, email from bcs_users where bcs_users.name = ?", [username], function(err, userview) {
            if (err) {
                deferred.reject(err);
                return;
            }
            var user = userview[0];
            db.query("SELECT COUNT(forum_posts.id) as totalpost FROM forum_posts where forum_posts.user = ?", user.id, function(err, totalpostcount){
                if (err) {
                    deferred.reject(err);
                    return;
                }
                user.totalpost = totalpostcount[0].totalpost;
                if(user.show_email===0){
                    delete user.email;
                    delete user.show_email;
                }
                deferred.resolve(user);
            });
        });
        return deferred.promise;
    };

    // test if username is already taken
    User.isNameAvailable = function(name) {
        var deferred = Q.defer();

        db.query('select name from bcs_users where name=?', [name], function(err, results) {
            if (err) {
                return deferred.reject('db error ' + err);
            }

            if (results.length > 0) {
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
        if (_.isUndefined(sendEmail)) {
            sendEmail = true;
        }

        var uValid = User.validateUsername(username),
            eValid = User.validateEmail(email),
            pValid = User.validatePassword(password);

        if (!uValid) {
            deferred.reject('Username is invalid!');
        }

        if (!eValid) {
            deferred.reject('Email is invalid!');
        }

        if (!pValid) {
            deferred.reject('Password is invalid!');
        }

        if (uValid && eValid && pValid) {
            var user = new User({
                name: username,
                pass: password,
                email: email
            });

            user.$save().then(function(ref) {
                if (sendEmail) {
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