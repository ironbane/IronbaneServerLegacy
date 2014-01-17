// discussions.js
module.exports = function(app, db) {
    var log = require('util').log,
        DiscussionService = require('../../services/discussion');

    app.get('/api/discussion/threads', function(req, res) {
        //log("getting all items");
        DiscussionService.getByThread().then(function(threads) {
            res.send(threads);
        }, function(error) {
            res.send(error, 500);
        });
    });

    // create a new item template, editor only function
    app.post('/api/discussion/threads', app.ensureAuthenticated, function(req, res) {
        var data = {
            subject: req.body.subject,
            body: req.body.body,
            author_id: req.body.author_id,
            tags: req.body.tags
        };

        DiscussionService.createThread(data.subject, data.body, data.author_id, data.tags)
            .then(function(post) {
                res.send(post);
            }, function(err) {
                res.send(500, err);
            });
    });

};