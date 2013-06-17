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

var ChatHandler = Class.extend({
  GetChatColor: function(unit) {

    //        switch(unit.editor) {
    //            case 0:
    //                return "#1beee7";
    //                break;
    //            case 1:
    //                return "#e21bee";
    //                break;
    //        }
    if ( unit.editor ) return "#e21bee";

    return "#1beee7";
  },
  Say: function(unit, message) {
    if (message.substr(0, 1) === "/") {
      var params = message.split(/(".*?")/);

      var realparams = [];
      for (var p = 0; p < params.length; p++) {
        var param = params[p];

        param = param.trim();

        if (param === '') continue;


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

      // feedback += "Command "+command+"<br>";

      if (unit.editor) {
        switch (command) {
          case "giveitem":

            // So, which item?
            var template = -1;

            // Try to convert to integer, if we passed an ID
            var testConvert = parseInt(realparams[0], 10);

            // It appears we passed a string
            if (_.isNaN(testConvert)) {
              testConvert = realparams[0];
              // Must be a string, truey again!
              _.each(dataHandler.items, function(item) {
                if (item.name.indexOf(testConvert) !== -1) {
                  // Found!
                  template = item.id;
                }
              });

            } else {
              if (dataHandler.items[testConvert]) {
                template = testConvert;
              }
            }

            if (template === -1) {
              errorMessage = "Item not found!";
              break;
            }

            log("template ID: " + template);

            template = dataHandler.items[template];

            // Find a free slot
            var slot = -1;

            // Loop over 10 slots, and check if we have an item that matches that
            // slot
            for (var i = 0; i < 10; i++) {
              var found = false;

              _.each(unit.items, function(item) {
                if (item.slot === i) found = true;
              });

              if (!found) {
                slot = i;
                break;
              }

            }

            if (slot === -1) {
              errorMessage = "You have no free space!";
              break;
            }

            unit.GiveItem(template);

            break;
          case "givecoins":

            unit.coins += parseInt(realparams[0], 10);
            unit.socket.emit("setCoins", unit.coins);

            break;
          case "announce":
            var color = realparams[1];

            this.Announce(realparams[0], color);

            break;
          case "warn":
            var target = worldHandler.FindPlayerByName(realparams[0]);
            if (target) target.LightWarn();
            break;
          case "seriouswarn":
            var target = worldHandler.FindPlayerByName(realparams[0]);
            if (target) target.SeriousWarn();
            break;
          case "kick":
            var target = worldHandler.FindPlayerByName(realparams[0]);
            if (target) target.Kick(realparams[1]);
            break;
          case "ban":
            var target = worldHandler.FindPlayerByName(realparams[0]);
            if (target) target.Ban(realparams[1], realparams[2]);
            break;
          default:
            errorMessage = "That command does not exist!";
            break;
        }
      }

      if (errorMessage) {
        feedback += "<br>" + errorMessage;
      }

      if (showFeedback) {
        this.AnnouncePersonally(unit, feedback, errorMessage ? "red" : "#01ff46");
      }

    } else {

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

      io.sockets.emit("chatMessage", messageData);
    }
  },
  Announce: function(message, color) {
      log("[Announce] " + message);

      color = color || "#ffd800";

      var messageData = {
          type: 'announce',
          message: {
              color: color,
              text: message
          }
      };

      io.sockets.emit("chatMessage", messageData);
  },
  AnnounceMods: function(message, color) {
      log("[AnnounceMods] " + message);

      color = color || "#ffd800";
      var messageData = {
          type: 'announce:mods',
          message: {
              color: color,
              text: message
          }
      };
      var clients = io.sockets.clients();

      for (var c = 0; c < clients.length; c++) {
          if (clients[c].unit && clients[c].unit.editor) {
              clients[c].emit("chatMessage", messageData);
          }
      }
  },
  AnnounceNick: function(message, color) {
      // Log it just in case
      log("[AnnounceNick] " + message);

      color = color || "#ffd800";
      var nick;
      var clients = io.sockets.clients();
      for (var c = 0; c < clients.length; c++) {
          if (clients[c].unit && clients[c].unit.playerID === 1) {
              nick = clients[c].unit;
          }
      }

      if(!nick) {
          log("[AnnounceNick] Nick's not here man.");
          return;
      }

      this.AnnouncePersonally(nick, message, color);
  },
  AnnouncePersonally: function(unit, message, color) {
      var messageData = {
          type: 'announce:personal',
          message: {
              color: color,
              text: message
          }
      };

      unit.socket.emit("chatMessage", messageData);
  },
  JoinGame: function(unit) {
      var messageData = {
          type: 'join',
          user: {
              name: unit.name,
              rank: unit.editor ? 'gm' : 'user'
          }
      };

      io.sockets.emit("chatMessage", messageData);
  },
  Died: function(unit, killer) {
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
      io.sockets.emit("chatMessage", messageData);
  },
  LeaveGame: function(unit) {
      var messageData = {
          type: 'leave',
          user: {
              name: unit.name,
              rank: unit.editor ? 'gm' : 'user'
          }
      };

      io.sockets.emit("chatMessage", messageData);
  }
});

var chatHandler = new ChatHandler();
