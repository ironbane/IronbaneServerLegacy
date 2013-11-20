// forum.js
module.exports = function(app, db) {
    var log = require('util').log,
        ItemTemplateService = require('../../services/itemTemplate');

    app.get('/api/item_templates', function(req, res) {
        //log("getting all items");
        ItemTemplateService.getAll().then(function(templates) {
            //log("trying to send templates");
            res.send(templates);
        }, function(error) {
            res.send(error, 500);
        });
    });

    app.get('/api/item_templates/:templateId', function(req, res) {
        //log("routing item template " + req.params.templateId);
        ItemTemplateService.getById(req.params.templateId).then(function(template) {
            //log("trying to send template");
            res.send(template);
        }, function(error) {
            res.send(error, 500);
        });
    });

    // create a new item template, editor only function
    app.post('/api/item_templates', app.ensureAuthenticated, app.authorize('EDITOR'), function(req, res) {
        ItemTemplateService.create(req.body).then(function(template) {
            res.send(template);
        }, function(err) {
            res.send(500, err);
        });
    });

};