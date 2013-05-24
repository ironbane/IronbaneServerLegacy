// main, routes not categorized nicely
var express = require('express'),
    util = require('util');

module.exports = function(app, db) {
    app.use('/game', express.static('deploy/game'));
    app.use('/css', express.static('deploy/web/css'));
    app.use('/font', express.static('deploy/web/font'));
    app.use('/images', express.static('deploy/web/images'));
    app.use('/js', express.static('deploy/web/js'));
    app.use('/lib', express.static('deploy/web/lib'));

    app.use(app.router);

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
        var bcrypt = require('bcrypt-nodejs');
        var user = {
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password),
            email: req.body.email,
            reg_date: (new Date()).valueOf() / 1000
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

    app.get('/partials/:view', function(req, res) {
        // allow us to omit the file extension...
        var file = req.params.view;
        if(file.search('.html') < 0) {
            file += '.html';
        }
        res.sendfile('deploy/web/partials/' + file);
    });
};