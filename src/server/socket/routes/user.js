// user.js
module.exports = function(socket, io, game, db) {
    var User = require('../../entity/user')(db);

    socket.on('connectServer', function(data, reply) {
        User.authenticate(data.username, data.password)
            .then(function(user) {
                socket.set('user', user);
                reply(user);
            }, function(err) {
                reply({code: 403, errmsg: 'failed authentication'});
            });
    });
};