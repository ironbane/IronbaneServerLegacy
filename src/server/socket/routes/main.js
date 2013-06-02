// main.js
var log = require('util').log;

module.exports = function(socket, io, game) {
    socket.on('disconnect', function() {
        log('user disconnected');
    });
};