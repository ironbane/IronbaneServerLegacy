// index.js
module.exports = function(app, db) {
    _ = require('underscore');

    var requireDir = require('require-dir');
var dir = requireDir('./');
    _.each(dir, function(tFile) {
        tFile(app, db);
    });
    

    // special routing to make game a separate app
    app.get('/game/*', function(req, res) {
        res.sendfile('deploy/web/game/index.html');
    });

    // catchall - no 404 as angular will handle
    app.use(function(req, res) {
        res.sendfile('deploy/web/index.html');
    });
};