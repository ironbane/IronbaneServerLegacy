var _ = require('underscore');
module.exports = function(socketlistener) {
    return {
         action: function(bool, socket){
            if ( !socket.unit ) return;

                if ( !_.isBoolean(bool) ) return;

                if ( socket.unit ) {
                    socket.unit.readyToReceiveUnits = bool;
                    socket.unit.UpdateOtherUnitsList();

                    if ( bool ) {
                        // Check for new players
                        var currentTime = parseInt((new Date()).getTime()/1000.0, 10);

                        if ( socket.unit.zone === 1
                            && currentTime < socket.unit.creationtime + 1000
                            && !socket.unit.hasSeenStartCutscene ) {
                            socket.unit.hasSeenStartCutscene = true;

                            //socket.unit.Cutscene("FindIronbane");
                        }
                    }

                }
            }
        }
    }