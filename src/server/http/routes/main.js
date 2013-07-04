// main, routes not categorized nicely
var express = require('express'),
    util = require('util'),
    config = require('../../../../nconf');

module.exports = function(app, db) {
    app.use('/css', express.static(config.get('clientDir') + 'css'));
    app.use('/flash', express.static(config.get('clientDir') + 'flash'));
    app.use('/media', express.static(config.get('clientDir') + 'media'));
    app.use('/js', express.static(config.get('clientDir') + 'js'));
    app.use('/lib', express.static(config.get('clientDir') + 'lib'));

    app.use(app.router);
};