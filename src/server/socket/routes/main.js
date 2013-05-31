// main.js
var log = require('util').log;

module.exports = function(socket, io, game) {

    // get user credentials

    // add user to various rooms
    socket.join('mods');
    socket.join('editors');

    // on joining
    game.emit('chat.announce', 'Someone has joined the game!', 'lightblue');

    socket.on('disconnect', function() {
        log('user disconnected');
    });
};