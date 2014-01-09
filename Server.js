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

var Q = require('q');


var Server = Class.extend({
    Init: function() {


        this.npcIDCount = -1;

        mysql.query('SELECT MAX(id) as id FROM ib_units',
            function (err, result) {
                if ( result.length === 0 ) {
                    server.npcIDCount = 0;
                }
                else {
                    server.npcIDCount = result[0].id;
                }
            });

        this.versionWarningTimer = 10.0;

        this.startTime = (new Date()).getTime();

        this.lastBackupTime = this.startTime;


    },
    AutoBackup: function() {
      log("Creating daily backup...");
      //chatHandler.announce("Performing auto-backup...", "blue");
      worldHandler.DoFullBackup();
      setTimeout(function(){server.AutoBackup()}, 3600 * 24 * 1000);
    },
    GetAValidNPCID: function() {
        this.npcIDCount++;
        return -this.npcIDCount;
    },
    /**
     * @method tick
     * @return {Object} - A promise 
     * that for when the tick finishes.
     **/ 
    tick: function(dTime) {

        if ( this.versionWarningTimer > 0 ) {
            this.versionWarningTimer -= dTime;
            if ( this.versionWarningTimer <= 0 ) {
                this.versionWarningTimer = 300.0;
                var msg = ChooseSequenced([

                    "Welcome to Ironbane! Server uptime: "+timeSince(((new Date()).getTime()/1000.0)-(this.startTime/1000.0))+"<br>"+
                    "Note that Ironbane is still in an early Alpha stage.<br>Please report all bugs in the forum!",

                    "Are you a programmer? An artist? A 3D modeler?<br>"+
                    "Would you like to work on an exciting project with a cool team?<br>"+
                    "Give us a shout in the forums!",

                    "Are you stuck? Type /stuck to be teleported back to town.",

                    "Follow us on Twitter! @IronbaneMMO",

                    "Join us on IRC! #ironbane on chat.freenode.net",

                    "Ironbane is open source! Care to help out?<br>"+
                    "Check out the Get Involved page on the website!"

                ]);
                chatHandler.announce(msg);
            }
        }

        return Q();
    } 
});

var server = new Server();
