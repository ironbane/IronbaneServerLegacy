// forum.js
module.exports = function(app, db) {
    // list boards
    app.get('/api/forum', function(req, res) {
        db.query('select * from forum_boards', function(err, results) {
            if (err) {
                res.end('error', err);
                return;
            }

            res.send(results);
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

    // get all topics for a board
    app.get('/api/forum/:boardId', function(req, res) {
        db.query('select * from forum_topics where board_id = ?', [req.params.boardId], function(err, results) {
            if (err) {
                res.end('error', err);
                return;
            }

            // loop through topics and grab the titles of the first posts
            var topicIds = [];
            for(var i=0;i<results.length;i++) {
                topicIds.push(results[i].id);
            }

            // better with a join?
            db.query('select * from forum_posts where topic_id in (?) group by topic_id order by time', [topicIds], function(err, posts) {
                if(err) {
                    res.end('error', err);
                    return;
                }

                // should add in any of the topic data? or not needed
                res.send(posts);
            });
        });
    });

    // start a new topic
    app.post('/api/forum/:boardId', function(req, res) {

    });

    // get all posts for topic
    app.get('/api/forum/:boardId/:topicId', function(req, res) {

    });

    // create a new post
    app.post('/api/forum/:boardId/:topicId', function(req, res) {
        var post = {
            title: req.body.title,
            topic_id: req.params.topicId,
            content: req.body.content,
            time: (new Date()).valueOf() / 1000, // convert to seconds for mysql's unix_timestamp
            user: 1 // todo: session user
        };

        // todo: auto topic creation?

        db.query('insert into forum_posts set ?', post, function(err, results) {
            res.send(results);
        });
    });
};