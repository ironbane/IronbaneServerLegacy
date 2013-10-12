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
module.exports = function(items, units, worldHandler) {
    var Class = require('../../../common/class'),
        sanitize = require('validator').sanitize,
        _ = require('underscore'),
        log = require('util').log;

    var ChatHandler = Class.extend({
        init: function(io) {
            this.commands = require('./commands')(items, units, worldHandler, this);
            // needs reference to socket stuff for now
            this.io = io;
        },
        // was "Say", now /say is a command instead
        processInput: function(unit, message) {
            var command,
                target,
                commandOpener = message.substr(0, 1);

            if (commandOpener !== '/' && commandOpener !== '@') {
                console.warn('Unsupported direct input to ChatMessage by: ', unit.name, ' >> ', message);
                return;
            }

            // strip off the commandOpener now we have it
            message = message.substr(1);

            var params = message.split(/(".*?")/),
                realparams = [];

            if(params.length === 1) {
                // there are no quoted params, so just do space delim
                realparams = message.split(' ');
            } else {
                // there are one or more quoted params, gather them up
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
            }

            // commands starting with @ are assumed to be of type SAY as that is normal "chat" type behavior
            if(commandOpener === '@') {
                command = 'say';
                target = realparams.shift();
            } else {
                command = realparams.shift();
                // for the case of say, if we use /say, then if we want to target a room use : , like: /say:zone_1 hey what's up or /say:"leeroy jenkins" don't attack!
                if(command.indexOf(':') >= 0) {
                    var cmdparts = command.split(':');
                    command = cmdparts[0];
                    if(cmdparts[1] !== '') {
                        // non quoted string target
                        target = cmdparts[1];
                    } else {
                        // target was quoted, will be next param
                        target = realparams.shift();
                    }
                }
            }

            var feedback = "(" + unit.name + ") " + message + "";
            var errorMessage = "";
            var showFeedback = true;

            if (this.commands[command] && ((!this.commands[command].requiresEditor && !unit.editor) || unit.editor)) {
                var result = this.commands[command].action(unit, target, realparams, errorMessage);
                errorMessage = result.errorMessage;
            } else {
                errorMessage = "That command does not exist!";
            }

            if (errorMessage && errorMessage.length > 0) {
                feedback += "<br>" + errorMessage;
            } else {
                // let's only show feedback if there is an error
                showFeedback = false;
            }

            if (showFeedback) {
                this.announcePersonally(unit, feedback, errorMessage ? "red" : "#01ff46");
            }
        },
        say: function(unit, message, room) {
            var messageType = room ? ('say:' + room) : 'say';

            if (!unit.editor) {
                message = sanitize(message).entityEncode();
            }

            // only echo this if to global?
            if(!room) {
                unit.Say(message);
            }

            var messageData = {
                type: messageType,
                user: {
                    name: unit.name,
                    rank: unit.editor ? 'gm' : 'user'
                },
                message: message
            };

            if(room) {
                this.io.sockets.in(room).emit('chatMessage', messageData);
            } else {
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
        },
        listRooms: function() {
            var rooms = this.io.sockets.manager.rooms,
                names = _.keys(rooms);

            names = _.map(names, function(name) {
                return name.substr(1); // remove '/' prefix as it's not needed by us
            });

            return names;
        },
        listPlayers: function(room) {
            // list users in room
            var clients = this.io.sockets.clients(room);
            var names = _.map(clients, function(client) {
                return client.unit.name;
            });

            return names;
        }
    });

    return ChatHandler;
};
