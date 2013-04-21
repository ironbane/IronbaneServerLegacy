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

var MessageType = {
	Msg_HiHoneyImHome:0,
	Msg_StewReady:1
};


var MessageDispatcher = Class.extend({
	Init: function() {	
	
	},
	Discharge: function(receiver, telegram) {

            if ( !receiver.HandleMessage(telegram) ) {
                console.log("Message not handled");
            }
	
	},
	DispatchMessage: function(delay, sender, receiver, message, extraInfo) {
	
            var telegram = new Telegram(sender, receiver, message, extraInfo);
            
            if ( delay <= 0 ) {
                this.Discharge(receiver, telegram);
            }
            else {
                (function(receiver, telegram, delay){
                setTimeout(function(){messageDispatcher.Discharge(receiver, telegram);}, delay*1000);
                })(receiver, telegram, delay);
            }
            
	}
});

var messageDispatcher = new MessageDispatcher();
