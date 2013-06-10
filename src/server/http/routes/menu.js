// forum.js
module.exports = function(app, db) {

	 app.get('/api/menu/main', function(req, res) {
        
       
        db.query('SELECT * FROM bcs_menu',
            function(err, results) {
            if (err) {
                res.end('error', err);
                return;
            }

            res.send(results);
        });
    });
}