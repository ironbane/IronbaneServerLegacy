// chat.js
module.exports = function(socket, io, game) {

    // incoming from client
    socket.on('chatMessage', function(data) {
        game.emit('unit.say', socket.unit, data.message);
    });

    socket.on('privateMessage', function(data) {
        socket.get('unit', function(err, unit) {
            // each connection should be joined to a username room
            io.sockets.in(data.name).emit('chatMessage', {message: data.message, from: unit.name});
        });
    });

    // watch game to request an announcement
    game.on('chat.announce', function(message, color, room) {
        color = color || "#ffd800";
        // the UI should handle the markup and styling instead...
        var out = '<p style="color:' + color + '">' + (room ? (room + ': ') : '') + message + '</p>';

        if(!room) {
            io.sockets.emit('chatMessage', {message: out});
        } else {
            io.sockets.in(room).emit('chatMessage', {message: out});
        }
    });

};