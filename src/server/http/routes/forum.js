// forum.js
module.exports = function(app, db) {
    var bbcode = require('bbcode'),
        log = require('util').log;

    // get news (for login page...)
    app.get('/api/forum/news', function(req, res) {
        db.query('SELECT a.* from (SELECT * FROM forum_posts ORDER BY time ASC) as a, (SELECT * FROM forum_topics where board_id = 7) as b WHERE a.topic_id = b.id GROUP BY topic_id ORDER BY time DESC LIMIT 10', function(err, results) {
            if(err) {
                log('SQL error getting news: ' + err);
                res.send(500, 'Error getting news posts!');
                return;
            }

            var posts = [];
            results.forEach(function(p) {
                bbcode.parse(p.content, function(html) {
                    p.content = html;
                });
                posts.push(p);
            });

            res.send(posts);
        });
    });
};