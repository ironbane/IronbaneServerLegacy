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
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var ChatHandler = Class.extend({
  Init: function() {

  },
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

    log(unit.name + ': '+message);


    if ( unit.editor && message.substr(0,1) == "/") {


      var params = message.split(/(".*?")/);

      var realparams = [];
      for(var p=0;p<params.length;p++) {
        var param = params[p];

        param = param.trim();

        if ( param === '' ) continue;


        if ( param.indexOf('"') === 0 ) {
          realparams = realparams.concat([param.replace(/\"/g, '')]);
        }
        else {
          realparams = realparams.concat(param.split(' '));
        }

      }

      var command = realparams[0].substr(1);

      realparams.shift();

      var feedback = "("+unit.name+") "+message+"";
      var errorMessage = "";

      var showFeedback = true;

      // feedback += "Command "+command+"<br>";

      switch(command) {
        case "giveitem":

          // So, which item?
          var template = -1;

          // Try to convert to integer, if we passed an ID
          var testConvert = parseInt(realparams[0], 10);



          // It appears we passed a string
          if ( _.isNaN(testConvert) ) {
            testConvert = realparams[0];
            // Must be a string, truey again!
            _.each(dataHandler.items, function(item) {
              if ( item.name.indexOf(testConvert) != -1 ) {
                  // Found!
                  template = item.id;
              }
            });

          }
          else {
            if ( dataHandler.items[testConvert] ) {
              template = testConvert;
            }
          }

          if ( template === -1 ) {
            errorMessage = "Item not found!";
            break;
          }

          console.log("template ID: "+template);

          template = dataHandler.items[template];

          // Find a free slot
          var slot = -1;

          // Loop over 10 slots, and check if we have an item that matches that
          // slot
          for (var i = 0; i < 10; i++) {
            var found = false;

            _.each(unit.items, function(item) {
              if ( item.slot === i ) found = true;
            });

            if ( !found ) {
              slot = i;
              break;
            }

          }


          if ( slot === -1 ) {
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

          showFeedback = false;

          this.Announce(realparams[0]);

          break;
        default:
          errorMessage = "That command does not exist!";
          break;
      }

      if ( errorMessage ) {
        feedback += "<br>"+errorMessage;
      }

      if ( showFeedback ) {
        this.AnnounceMods(feedback, errorMessage ? "red" : "#01ff46");
      }

    }
    else {

      //unit.EmitNearby("say", {id:unit.id,message:message}, 0, true);
      unit.Say(message);

      message = '<div style="display:inline;color:'+this.GetChatColor(unit)+'">&lt;'+unit.name + '&gt;</div> ' +message;

      io.sockets.emit("chatMessage", {
        message: message
      });

    }


  },
  Announce: function(message, color) {
    color = color || "#ffd800";
    message = '<div style="display:inline;color:'+color+'">'+message+'</div>';
    io.sockets.emit("chatMessage", {
      message: message
    });
  },
  AnnounceMods: function(message, color) {
    color = color || "#ffd800";
    message = '<div style="display:inline;color:'+color+'">'+message+'</div>';
    var clients = io.sockets.clients();

    for(var c=0;c<clients.length;c++){
      if ( clients[c].unit && clients[c].unit.editor ) {
        clients[c].emit("chatMessage", {
          message: message
        });
      }
    }
  },
  AnnouncePersonally: function(unit, message, color) {
    color = color || "#ffd800";
    message = '<div style="display:inline;color:'+color+'">'+message+'</div>';
    unit.socket.emit("chatMessage", {
      message: message
    });
  },
  JoinGame: function(unit) {

    var message = '<div style="display:inline;color:'+this.GetChatColor(unit)+'">'+unit.name + '</div> has joined the game!';

    io.sockets.emit("chatMessage", {
      message: message
    });
  },
  Died: function(unit, killer) {
    log(unit.name + ' was killed by '+(killer.id > 0 ? killer.name : killer.template.prefix+" "+killer.template.name));

    var killername = killer.id > 0 ? '<div style="display:inline;color:'+this.GetChatColor(killer)+'">'+killer.name + '</div>' : killer.template.prefix+" "+killer.template.name;
    var word = ChooseRandom(("slaughtered butchered crushed defeated destroyed exterminated finished massacred mutilated slayed vanquished killed").split(" "));

    var message = '<div style="display:inline;color:'+this.GetChatColor(unit)+'">'+unit.name + '</div> was '+word+' by '+killername+'.';

    io.sockets.emit("chatMessage", {
      message: message
    });
  },
  LeaveGame: function(unit) {
    var message = '<div style="display:inline;color:'+this.GetChatColor(unit)+'">'+unit.name + '</div> has left the game. ';

    io.sockets.emit("chatMessage", {
      message: message
    });
  }
});

var chatHandler = new ChatHandler();
