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