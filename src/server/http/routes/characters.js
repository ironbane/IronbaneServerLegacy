// characters.js
module.exports = function(app, db) {
    // get a character by ID
    app.get('/api/characters/:characterId', function(req, res) {
        db.query('select * from ib_characters where id=?', [req.params.characterId], function(err, results) {
            if (err) {
                res.end('error', err);
                return;
            }

            res.send(results);
        });
    });

    // all characters for a user
    app.get('/api/user/:userId/characters', function(req, res) {
        db.query('select * from ib_characters where user=?', [req.params.userId], function(err, results) {
            if (err) {
                res.end('error', err);
                return;
            }

            res.send(results);
        });
    });
};