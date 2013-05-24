// user.js - routes concerning users, login, registration, etc.
module.exports = function(app, db) {
    var User = require('../entity/user')(db);

    app.post('/login', function(req, res, next) {
        app.passport.authenticate('local', function(err, user, info) {
            if (err) {
                util.log('error auth user', err);
                return next(err);
            }
            if (!user) {
                req.session.messages = [info.message];
                return res.send(info, 404);
            }
            req.logIn(user, function(err) {
                if (err) {
                    util.log('error logging in user', err);
                    return next(err);
                }
                // send flag for UI
                user.authenticated = true;
                return res.send(user);
            });
        })(req, res, next);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // get currently signed in user object
    app.get('/api/session/user', function(req, res) {
        if(req.user) {
            res.send(req.user);
        } else {
            res.send('no user signed in', 404);
        }
    });

    // create new user registration
    app.post('/api/user', function(req, res) {
        var newUser = new User(req.body);
        newUser.$save()
            .then(function(user) {
                res.send(user);
            }, function(err) {
                res.send(err, 500);
            });
    });
};