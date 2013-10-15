var _ = require('underscore');
module.exports = function(socketlistener) {
    return {
         action: function(data, reply, socket){
                if (!_.isFunction(reply)) {
                    log('backToMainMenu no callback defined!');
                    return;
                }
                if (socket.unit) {
                    if (socket.unit.health <= 0) {
                        reply({
                            errmsg: "Please wait until you respawn!"
                        });
                        return;
                    }
                    socketHandler.onlinePlayers = _.without(socketHandler.onlinePlayers, _.find(socketHandler.onlinePlayers, function(p) {
                        return p.id === socket.unit.id;
                    }));
                    socket.unit.LeaveGame();
                    reply("OK");

                    log(socket.unit.name + " is back at the Main Menu.");
                }

                socket.unit = null;
            }
        };
    };