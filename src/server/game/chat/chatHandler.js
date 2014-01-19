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
module.exports = function(units, worldHandler) {
    var Class = require('../../../common/class'),
        sanitize = require('validator').sanitize,
        _ = require('underscore'),
        log = require('util').log,
        ironbot = require(APP_ROOT_PATH + '/src/server/game/ironbot/ironbot');

    var ChatHandler = Class.extend({
        init: function(io) {
            this.commands = require('./commands')(units, worldHandler, this);
            // needs reference to socket stuff for now
            this.io = io;
        },
        // was "Say", now /say is a command instead
        processInput: function(unit, message) {
            var self = this,
                command,
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

            if (params.length === 1) {
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
            if (commandOpener === '@') {
                command = 'say';
                target = realparams.shift();
            } else {
                command = realparams.shift();
                // for the case of say, if we use /say, then if we want to target a room use : , like: /say:zone_1 hey what's up or /say:"leeroy jenkins" don't attack!
                if (command.indexOf(':') >= 0) {
                    var cmdparts = command.split(':');
                    command = cmdparts[0];
                    if (cmdparts[1] !== '') {
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
            var color = "#01ff46";

            if (this.commands[command] && ((!this.commands[command].requiresEditor && !unit.editor) || unit.editor)) {
                this.commands[command].action(unit, target, realparams).then(function() {
                    // success
                }, function(err) {
                    self.announcePersonally(unit, err, 'red');
                });
            } else {
                errorMessage = "That command does not exist!";
            }

            if (errorMessage && errorMessage.length > 0) {
                feedback += "<br>" + errorMessage;
                color = "#FF0000";
            } else if (commandOpener === '@') {
                feedback = '@' + target + ' >> ' + message;
                color = "#FFF";
            } else {
                // let's only show feedback if there is an error
                showFeedback = false;
            }

            if (showFeedback) {
                this.announcePersonally(unit, feedback, color);
            }
        },
        say: function(unit, message, room) {
            var messageType = room ? ('say:' + room) : 'say';

            if (!unit.editor) {
                message = sanitize(message).entityEncode();
            }

            // Void if message is empty
            if (!message) {
                return;
            }

            // Send message through ironbot
            var ironbot = require(APP_ROOT_PATH + '/src/server/game/ironbot/ironbot');
            var filterMessage = ironbot.filterBadwords(unit, message);
            message = filterMessage.message;
            if (filterMessage.status !== "clean") {
                switch (filterMessage.status) {
                    case 'lightwarn':

                        // Send lightwarn
                        worldHandler.FindPlayerByName(unit.name)
                            .then(function(player) { 
                                if (player) {
                                    player.LightWarn();
                                }
                            });

                        break;

                    case 'warn':
                        // Send serious warn
                        worldHandler.FindPlayerByName(unit.name)
                           .then(function(player) { 
                               if (player) {
                                   player.SeriousWarn();
                               }
                           });
                        break;

                    case 'kick':
                        // Send kick
                        worldHandler.FindPlayerByName(unit.name)
                           .then(function(player) { 
                               if (player) {
                                   player.Kick('Untolerated behaviour');
                               }
                           });
                        break;

                    default:
                        // Nothing
                        break;
                }
            }

            // only echo this if to global?
            if (!room) {
                unit.Say(message);
            }

            var messageData = {
                type: messageType,
                user: unit.getNameAndRank(),
                message: message
            };

            if (room) {
                this.io.sockets. in (room).emit('chatMessage', messageData);
            } else {
                this.io.sockets.emit("chatMessage", messageData);
            }

	    // Get NPC response
	    if((npc = ironbot.detectNPChat(unit, message)) !== false) {
		this.announce(ironbot.getNPCMessage(npc), '#b8b8b8');
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
                user: unit.getNameAndRank()
            };

            this.io.sockets.emit("chatMessage", messageData);
        },
        announceDied: function(unit, killer) {
            var killerName = killer.id > 0 ? killer.name : killer.template.prefix + ' ' + killer.template.name;

            log(unit.name + ' was killed by ' + killerName);

            var messageData = {
                type: 'died',
                killer: killer.getNameAndRank(),
                victim: unit.getNameAndRank()
            };

            this.io.sockets.emit("chatMessage", messageData);
        },
        announceDiedSpecial: function(unit, cause) {
            log(unit.name + ' was killed by ' + cause);

            var messageData = {
                type: 'diedspecial',
                cause: cause,
                victim: unit.getNameAndRank()
            };

            this.io.sockets.emit("chatMessage", messageData);
        },
        listRooms: function() {
            var rooms = this.io.sockets.manager.rooms,
                names = _.keys(rooms);

            names = _.without(names, '');

            names = _.map(names, function(name) {
                return name.substr(1); // remove '/' prefix as it's not needed by us
            });

            return names;
        },
        // list the rooms that a specific player is a member of
        listRoomsPlayer: function(unit) {
            var rooms = this.io.sockets.manager.roomClients[unit.socket.id],
                names = _.keys(rooms);

            names = _.without(names, '');

            names = _.map(names, function(name) {
                return name.substr(1); // remove '/' prefix as it's not needed by us
            });

            return names;
        },
        listPlayers: function(room) {
            // list users in room
            var clients = this.io.sockets.clients(room);
            var names = _.map(clients, function(client) {
                return client.unit ? client.unit.name : null;
            });

            return _.without(names, null);
        }
    });

    return ChatHandler;
};
