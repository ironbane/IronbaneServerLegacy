// main, routes not categorized nicely
var express = require('express');

module.exports = function(app, db) {
    app.use('/css', express.static('deploy/web/css'));
    app.use('/images', express.static('deploy/web/images'));
    app.use('/js', express.static('deploy/web/js'));
    app.use('/lib', express.static('deploy/web/lib'));

    app.get('/', function(req, res) {
        res.sendfile('deploy/web/index.html');
    });

    app.get('/views/:view', function(req, res) {
        // allow us to omit the file extension...
        var file = req.params.view;
        if(file.search('.html') < 0) {
            file += '.html';
        }
        res.sendfile('deploy/web/views/' + file);
    });
};