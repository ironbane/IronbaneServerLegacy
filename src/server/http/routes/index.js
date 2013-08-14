// index.js
module.exports = function(app, db) {
    var config = require('../../../../nconf'),
        log = require('util').log,
        fs = require('fs');

    require('./main')(app, db);
    require('./user')(app, db);
    require('./characters')(app, db);
    require('./books')(app, db);
    require('./forum')(app, db);
    require('./articles')(app, db);

    // temp stuff for index until a better spot is thought
    var zones = {},
        zoneSelection = {},
        items = {},
        units = {},
        unitTemplates = {},
        preCatsTiles = [],
        preMeshes = {
            0: {
                id: 0,
                name: "ERROR",
                filename: "modelerror.obj",
                scale: 1.00,
                t1: "tiles/402"
            }
        },
        modelEnum = {};

    db.query('select * from ib_item_templates', [], function(err, results) {
        if (err) {
            log('error loading item template data' + err);
            return;
        }

        results.forEach(function(row) {
            items[row.id] = {
                id: row.id,
                name: row.name,
                type: row.type,
                image: row.image,
                delay: row.delay,
                attr1: row.attr1,
                particle: row.particle,
                subtype: row.subtype,
                baseValue: row.basevalue
            };
        });
    });

    db.query('SELECT * FROM ib_zones', [], function(err, results) {
        if (err) {
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

    db.query('SELECT id, name, type, health, armor, param, size, special, weaponoffsetmultiplier, friendly FROM ib_unit_templates', [], function(err, results) {
        if (err) {
            log('error loading unit template data' + err);
            return;
        }

        results.forEach(function(row) {
            units[row.id] = row;
            unitTemplates[row.name] = row.id;
        });
    });

    db.query('SELECT * FROM ib_meshes ORDER BY category, name', [], function(err, results) {
        if (err) {
            log('error loading mesh data' + err);
            return;
        }

        results.forEach(function(row) {
            preMeshes[row.id] = row;
            modelEnum[row.category + ': ' + row.name] = row.id;
        });
    });

    db.query('select * from ib_editor_cats', [], function(err, results) {
        if (err) {
            log('error loading the cats, meow ' + err);
            return;
        }

        results.forEach(function(row) {
            preCatsTiles.push({
                name: row.name,
                range: row.range,
                limit_x: row.limit_x
            });
        });
    });

    // load shader file
    var shaderFile = "";
    fs.readFile('src/client/game/shaders.html', function(err, contents) {
        if (err) {
            log('error loading shaders ' + err);
            return;
        }

        shaderFile = contents;
    });

    app.get(['/game', '/game/*'], function(req, res) {
        // add in all of the stuff that was from game.php
        res.locals = {
            zones: JSON.stringify(zones),
            zoneSelection: JSON.stringify(zoneSelection),
            items: JSON.stringify(items),
            units: JSON.stringify(units),
            unitTemplates: JSON.stringify(unitTemplates),
            preCatsTiles: JSON.stringify(preCatsTiles),
            preMeshes: JSON.stringify(preMeshes),
            modelEnum: JSON.stringify(modelEnum),
            shaders: shaderFile,
            userId: req.user ? req.user.id : 0,
            username: req.user ? req.user.name : '',
            loggedIn: req.isAuthenticated(),
            characterUsed: req.user ? req.user.characterused : 0
        };

        // todo: use config for subfolder
        res.render('game/index');
    });

    // templates for website
    app.get(['/views/*', '/partials/*'], function(req, res) {
        log('requesting web template: ' + req.path);
        res.render('web' + req.path);
    });

    // catchall - no 404 as angular will handle
    app.use(function(req, res) {
        // todo: use config for subfolder
        log('no server route (web index redirect): ' + req.path);
        res.render('web/index');
    });
};