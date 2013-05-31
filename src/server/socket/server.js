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
    init: function(settings) {
        var server = this;

        if(!settings.httpServer) {
            throw "fatal, must supply http server";
        }

        if(!settings.game) {
            // the socket server requries the game so that the game server can run independant of it
            // for future if we want to also use straight tcp sockets in addition to web sockets (chrome or native app)
            throw "fatal, socket server requires game";
        }

        log('starting websocket server...');

        var db = require('mysql').createConnection({
            user: config.get('mysql_user'),
            password: config.get('mysql_password'),
            database: config.get('mysql_database')
            //insecureAuth:false
        });

        var params = {
            log: 0,
            'close timeout': 86400,
            'heartbeat timeout': 86400,
            'heartbeat interval': 86400,
            'polling duration': 86400
        };

        // the socket server requries an http server to init
        server.io = require('socket.io').listen(settings.httpServer, params);

        server.io.sockets.on('connection', function (socket) {
            require('./routes')(socket, server.io, settings.game, db);
        });
    }
});

exports.Server = Server;