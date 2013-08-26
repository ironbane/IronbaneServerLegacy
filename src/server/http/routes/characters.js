// characters.js
module.exports = function(app, db) {
    var Character = require('../../entity/character')(db);

    // all characters for a user
    // todo: remove 0 as there is another url
    app.get('/api/user/:userId/characters', function(req, res) {
        var userId = parseInt(req.params.userId, 10);

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
            // lock this down to only your own user (todo: allow admin)
            if(req.isAuthenticated() && req.user.id === userId) {
                Character.getAllForUser(userId).then(function(characters) {
                    res.send(characters);
                }, function(err) {
                    res.send(404, 'error loading characters for user: ' + userId);
                });
            } else {
                res.send(403, 'Cannot retreive characters that aren\'t yours');
            }
        }
    });

    app.post('/api/user/:userId/characters', app.ensureAuthenticated, function(req, res) {
        var userId = parseInt(req.params.userId, 10);

        if(req.user.id !== userId) {
            res.send(403, 'Cannot create characters for someone else!');
            return;
        }

        var character = new Character(req.body);
        character.user = userId;
        character.$create().then(function() {
            // object should be updated from DB with ID and whatever else...
            res.send(character);
        }, function(err) {
            res.send(500, err);
        });
    });

    app.get('/api/guest/characters', function(req, res) {
        if(req.isAuthenticated()) {
            res.send(500, 'You are not a guest if you are signed in!');
            return;
        }

        if(req.cookies.guestCharacterId) {
            Character.get(req.cookies.guestCharacterId).then(function(character) {
                res.send(character);
            }, function(err) {
                res.send(404, 'error loading guest character');
            });
        } else {
            // generate a new random one
            // todo: abstract guest ID from magic number?
            Character.getRandom(0).then(function(character) {
                res.cookie('guestCharacterId', character.id, { maxAge: 900000, httpOnly: false});
                res.send(character);
            }, function(err) {
                res.send(500, err);
            });
        }
    });

    app['delete']('/api/user/:userId/characters/:characterId', app.ensureAuthenticated, function(req, res) {
        // todo: allow admin to delete a user's char? (&& req.user.admin !== 1)
        var userId = parseInt(req.params.userId, 10),
            characterId = parseInt(req.params.characterId, 10);

        if(req.user.id !== userId) {
            res.send(403, 'Cannot delete another user\'s character!');
            return;
        }

        Character.get(characterId)
            .then(function(character) {
                // double check character and user match
                if(character.user === userId) {
                    character.$delete().then(function() {
                        res.send('OK');
                    }, function(err) {
                        res.send(500, 'error deleting character! ' + err);
                    });
                } else {
                    res.send(403, 'Cannot delete another user\'s character!');
                }
            }, function(err) {
                if(err === 'not found') {
                    res.send(404, err);
                } else {
                    res.send(500, err);
                }
            });
    });

    // FRIENDSHIP API

    app.get('/api/user/:userId/characters/:characterId/friends', app.ensureAuthenticated, function(req, res) {
        var userId = parseInt(req.params.userId, 10),
            characterId = parseInt(req.params.characterId, 10);

        if(req.user.id !== userId && !req.user.$isAdmin()) {
            res.send(403, 'You do not own this character!');
            return;
        }

        Character.get(characterId)
            .then(function(character) {
                // double check character and user match
                if(character.user === userId || req.user.$isAdmin()) {
                    character.$getFriends().then(function(friends) {
                        res.send(friends);
                    }, function(err) {
                        res.send(500, err);
                    });
                } else {
                    res.send(403, 'You do not own this character!');
                }
            }, function(err) {
                if(err === 'not found') {
                    res.send(404, err);
                } else {
                    res.send(500, err);
                }
            });
    });
};