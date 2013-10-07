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

var commands = {
  "giveitem": {
    requiresEditor: true,
    action: function(unit, realparams, errorMessage) {
      // So, which item?
      var template = -1;

      // Try to convert to integer, if we passed an ID
      var testConvert = parseInt(realparams[0], 10);
      if (_.isNumber(testConvert) && !_.isNaN(testConvert)) {
          template = dataHandler.items[testConvert];
      } else {
          template = _.where(dataHandler.items, {
              name: realparams[0]
          })[0];
      }

      if (template) {
          if (!unit.GiveItem(template)) {
              errorMessage = 'You have no free space!';
          }
      } else {
          errorMessage = "Item not found!";
      }

      return {
        errorMessage: errorMessage
      };
    }
  },
  "givecoins": {
    requiresEditor: true,
    action: function(unit, realparams, errorMessage) {
            // find a "cash" item
            var moneybag = _.where(dataHandler.items, {type: 'cash'})[0],
                amount = parseInt(realparams[0], 10);
            if(moneybag) {
                if(!unit.GiveItem(moneybag, {value: amount})) {
                    errorMessage = 'You have no free space!';
                }
            } else {
                errorMessage = 'no cash items found!';
            }
            return {
              errorMessage: errorMessage
            };
    }
  },
  "check": {
    requiresEditor: true,
    action: function(unit, realparams, errorMessage) {

      // Check the server for errors!

      // First check for NPC's without nodes

      var errors = "";
      worldHandler.LoopUnits(function(unit) {
        if ( unit.id < 0 ) {

          // Check for empty nodes
          if ( unit.connectedNodeList && !unit.connectedNodeList.length ) {
            errors += "Warning: no nodes found for NPC "+
              Math.abs(unit.id)+" at "+unit.DebugLocationString()+"!<br>";
          }

          // Check for bad cells
          if ( !worldHandler.CheckWorldStructure(unit.zone, unit.cellX, unit.cellZ) ) {
            errors += "Warning: unexisting cell found for NPC "+
              Math.abs(unit.id)+" at "+unit.DebugLocationString()+"!<br>";
          }

          // Check for bad loot
          if ( !_.isEmpty(unit.template.loot) ) {
            var lootSplit = unit.template.loot.split(";");
            for(var l=0;l<lootSplit.length;l++) {
              var item = null;

              // No percentages for vendors!
              if ( unit.template.type === UnitTypeEnum.VENDOR ) {
                   item = parseInt(lootSplit[l], 10);
              }
              else {
                  var chanceSplit = lootSplit[l].split(":");

                  if ( WasLucky100(parseInt(chanceSplit[0], 10)) ) {
                      item = parseInt(chanceSplit[1], 10);
                  }
              }

              if ( item ) {
                if ( _.isUndefined(dataHandler.items[item]) ) {
                    errors += "Warning: item "+item+" not found for loot in NPC "+unit.id+"!<br>";
                }
              }
            }
          }

        }
      });

      if ( errors ) {
        errorMessage = "Following errors were found:<br>"+errors;
      }
      else {
        feedback += "No errors found!";
      }
      return {
        errorMessage: errorMessage
      };
    }
  },
  "announce": {
    requiresEditor: true,
    action: function(unit, realparams, errorMessage) {
            var color = realparams[1];

            chatHandler.Announce(realparams[0], color);

            return {
              errorMessage: errorMessage
            };
    }
  },
  "warn": {
    requiresEditor: true,
    action: function(unit, realparams, errorMessage) {
            var target = worldHandler.FindPlayerByName(realparams[0]);
            if (target) target.LightWarn();
            return {
              errorMessage: errorMessage
            };
    }
  },
  "seriouswarn": {
    requiresEditor: true,
    action: function(unit, realparams, errorMessage) {
        var target = worldHandler.FindPlayerByName(realparams[0]);
        if (target) target.SeriousWarn();
        return {
          errorMessage: errorMessage
        };
    }
  },
  "kick": {
    requiresEditor: true,
    action: function(unit, realparams, errorMessage) {
      var target = worldHandler.FindPlayerByName(realparams[0]);
      if (target) target.Kick(realparams[1]);
      return {
        errorMessage: errorMessage
      };
    }
  },
  "ban": {
    requiresEditor: true,
    action: function(unit, realparams, errorMessage) {
      var target = worldHandler.FindPlayerByName(realparams[0]);
      if (target) target.Ban(realparams[1], realparams[2]);
      return {
        errorMessage: errorMessage
      };
    }
  },
  "help": {
    // Should be a hudhandler message in the future. Good enough for now
    requiresEditor: false,
    action: function(unit, realparams, errorMessage) {
      var message = "MOVE (W,A,S,D)<br>STRAFE (Q,E)<br>Walk slower, turn faster (shift)<br>Attack (right mouse click)<br>CHAT (enter)<br>If you get stuck (/stuck in chatbox)";
      chatHandler.AnnouncePersonally(unit, message, "yellow");
      return {
        errorMessage: errorMessage
      };
    }
  },
  "stuck": {
    requiresEditor: false,
    action: function(unit, realparams, errorMessage) {
      unit.Teleport(normalSpawnZone, normalSpawnPosition);
      chatHandler.AnnouncePersonally(unit, "You were teleported back to town.", "lightgreen");
      return {
        errorMessage: errorMessage
      };
    }
  },
  "unstuck": {
    requiresEditor: true,
    action: function(unit, realparams, errorMessage) {
      var target = worldHandler.FindPlayerByName(realparams[0]);
      if (target) {
        target.Teleport(normalSpawnZone, normalSpawnPosition);
        chatHandler.AnnouncePersonally(target, "You were teleported back to town.", "lightgreen");
      } else {
        chatHandler.AnnouncePersonally(unit, "Playername " + realparams[0] + " not found", "red");
      }
      return {
        errorMessage: errorMessage
      };
    }
  }
};

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

      if ( commands[command] &&
        ((!commands[command].requiresEditor && !unit.editor) || unit.editor ) ) {
        var result = commands[command].action(unit, realparams, errorMessage);
        errorMessage = result.errorMessage;
      }
      else {
        errorMessage = "That command does not exist!";
      }


      if (errorMessage) {
        feedback += "<br>" + errorMessage;
      }

      if (showFeedback) {
        this.AnnouncePersonally(unit, feedback, errorMessage ? "red" : "#01ff46");
      }
    }
    else {

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
  DiedSpecial: function(unit, cause) {

      log(unit.name + ' was killed by ' + cause);

      var messageData = {
          type: 'diedspecial',
          cause: cause,
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
