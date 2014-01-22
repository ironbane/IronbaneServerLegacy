// index.js
module.exports = function(app, db) {
    var config = require('../../../../nconf'),
        Q = require('q'),
        _ = require('underscore'),
        log = require('util').log,
        fs = require('fs');

    require('./main')(app, db);
    require('./user')(app, db);
    require('./characters')(app, db);
    require('./books')(app, db);
    require('./forum')(app, db);
    require('./articles')(app, db);
    require('./items')(app, db);
    require('./units')(app, db);
    require('./messages')(app, db);
    require('./discussions')(app, db);

    if (config.get('github').enabled) {
        require('./github')(app);
    }

    // temp stuff for index until a better spot is thought
    var gameModel = {
        zones: {},
        zoneSelection: {},
        items: {},
        units: {},
        unitTemplates: {},
        preMeshes: {
            0: {
                id: 0,
                name: "ERROR",
                filename: "modelerror.obj",
                scale: 1.00,
                t1: "tiles/402"
            }
        },
        modelEnum: {},
        shaderFile: '',
        isProduction: false
    };

    // some async badassery
    var getGameModel = function() {
        var tasks = [],
            Zone = require('../../entity/zone')(db),
            UnitTemplate = require('../../entity/unitTemplate')(db),
            ItemTemplateService = require('../../services/itemTemplate'),
            Mesh = require('../../entity/mesh')(db);

        tasks.push(Zone.getAll().then(function(zones) {
            _.each(zones, function(zone) {
                gameModel.zones[zone.id] = {
                    id: zone.id,
                    name: zone.name,
                    type: zone.type
                };
                gameModel.zoneSelection[zone.name] = zone.id;
            });

            return zones;
        }, function(err) {
            return Q.reject(err);
        }));

        tasks.push(UnitTemplate.get({
            $fields: ['id', 'name', 'type', 'health', 'armor', 'param', 'size', 'special', 'weaponoffsetmultiplier', 'friendly']
        }).then(function(templates) {
            _.each(templates, function(t) {
                gameModel.units[t.id] = t;
                gameModel.unitTemplates[t.name] = t.id;
            });

            return templates;
        }, function(err) {
            return Q.reject(err);
        }));

        tasks.push(ItemTemplateService.getAll().then(function(templates) {
            // front end is expecting a map
            // there's prolly an underscore method for this
            _.each(templates, function(t) {
                gameModel.items[t.id] = t;
            });

            return templates;
        }, function(err) {
            return Q.reject(err);
        }));

        tasks.push(Mesh.get({
            $orderBy: ['category', 'name']
        }).then(function(meshes) {
            _.each(meshes, function(mesh) {
                gameModel.preMeshes[mesh.id] = mesh;
                gameModel.modelEnum[mesh.category + ': ' + mesh.name] = mesh.id;
            });

            return meshes;
        }, function(err) {
            return Q.reject(err);
        }));

        tasks.push(Q.nfcall(fs.readFile, 'src/client/game/shaders.html', 'utf-8').then(function(contents) {
            gameModel.shaderFile = contents;
            return contents;
        }, function(err) {
            return Q.reject('error loading sharder file', err);
        }));

        return Q.all(tasks);
    };

    // templates for game (HUD)
    app.get('/game/templates/*', function(req, res) {
        var path = require('path');
        log('requesting game template: ' + path.basename(req.path));
        res.render('game/templates/' + path.basename(req.path));
    });

    var gameCallBack = function(req, res) {
        getGameModel().then(function(stuff) {
            // add in all of the stuff that was from game.php
            res.locals = {
                zones: JSON.stringify(gameModel.zones),
                zoneSelection: JSON.stringify(gameModel.zoneSelection),
                items: JSON.stringify(gameModel.items),
                units: JSON.stringify(gameModel.units),
                unitTemplates: JSON.stringify(gameModel.unitTemplates),
                preMeshes: JSON.stringify(gameModel.preMeshes),
                modelEnum: JSON.stringify(gameModel.modelEnum),
                shaders: gameModel.shaderFile,
                userId: req.user ? req.user.id : 0,
                username: req.user ? req.user.name : '',
                loggedIn: req.isAuthenticated(),
                isProduction: config.get('isProduction')
            };

            res.render('game/index');
        }, function(err) {
            res.send(500, err);
        });
    };

    var websiteCallback = function(req, res) {
        log('requesting web template: ' + req.path);
        res.render('web' + req.path);
    };

    app.get('/game*', gameCallBack);
    // app.get('/game/*', gameCallBack);

    // templates for website
    app.get('/views/*', websiteCallback);
    app.get('/partials/*', websiteCallback);

    // catchall - no 404 as angular will handle
    app.use(function(req, res) {
        var path = require('path');
        // if we are requesting a specific resource it is likely an image or something, don't do angular
        if (path.extname(req.path) !== '') {
            res.send(404);
            return;
        }

        // todo: use config for subfolder
        log('no server route (web index redirect): ' + req.path);

        res.locals = {
            log_level: config.get('log_level')
        };
        res.render('web/index');
    });
};