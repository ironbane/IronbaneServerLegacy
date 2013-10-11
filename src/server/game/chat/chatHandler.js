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
var Class = require('../../../common/class');

var ChatHandler = Class.extend({
    commands: [],
    init: function(io) {
        // needs reference to socket stuff for now
        this.io = io;
    },
    // was "Say", now /say is a command instead
    processInput: function(unit, message) {
        if (message.substr(0, 1) === "/") {
            var params = message.split(/(".*?")/);

            var realparams = [];
            for (var p = 0; p < params.length; p++) {
                var param = params[p].trim();

                if (param === '') {
                    continue;
                }

                if (param.indexOf('"') === 0) {
                    realparams = realparams.concat([param.replace(/\"/g, '')]);
                } else {
                    realparams = realparams.concat(param.split(' '));
                }
            }

            var command = realparams[0].substr(1);
            realparams.shift();

            var feedback = "(" + unit.name + ") " + message + "";
            var errorMessage = "";
            var showFeedback = true;

            if (this.commands[command] && ((!this.commands[command].requiresEditor && !unit.editor) || unit.editor)) {
                var result = this.commands[command].action(unit, realparams, errorMessage);
                errorMessage = result.errorMessage;
            } else {
                errorMessage = "That command does not exist!";
            }

            if (errorMessage) {
                feedback += "<br>" + errorMessage;
            }

            if (showFeedback) {
                this.announcePersonally(unit, feedback, errorMessage ? "red" : "#01ff46");
            }
        } else {
            // todo: move this to "say" command
            if (!unit.editor) {
                message = sanitize(message).entityEncode();
            }

            //unit.EmitNearby("say", {id:unit.id,message:message}, 0, true);
            unit.Say(message);

            var messageData = {
                type: 'say',
                user: {
                    name: unit.name,
                    rank: unit.editor ? 'gm' : 'user'
                },
                message: message
            };

            this.io.sockets.emit("chatMessage", messageData);
        }
    },
    announce: function(message, color) {
        log("[Announce] " + message);

        color = color || "#ffd800";

        var messageData = {
            type: 'announce',
            message: {
                color: color,
                text: message
            }
        };

        this.io.sockets.emit("chatMessage", messageData);
    },
    announceRoom: function(room, message, color) {
        log("[AnnounceRoom:" + room + "] " + message);

        color = color || "#ffd800";
        var messageData = {
            type: 'announce:' + room,
            message: {
                color: color,
                text: message
            }
        };

        this.io.sockets['in'](room).emit('chatMessage', messageData);
    },
    announcePersonally: function(unit, message, color) {
        var messageData = {
            type: 'announce:personal',
            message: {
                color: color,
                text: message
            }
        };

        unit.socket.emit("chatMessage", messageData);
    },
    // current UI supported statuses are join & leave
    announceLoginStatus: function(unit, status) {
        status = status || 'join';

        var messageData = {
            type: status,
            user: {
                name: unit.name,
                rank: unit.editor ? 'gm' : 'user'
            }
        };

        this.io.sockets.emit("chatMessage", messageData);
    },
    announceDied: function(unit, killer) {
        var killerName = killer.id > 0 ? killer.name : killer.template.prefix + ' ' + killer.template.name;

        log(unit.name + ' was killed by ' + killerName);

        var messageData = {
            type: 'died',
            killer: {
                name: killerName,
                rank: killer.id > 0 ? (killer.editor ? 'gm' : 'user') : 'npc'
            },
            victim: {
                name: unit.name,
                rank: unit.editor ? 'gm' : 'user'
            }
        };

        this.io.sockets.emit("chatMessage", messageData);
    },
    announceDiedSpecial: function(unit, cause) {
        log(unit.name + ' was killed by ' + cause);

        var messageData = {
            type: 'diedspecial',
            cause: cause,
            victim: {
                name: unit.name,
                rank: unit.editor ? 'gm' : 'user'
            }
        };

        this.io.sockets.emit("chatMessage", messageData);
    }
});

module.exports = ChatHandler;