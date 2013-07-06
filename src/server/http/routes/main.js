// main, routes not categorized nicely
var express = require('express'),
    util = require('util'),
    config = require('../../../../nconf'),
    gm = require('gm');

module.exports = function(app, db) {
    // define special routes prior to statics
    app.get('/plugins/game/images/items/big.php', function(req, res) {
        var imageId = req.query.i;

        if(!imageId) {
            res.send(500, 'missing required param i');
            return;
        }

        gm(config.get('clientDir') + 'plugins/game/images/items/' + imageId + '.png')
            .filter('point')
            .resize(40, 40)
            .write(config.get('clientDir') + 'plugins/game/images/items/' + imageId + '_big.png', function(err) {
                if(err) {
                    res.send(500, err);
                } else {
                    res.sendfile(config.get('clientDir') + 'plugins/game/images/items/' + imageId + '_big.png');
                }
            });
    });

    app.get('/plugins/game/images/items/medium.php', function(req, res) {
        var imageId = req.query.i;

        if(!imageId) {
            res.send(500, 'missing required param i');
            return;
        }
        // todo: just send converted if exists
        gm(config.get('clientDir') + 'plugins/game/images/items/' + imageId + '.png')
            .filter('point')
            .resize(24, 24)
            .write(config.get('clientDir') + 'plugins/game/images/items/' + imageId + '_medium.png', function(err) {
                if(err) {
                    res.send(500, err);
                } else {
                    res.sendfile(config.get('clientDir') + 'plugins/game/images/items/' + imageId + '_medium.png');
                }
            });
    });

    // legacy media
    app.use('/plugins', express.static(config.get('clientDir') + 'plugins'));

    app.use('/css', express.static(config.get('clientDir') + 'css'));
    app.use('/flash', express.static(config.get('clientDir') + 'flash'));
    app.use('/media', express.static(config.get('clientDir') + 'media'));
    app.use('/js', express.static(config.get('clientDir') + 'js'));
    app.use('/lib', express.static(config.get('clientDir') + 'lib'));

    app.use(app.router);
};