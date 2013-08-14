
module.exports = function(app, db) {
    var Book = require('../../entity/book')(db),
        log = require('util').log;

    // get a list of articles, minus content
    app.get('/api/books/:bookId', function(req, res) {
        var bookId = req.params.bookId;

        Book.get(bookId).then(function(data) {
            res.send(data);
        }, function(err) {
            if(err === 'Book not found.') {
                res.send(404, err);
            } else {
                res.send(500, err);
            }
        });
    });

};