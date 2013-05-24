// characters.js
module.exports = function(app, db) {
    // get a list of all characters for a particular user
    app.get('/api/character/:userId', function(req, res) {
        db.query('select * from ib_characters where user=?', [req.params.userId], function(err, results) {
            if (err) {
                res.end('error', err);
                return;
            }

            res.send(results);
        });
    });
};