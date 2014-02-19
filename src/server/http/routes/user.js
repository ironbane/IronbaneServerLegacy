// user.js - routes concerning users, login, registration, etc.
module.exports = function(app, db) {
    var User = require('../../entity/user')(db),
        _ = require('underscore'),
        log = require('util').log;

    app.post('/login', function(req, res, next) {
        app.passport.authenticate('local', function(err, user, info) {
            if (err) {
                log('error auth user', err);
                return next(err);
            }
            if (!user) {
                req.session.messages = [info.message];
                return res.send(404, "Please fill in both username and password");
            }

            req.login(user, function(err) {
                if (err) {
                    log('error logging in user', err);
                    return next(err);
                }
                // send flag for UI
                user.authenticated = true;

                return res.send(user);
            });
        })(req, res, next);
    });

    app.io.route('logout', function(req) {
        // http only
        if (req.logout) {
            // how to disconnect the associated socket?
            req.logout();
        }

        if (req.io.disconnect) {
            console.log('from socket', req.io.socket);
            // req.io.disconnect();
            // can't do this yet because the client relies on connection
        }

        req.io.respond('OK');
    });

    // web logout fwd to socket
    app.get('/logout', function(req, res) {
        req.io.route('logout');
    });

    // get currently signed in user object
    app.get('/api/session/user', function(req, res) {
        if (req.user) {
            // send only needed info for UI, NOT password
            var clone = _.clone(req.user);
            delete clone.pass;
            res.send(clone);
            /*res.send({
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                roles: req.user.roles || [],
                info_birthday: req.user.info_birthday,
                info_realname: req.user.info_realname,
                info_country : req.user.info_country,
                info_location: req.user.info_location,
                info_occupation: req.user.info_occupation,
                info_interests: req.user.info_interests,
                info_website: req.user.info_website,
                show_email: req.user.show_email,
                newsletter: req.user.newsletter
            });*/
        } else {
            res.send(404, 'no user signed in');
        }
    });

    // create new user registration
    app.post('/api/user', function(req, res) {
        if (req.isAuthenticated() && req.user.admin !== 1) {
            res.send(500, "Can't register when you are signed in.");
            return;
        }

        var username = req.param('Ux466hj8'),
            password = req.param('Ed2h18Ks'),
            email = req.param('s8HO5oYe'),
            url = req.param('url');

        // todo: test the honeypot?

        User.register(username, password, email)
            .then(function(user) {
                // registration successful

                // go ahead and sign them in
                req.login(user, function(err) {
                    if (err) {
                        log('error logging in user', err);
                        return next(err);
                    }
                    // send flag for UI
                    user.authenticated = true;

                    // send only needed info for UI, NOT password
                    res.send({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        characterused: 0
                    });
                });
            }, function(err) {
                res.send(500, err);
            });
    });

    app.get('/api/profile/:username', function(req, res) {
        User.getUserByNameView(req.params.username).then(function(user) {
            res.send(user);
        }, function(error) {
            log("oops");
            res.send(error, 500);
        });

    });

    // get all friends for currently signed in user
    app.get('/api/user/friends', app.ensureAuthenticated, function(req, res) {
        req.user.$getFriends()
            .then(function(friends) {
                res.send(friends);
            }, function(err) {
                res.send(500, err);
            });
    });

    app.post('/api/user/preferences', app.ensureAuthenticated, function(req, res) {
        var updateUser = function() {
            //update the server user instance with the parameters in the req.body
            req.body.info_gender === 'male' ? req.body.info_gender = 0 : req.body.info_gender = 1;
            req.user.$update(req.body);
            //save it. 2 options:
            // 1) save is ok, server user instance is updated and returned to client
            // 2) save is not ok, server user instance is rolled back and returned to the client

            req.user.$save()
                .then(function(user) {
                    res.send(user);
                }, function(err) {
                    res.send(500, err.stack);
                });
        };

        if (req.body.password_old && req.body.password_new) {
            User.updatePassword(req.user.id, req.body.password_old, req.body.password_new)
                .then(function() {
                    updateUser();
                }, function(err) {
                    res.send(500, err.stack);
                });
        } else {
            updateUser();
        }
    });

    app.post('/api/user/:id', function(req, res) {
        User.getById(req.params.id)
            .then(function(updateUser) {
                updateUser.$adminUpdate(req.body);
                updateUser.$save()
                    .then(function(user) {
                        res.send(user);
                    }, function(error) {
                        res.send(500, error);
                    });
            });
    });

    app.post('/api/user/admin/resetpassword/:id', function(req, res) {
        User.getById(req.params.id)
            .then(function(updateUser) {

                updateUser.$adminResetPassword();
                updateUser.$save()
                    .then(function(user) {
                        res.send(user);
                    }, function(error) {
                        res.send(500, error);
                    });
            });
    });

    app.post('/api/user/avatar', app.ensureAuthenticated, function(req, res) {

    });

    // add a friend (currently signed in user!)
    app.post('/api/user/friends', app.ensureAuthenticated, function(req, res) {
        req.user.$addFriend(req.body.friendId, req.body.tags)
            .then(function(friend) {
                res.send(friend);
            }, function(err) {
                res.send(500, err);
            });
    });

    app.get('/api/users/:id', app.ensureAuthenticated, app.authorizeAny(['ADMIN', 'EDITOR']), function(req, res) {
        User.getById(req.params.id).then(function(user) {
            res.send(user);
        }, function(error) {
            res.send(error, 500);
        });
    });

    app.get('/api/users', app.ensureAuthenticated, app.authorizeAny(['ADMIN', 'EDITOR']), function(req, res) {
        User.getAll().then(function(users) {
            res.send(users);
        }, function(error) {
            res.send(error, 500);
        });
    });
};