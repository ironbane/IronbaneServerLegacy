// editor.js - routes pertaining to the site editor role
module.exports = function(app, db) {
    app.get('/api/editor/menu', app.ensureAuthenticated, app.authorize('EDITOR'), function(req, res) {
        var Menu = require('../../entity/menu')(db);

        Menu.getAll().then(function(items) {
            res.send(items);
        }, function(err) {
            res.send(err, 500);
        });
    });
};