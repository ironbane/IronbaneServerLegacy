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

    };