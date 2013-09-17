// user.js - routes concerning users, login, registration, etc.
module.exports = function(app, db) {
    var User = require('../../entity/user')(db),
        log = require('util').log,
        _ = require('underscore');

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
        if(req.logout) {
            // how to disconnect the associated socket?
            req.logout();
        }

        if(req.io.disconnect) {
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
        if(req.user) {
            // send only needed info for UI, NOT password
            res.send({
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                roles: req.user.roles || [],
                birthday: req.user.info_birthday
            });
        } else {
            res.send(404, 'no user signed in');
        }
    });

    // create new user registration
    app.post('/api/user', function(req, res) {
        if(req.isAuthenticated() && req.user.admin !== 1) {
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
        }, function(error){
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
        log("received: " + JSON.stringify(req.body));
        log("user: " + JSON.stringify(req.user));

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

    app.get('/api/users', function(req, res){
        User.getAll().then(function(users){
            res.send(users);
        }, function(error){
            res.send(error, 500);
        });
    });
};