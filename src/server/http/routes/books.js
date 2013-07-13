
module.exports = function(app, db) {
    var log = require('util').log;

    // get a list of articles, minus content
    app.get('/api/books/:bookId', function(req, res) {
        var bookId = req.params.bookId;

        db.query('select * from ib_books where id=?', [bookId], function(err, results) {
            if(err) {
                log('SQL error getting book: ' + bookId + ' >> ' + err);
                res.send(500, 'Error getting book.');
                return;
            }

            if(results.length === 0) {
                res.send(404, 'Book not found.');
            }

            res.send(results[0]);
        });
    });

};