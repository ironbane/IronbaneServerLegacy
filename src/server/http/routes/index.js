// index.js
module.exports = function(app, db) {
    var config = require('../../../../nconf');

    require('./main')(app, db);
    require('./user')(app, db);
    require('./characters')(app, db);

    // temp stuff for index until a better spot is thought
    var zones = {},
        zoneSelection = {};

    db.query('select * from ib_zones', [], function(err, results) {
        if(err) {
            log('error loading zone data' + err);
            return;
        }

        results.forEach(function(zone) {
            zones[zone.id] = {
                id: zone.id,
                name: zone.name,
                type: zone.type
            };
            zoneSelection[zone.name] = zone.id;
        });
    });

    // catchall - no 404 as angular will handle
    app.use(function(req, res) {
        // add in all of the stuff that was from game.php
        res.locals = {
            zones: JSON.stringify(zones),
            zoneSelection: JSON.stringify(zoneSelection)
        };

        res.render('index');
    });
};