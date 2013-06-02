// user.js
module.exports = function(socket, io, game, db) {
    var User = require('../../entity/user')(db);

    socket.on('connectServer', function(data, reply) {
        //todo: guest account

        User.authenticate(data.username, data.password)
            .then(function(user) {
                socket.set('user', user);

                // add user to various rooms
                if(user.roles.indexOf('EDITOR') >= 0) {
                    socket.join('editors');
                }
                if(user.roles.indexOf('ADMIN') >= 0) {
                    socket.join('mods');
                }

                // join room of own name for private messaging
                socket.join(user.username);

                // on joining
                game.emit('chat.announce', user.username + ' has joined the game!', 'lightblue');

                reply(user);
            }, function(err) {
                reply({code: 403, errmsg: 'failed authentication'});
            });
    });
};