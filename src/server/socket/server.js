// server.js - socket server object
var Class = require('../../common/class');

var Server = Class.extend({
    init: function(httpServer) {
        if(!httpServer) {
            throw "fatal, must supply http server";
        }

        // the socket server requries an http server to init
        this.io = require('socket.io').listen(httpServer);

        this.io.sockets.on('connection', function (socket) {
            socket.emit('news', {hello: 'world'});

            require('./routes')(socket);
        });
    }
});

exports.Server = Server;