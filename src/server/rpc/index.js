// index.js
module.exports = function(socket, db) {
    require('./main')(socket, db);

    // temp...
    socket.on('disconnect', function() {
        // something...
    });
};