// main.js
var log = require('util').log;

module.exports = function(socket) {
    socket.on('disconnect', function() {
        log('user disconnected');
    });
};