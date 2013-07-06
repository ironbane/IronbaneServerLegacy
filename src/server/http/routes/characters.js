// characters.js
module.exports = function(app, db) {
    var Character = require('../../entity/character')(db);

    // all characters for a user
    app.get('/api/user/:userId/characters', function(req, res) {
        var userId = parseInt(req.params.userId, 10),
            chars = [];

        if(userId === 0) {
            // guest
            if(req.cookies.guestCharacterId) {
                Character.get(req.cookies.guestCharacterId).then(function(character) {
                    res.send([character]);
                }, function(err) {
                    res.send(404, 'error loading guest character');
                });
            } else {
                res.send([]);
            }
        } else {
            Character.getAllForUser(userId).then(function(characters) {
                res.send(characters);
            }, function(err) {
                res.send(404, 'error loading characters for user: ' + userId);
            });
        }
    });
};