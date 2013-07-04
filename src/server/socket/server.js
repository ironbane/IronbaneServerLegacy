// server.js - socket server object
/*
    This file is part of Ironbane MMO.

    Ironbane MMO is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Ironbane MMO is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Ironbane MMO.  If not, see <http://www.gnu.org/licenses/>.
*/
var config = require('../../../nconf'),
    Class = require('../../common/class'),
    log = require('util').log; // built in timestampped logger

var Server = Class.extend({
    init: function(httpServer, game, db) {
        var server = this;

        if(!httpServer) {
            throw "fatal, must supply http server";
        }

        if(!game) {
            // the socket server requries the game so that the game server can run independent of it
            // for future if we want to also use straight tcp sockets in addition to web sockets (chrome or native app)
            throw "fatal, socket server requires game";
        }

        log('starting websocket server...');

        var isProduction = config.get('isProduction');
        var params = {
            log: 0,
            'close timeout': isProduction ? (60 * 3) : 86400,
            'heartbeat timeout': isProduction ? (60 * 3) : 86400,
            'heartbeat interval': isProduction ? (20 * 3) : 86400,
            'polling duration': isProduction ? (25 * 3) : 86400
        };

        // the socket server requries an http server to init
        server.io = require('socket.io').listen(httpServer, params);

        server.io.sockets.on('connection', function (socket) {
            require('./routes')(socket, server.io, game, db);
        });
    }
});

exports.Server = Server;