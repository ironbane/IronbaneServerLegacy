// article.js - dynamic web pages, stored in markdown
var util = require('util'),
    marked = require('marked');

module.exports = function(app, db) {
    // get a list of articles, minus content
    app.get('/api/article', app.ensureAuthenticated, app.authorize('EDITOR'), function(req, res) {
        db.query('select articleId, title, author, created, views from bcs_articles', function(err, results) {
            if(err) {
                res.send(err, 500);
                return;
            }

            res.send(results);
        });
    });

    // create article
    app.post('/api/article', app.ensureAuthenticated, app.authorizeAny(['ADMIN', 'EDITOR']), function(req, res) {
        db.query('insert into bcs_articles set ?', req.body, function(err, result) {
            if(err) {
                res.send(err, 500);
                return;
            }

            res.send(result);
        });
    });

    // get specific article (public view)
    app.get('/api/article/:articleId', function(req, res) {
        db.query('select * from bcs_articles where articleId = ?', [req.params.articleId], function(err, result) {
            if(err) {
                res.send(err, 500);
                return;
            }

            if(result.length === 0) {
                res.send('no article found with id ' + req.params.articleId, 404);
                return;
            }

            // found it, return the json
            var article = result[0];
            // convert body into html
            article.body = marked(article.body);
            // convert dates to JS
            article.created *= 1000;

            if(article.author === 0) {
                // system author
                article.authorName = 'Ironbane';
                res.send(article);
            } else {
                // grab author name from db
                db.query("select username from bcs_users where id = ?", [article.author], function(err, result) {
                    if(err || result.length === 0) {
                        util.log('article - error getting user data!');
                        article.authorName = 'Unknown';
                    } else {
                        article.authorName = result;
                    }

                    // now send the article to client
                    res.send(article);
                });
            }
        });
    });

    // update existing article

    // delete article

    // mark article viewed? do we care, or just use GA?
};