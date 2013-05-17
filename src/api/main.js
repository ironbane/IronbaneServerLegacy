// main, routes not categorized nicely
var express = require('express');

module.exports = function(app, db) {
    app.use('/css', express.static('deploy/web/css'));
    app.use('/images', express.static('deploy/web/images'));
    app.use('/js', express.static('deploy/web/js'));
    app.use('/lib', express.static('deploy/web/lib'));

    app.use(app.router);

    app.post('/login', function(req, res, next) {
        app.passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.session.messages = [info.message];
                return res.send(req.session.messages);
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
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
        res.send(req.user);
    });

    // create new user registration
    app.post('/api/user', function(req, res) {
        var bcrypt = require('bcrypt-nodejs');
        var user = {
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password),
            email: req.body.email
        };

        db.query('insert into bcs_users set ?', user, function(err, result) {
            if(err) {
                res.send(err, 500);
                return;
            }

            res.send(result);
        });
    });

    app.get('/views/:view', function(req, res) {
        // allow us to omit the file extension...
        var file = req.params.view;
        if(file.search('.html') < 0) {
            file += '.html';
        }
        res.sendfile('deploy/web/views/' + file);
    });

    // Simple route middleware to ensure user is authenticated.
    //   Use this route middleware on any resource that needs to be protected.  If
    //   the request is authenticated (typically via a persistent login session),
    //   the request will proceed.  Otherwise, the user will be redirected to the
    //   login page.
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    }
};