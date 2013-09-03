// forum.js
module.exports = function(app, db) {
    var log = require('util').log,
    _ = require('underscore'),
    ItemTemplate = require('../../entity/itemTemplate')(db);
       

        app.get('/api/editor/item_template', function(req, res) {
            log("getting all items");
            ItemTemplate.getAll().then(function(templates) {
                log("trying to send templates");
                res.send(templates);
            }, function(error){
                res.send(error, 500);
            });
        });


        app.get('/api/editor/item_template/:templateId', function(req, res) {
            log("routing item template " + req.params.templateId);
            ItemTemplate.get(req.params.templateId).then(function(template) {
                log("trying to send template");
                res.send(template);
            }, function(error){
                res.send(error, 500);
            });
        });

    };