// menu.js
module.exports = function(app, db) {

    var menu = require('../../entity/menu')(db);
	 app.get('/api/menu/main', function(req, res) {
        
       menu.getAll()
            .then(function(menuitems) {
                res.send(menuitems);
            }, function(err) {
                res.send(err, 500);
            });
    });
}