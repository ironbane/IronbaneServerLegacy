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
                return res.send(404, info);
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

    app.get('/logout', function(req, res) {
        // todo: set last_session on user table? (still needed?)
        req.logout();
        res.send('OK');
    });

    // get currently signed in user object
    app.get('/api/session/user', function(req, res) {
        if(req.user) {
            // send only needed info for UI, NOT password
            res.send({
                id: user.id,
                name: user.name,
                email: user.email,
                characterused: user.characterused || 0,
                roles: user.roles || []
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
};