module.exports = function(){
    var Class = require('resig-class');
var backToMainListener = Class.extend({

	init: function(){

	}, 

	trigger: function(socket){
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
});
return backToMainListener;
};