// world.js - for now combo routes with terrain, meshes, zones, etc.
module.exports = function(app, db) {

    var Zone = require('../../entity/zone')(db);

    app.get('/api/zone', function(req, res) {
        Zone.getAll()
            .then(function(zones) {
                res.send(zones);
            }, function(err) {
                res.send(err, 500);
            });
    });

};