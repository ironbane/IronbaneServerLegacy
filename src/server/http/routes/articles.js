// article.js - dynamic web pages, stored in markdown
var util = require('util');

module.exports = function(app, db) {
    var Article = require('../../entity/article')(db);

    // get a list of articles, minus content
    app.get('/api/article', app.ensureAuthenticated, app.authorizeAny(['ADMIN', 'EDITOR']), function(req, res) {
        Article.get({
            $fields: ['articleId', 'title', 'author', 'created', 'views']
        }).then(function(articles) {
            res.send(articles);
        }, function(err) {
            res.send(500, err);
        });
    });

    // create article
    app.post('/api/article', app.ensureAuthenticated, app.authorizeAny(['ADMIN', 'EDITOR']), function(req, res) {
        Article.create(req.body).then(function(article) {
            // send back the completed details
            res.send(article);
        }, function(err) {
            res.send(500, err);
        });
    });

    // update article
    app.post('/api/article/:articleId', app.ensureAuthenticated, app.authorizeAny(['ADMIN', 'EDITOR']), function(req, res) {
        Article.get(req.params.articleId)
            .then(function(article) {
                //console.log("article get: ", article.articleId);
                article.update({
                    title: req.body.title,
                    body: req.body.body,
                    articleId: req.params.articleId
                }).then(function(updatedarticle) {
                    //console.log("article update: ", updatedarticle.articleId);
                    res.send(updatedarticle);
                }, function(error) {
                    //console.log("article update fail: ", err);
                    res.send(500, error);
                });
            }, function(err) {
                //console.log("article get fail: ", err);
                res.send(500, err);
            });
    });

    // get specific article (public view)
    app.get('/api/article/:articleId', function(req, res) {
        var rendered = req.query.rendered === "false" ? false : true;

        Article.get(req.params.articleId, rendered)
            .then(function(article) {
                res.send(article);
            }, function(err) {
                if (err.code === 404) {
                    res.send(err.code, err.msg);
                } else {
                    // unknown server error
                    res.send(500, err);
                }
            });
    });
};