// forum.js
module.exports = function(app, db) {
    var log = require('util').log,
        _ = require('underscore'),
        Forum = require('../../entity/forum')(db),
        Board = require('../../entity/board')(db),
        User = require('../../entity/user')(db),
        Topic = require('../../entity/topic')(db),
        Article = require('../../entity/article')(db),
        Post = require('../../entity/post')(db),
        bbcode = require('bbcode'),
        winston = require('../../logging/winston');

    app.get('/api/forum', function(req, res) {
        Forum.getForumView().then(function(forum) {
            res.send(forum);
        }, function(error) {
            res.send(error, 500);
        });
    });

    app.post('/api/forum/likepost', function(req, res){
        log(req.body);
        Post.like(req.body.postId, req.user.id)
            .then(function(response){
                res.send(response);
            }, function(error){
                res.send(error, 500);
            });
    });

    // create a new board
    app.post('/api/forum', function(req, res) {
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

    app.get('/api/onlineusers', function(req, res) {
        User.getOnlineUsersLastDay().then(function(users) {
            res.send(users);
        }, function(error) {
            res.send(error, 500);
        });
    });

    app.get('/api/frontpage', function(req, res) {
        Article.getFrontPage().then(function(frontpage) {
            res.send(frontpage);
        }, function(error) {
            res.send(error, 500);
        });
    });

    app.get('/api/statistics', function(req, res) {
        Forum.getStatistics().then(function(statistics) {
            res.send(statistics);
        }, function(error) {
            res.send(error, 500);
        });
    });

    // get all recent topics
    app.get('/api/forum/recent', function(req, res) {
        Board.getRecent().then(function(results) {
            res.send(results);
        }, function(error) {
            res.send(error, 500);
        });
    });

    // get a single board
    app.get('/api/forum/:boardId', function(req, res) {
        Board.get(req.params.boardId).then(function(results) {
            log('getting board: ' + req.params.boardId);
            res.send(results);
        }, function(error) {
            res.send(error, 500);
        });
    });

    // get all topics for a board
    app.get('/api/forum/:boardId/topics', function(req, res) {
        if (req.params.boardId === "news") {
            Forum.getFrontPage().then(function(results) {
                res.send(results);
            }, function(error) {
                res.send(error, 500);
            });
        } else {
            Board.getView(req.params.boardId).then(function(results) {
                res.send(results);
            }, function(error) {
                res.send(error, 500);
            });
        }
    });

    // start a new topic
    app.post('/api/forum/:boardId/topics', function(req, res) {
        var post = {
            boardId: req.params.boardId,
            title: req.body.title,
            content: req.body.content,
            user: req.user.id
        };

        Topic.newPost(post)
            .then(function(posttime) {
                Board.getView(req.params.boardId, posttime).then(function(done){
                res.send(done);
            }, function(error){
                log(error);
                res.send(500, error);
            });
            }, function(err) {
                res.send(500, err);
            });

    });

    app.post('/api/forum/topics/:topicId/unlock', function(req, res) {
        Topic.unlock(req.params.topicId).then(function(result) {
            res.send(result);
       }, function(err) {
        res.send(500, err);
       });
    });

    app.post('/api/forum/topics/:topicId/lock', function(req, res) {
        Topic.lock(req.params.topicId).then(function(result) {
            res.send(result);
       }, function(err) {
        res.send(500, err);
       });
    });

    app.post('/api/forum/topics/:topicId/unsticky', function(req, res) {
        Topic.unsticky(req.params.topicId).then(function(result) {
            res.send(result);
       }, function(err) {
        res.send(500, err);
       });
    });

    app.post('/api/forum/topics/:topicId/sticky', function(req, res) {
        Topic.sticky(req.params.topicId).then(function(result) {
            res.send(result);
       }, function(err) {
        res.send(500, err);
       });
    });

    app.post('/api/forum/topics/:topicId/delete', function(req, res) {
        Topic.delete(req.params.topicId).then(function(result) {
            res.send(result);
        }).fail(function(err) {
            res.send(500, err);
        });
    });

    // get all posts for topic
    app.get('/api/forum/topics/:topicId/posts', function(req, res) {
        Topic.getPostsView(req.params.topicId).then(function(results) {
            res.send(results);
        }, function(error) {
            res.send(500, error);
        });
    });

    app.get('/api/forum/topics/:topicId', function(req, res) {
        Topic.get(req.params.topicId).then(function(results) {
            res.send(results);
        }, function(error) {
            res.send(500, error);
        });
    });

    // create a new post
    app.post('/api/forum/topics/:topicId', function(req, res) {
        log("making new post");
        var post = new Post({
            topic_id: req.params.topicId,
            content: req.body.content,
            user: req.user.id
        });

        post.$save().then(function(result) {
            // before sending back to the client, we need to parse the bbcode
            // this should prolly be done in Post entity? or static method?
            bbcode.parse(result.content, function(html) {
                result.content = html;
            });
            Topic.getPostsView(result.topic_id, result.time).then(function(done){
                res.send(done);
            }, function(error){
                log(error);
                res.send(500, error);
            });
        }, function(error){
            log(error);
            res.send(500, error);
        });
    });
};