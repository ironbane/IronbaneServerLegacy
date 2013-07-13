// forum.js
module.exports = function(app, db) {
    var bbcode = require('bbcode');

    // list boards
    app.get('/api/forum', function(req, res) {
        var topicQ = ' (select count(*) from forum_topics where board_id = fb.id) as topicCount, ',
            postsQ = ' (select count(*) from forum_posts where topic_id in (select id from forum_topics where board_id = fb.id)) as postCount, ';

        db.query('SELECT ' + topicQ + postsQ + 'fb.*, fc.name as category FROM forum_boards fb left join forum_cats fc on fb.forumcat=fc.id order by fc.order, fb.order',
            function(err, results) {
            if (err) {
                res.end('error', err);
                return;
            }

            res.send(results);
        });
    });

    // create a new board
    app.post('/api/forum', app.ensureAuthenticated, app.authorize('EDITOR'), function(req, res) {
        var board = {
            name: req.body.name,
            forumcat: req.body.forumcat || 1,
            description: req.body.description
        };
        // todo: session auth
        db.query('insert into forum_boards set ?', board, function(err, results) {
            res.send(results);
        });
    });

    // get a single board
    app.get('/api/forum/:boardId', function(req, res) {
        db.query('select * from forum_boards where id = ?', [req.params.boardId], function(err, results) {
            if(err) {
                res.end('error', err);
                return;
            }

            if(results.length > 0) {
                res.send(results[0]);
            } else {
                res.send("no board found with id" + req.params.boardId, 404);
            }
        });
    });

    // get all topics for a board
    app.get('/api/forum/:boardId/topics', function(req, res) {
        var posts = [];

        db.query('select * from forum_topics where board_id = ?', [req.params.boardId], function(err, results) {
            if (err) {
                res.end('error', err);
                return;
            }

            if(results.length === 0) {
                res.send(posts);
                return;
            }

            // loop through topics and grab the titles of the first posts
            var topicIds = [];
            for(var i=0;i<results.length;i++) {
                topicIds.push(results[i].id);
            }

            // better with a join?
            db.query('select * from forum_posts where topic_id in (?) group by topic_id order by time', [topicIds], function(err, pResults) {
                if(err) {
                    res.end('error', err);
                    return;
                }

                // skip authors phase if there aren't any results
                if(pResults.length === 0) {
                    res.send([]);
                    return;
                }

                var authors = [];

                posts = pResults;

                posts.forEach(function(post) {
                    authors.push(post.user);
                    post.bbcontent = post.content;
                    bbcode.parse(post.content, function(html) {
                        post.content = html;
                    });
                });

                // grab author details to populate
                db.query('select * from bcs_users where id in (?)', [authors], function(err, users) {
                    if(err) {
                        res.send('error loading users: ' + err, 500);
                        return;
                    }

                    // loop through posts and nest author
                    posts.forEach(function(post) {
                        for(var i=0;i<users.length;i++) {
                            if(post.user === users[i].id) {
                                post.author = users[i];
                                // don't send password or activationkey
                                delete post.author.pass;
                                delete post.author.activationkey;
                                break;
                            }
                        }
                    });

                    res.send(posts);
                });
            });
        });
    });

    // start a new topic
    app.post('/api/forum/:boardId/topics', app.ensureAuthenticated, function(req, res) {
        db.query('insert into forum_topics set board_id = ?, time = ?', [req.params.boardId, req.body.time], function(err, topicResult) {
            if(err) {
                res.send('error creating topic', 500);
                return;
            }

            var topicId = topicResult.insertId,
                post = {
                    topic_id: topicId,
                    title: req.body.title,
                    content: req.body.bbcontent,
                    time: req.body.time,
                    user: req.body.user
                };

            db.query('insert into forum_posts set ?', post, function(err, result) {
                if(err) {
                    res.send('error creating post', 500);
                    return;
                }
                res.send(result);
            });
        });
    });

    // get all posts for topic
    app.get('/api/forum/topics/:topicId', function(req, res) {
        db.query('select * from forum_posts where topic_id = ? order by time asc', [req.params.topicId], function(err, results) {
            if(err) {
                res.end('error', err);
                return;
            }

            // skip authors phase if there aren't any results
            if(results.length === 0) {
                res.send([]); // send 404 instead?
                return;
            }

            var authors = [];

            var posts = results;

            posts.forEach(function(post) {
                authors.push(post.user);
                post.bbcontent = post.content;
                bbcode.parse(post.content, function(html) {
                    post.content = html;
                });
            });

            // grab author details to populate
            db.query('select * from bcs_users where id in (?)', [authors], function(err, users) {
                if(err) {
                    res.send('error loading users: ' + err, 500);
                    return;
                }

                // loop through posts and nest author
                posts.forEach(function(post) {
                    for(var i=0;i<users.length;i++) {
                        if(post.user === users[i].id) {
                            post.author = users[i];
                            // don't send password or activationkey
                            delete post.author.pass;
                            delete post.author.activationkey;
                            break;
                        }
                    }
                });

                res.send(posts);
            });
        });
    });

    // create a new post
    app.post('/api/forum/topics/:topicId', app.ensureAuthenticated, function(req, res) {
        var post = {
            topic_id: req.params.topicId,
            title: req.body.title,
            content: req.body.bbcontent,
            time: req.body.time,
            user: req.body.user
        };

        db.query('insert into forum_posts set ?', post, function(err, result) {
            if(err) {
                res.send('error creating post', 500);
                return;
            }
            res.send(result);
        });
    });
};