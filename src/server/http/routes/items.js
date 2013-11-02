// forum.js
module.exports = function(app, db) {
    var log = require('util').log,
        ItemTemplateService = require('../../services/itemTemplate');

    app.get('/api/editor/item_template', function(req, res) {
        //log("getting all items");
        ItemTemplateService.getAll().then(function(templates) {
            //log("trying to send templates");
            res.send(templates);
        }, function(error) {
            res.send(error, 500);
        });
    });


    app.get('/api/editor/item_template/:templateId', function(req, res) {
        //log("routing item template " + req.params.templateId);
        ItemTemplateService.getById(req.params.templateId).then(function(template) {
            //log("trying to send template");
            res.send(template);
        }, function(error) {
            res.send(error, 500);
        });
    });

};