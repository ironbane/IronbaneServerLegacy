// menu.js
module.exports = function(app, db) {

    var Menu = require('../../entity/menu')(db);

    app.get('/api/menu/main', function(req, res) {

        Menu.getAll()
            .then(function(menuitems) {
                res.send(menuitems);
            }, function(err) {
                res.send(err, 500);
            });
    });
};