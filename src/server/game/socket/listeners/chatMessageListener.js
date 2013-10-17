var _ = require('underscore');
module.exports = function(socketlistener) {
    return {
         action: function(data, socket){
            if (!socket.unit) {
                    return;
                }

                if (!_.isString(data.message)) {
                    chatHandler.announceRoom('__nick__', "Warning: Hacked client in " +
                        "[chatMessage]<br>User " + socket.unit.name + "", "red");
                    return;
                }

                // should trunc + add ellipses?
                data.message = data.message.substr(0, 100);

                // No empty messages
                if (!data.message || data.message.length <= 0) {
                    return;
                }

                if (!socket.unit.editor && socket.unit.lastChatTime > (new Date()).getTime() - 2000) {
                    chatHandler.announcePersonally(socket.unit, "Please don't spam the server.", "yellow");
                    return;
                }
                socket.unit.lastChatTime = (new Date()).getTime();

                log(socket.unit.name + ': ' + data.message);
                chatHandler.processInput(socket.unit, data.message);
            }
    };
};