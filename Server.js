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


var Server = Class.extend({
    Init: function() {


        //this.unitList = new Array();

        this.npcIDCount = -1;
        this.itemIDCount = -1;

        mysql.query('SELECT MAX(id) as id FROM ib_units',
            function (err, result) {
                if ( result.length === 0 ) {
                    server.npcIDCount = 0;
                }
                else {
                    server.npcIDCount = result[0].id;
                }
            });
        mysql.query('SELECT MAX(id) as id FROM ib_items ORDER BY id DESC',
            function (err, result) {
                if ( result.length == 0 ) {
                    server.itemIDCount = 0;
                }
                else {
                    server.itemIDCount = result[0].id;
                }
            });

        this.versionWarningTimer = 10.0;

        this.startTime = (new Date()).getTime();

        this.lastBackupTime = this.startTime;


        // this.characterImageBounds = {};

        // var imageTypes = ["skin", "eyes", ""]
     //        var dataPath = clientDir+'plugins/game/images/characters/base/head';

     // walk(dataPath, function(err, results) {
     //     if (err) throw err;

     //     for (var r in results) {
     //        var index = results[r];
     //        index = index.replace(dataPath+'/', '');

     //        index = (index.split("."))[0];

     //        index = parseInt(index)

     //        console.log (typeof index)

     //        console.log(index);
     //     }
     // });



        setTimeout(function(){server.AutoBackup();}, 300 * 1000);

    },
    AutoBackup: function() {
      log("Creating daily backup...");
      //chatHandler.Announce("Performing auto-backup...", "blue");
      worldHandler.DoFullBackup();
      setTimeout(function(){server.AutoBackup()}, 3600 * 24 * 1000);
    },
    GetAValidNPCID: function() {
        this.npcIDCount++;
        return -this.npcIDCount;
    },
    GetAValidItemID: function() {
        this.itemIDCount++;
        return this.itemIDCount;
    },
    Tick: function(dTime) {


        if ( this.versionWarningTimer > 0 ) {
            this.versionWarningTimer -= dTime;
            if ( this.versionWarningTimer <= 0 ) {
                this.versionWarningTimer = 300.0;



                var msg = ChooseSequenced([

                    "Welcome to Ironbane! Server uptime: "+timeSince(((new Date()).getTime()/1000.0)-(this.startTime/1000.0))+"<br>"+
                    "Note that Ironbane is still in an early Alpha stage.<br>Please report all bugs in the forum!",

                    "Are you an artist? A sound/music composer? A 3D modeler?<br>"+
                    "Would you like to work on an exciting project with a cool team?<br>"+
                    "Send me an e-mail at nikke@ironbane.com now!"

                ]);

                chatHandler.Announce(msg);

            }
        }




        //log(dTime);

        worldHandler.Tick(dTime);

        // Tick and send out snapshot
        // First build the snapshot

        // var snapshot = { };

        // snapshot.players = new Array();

        // var clients = io.sockets.clients();

        // log(unitList);

        // for(var x=0;x<this.unitList.length;x++) {
        // var ud = this.unitList[x];
        // snapshot.players.push({id:ud.id,tx:ud.position.x,y:ud.position.y,tz:ud.position.z,tRotY:ud.rotY,tSpeed:ud.speed});
        // }

        // io.sockets.emit("snapshot", snapshot);


        for(var z in worldHandler.world) {
            for(var cx in worldHandler.world[z]) {
                for(var cz in worldHandler.world[z][cx]) {

                    if ( ISDEF(worldHandler.world[z][cx][cz]["units"]) ) {

                        var units = worldHandler.world[z][cx][cz]["units"];

                        for(var u=0;u<units.length;u++) {


                            //if ( units[u].id > 0 ) continue;

                            units[u].Tick(dTime);

                        }

                    }
                }
            }
        }
        // Loop through all connected players in every cell and send each player an update of their otherUnits

        for(var z in worldHandler.world) {
            for(var cx in worldHandler.world[z]) {
                for(var cz in worldHandler.world[z][cx]) {

                    if ( ISDEF(worldHandler.world[z][cx][cz]["units"]) ) {

                        var units = worldHandler.world[z][cx][cz]["units"];

                        //log(units);

                        for(var u=0;u<units.length;u++) {


                            if ( !(units[u] instanceof Player) ) continue;

                            var snapshot = [];



                            var otherUnits = units[u].otherUnits;

                            //log(otherUnits);
                            //throw new Error('test');

                            // log("otherUnits:");
                            // log(otherUnits);

                            for( var ou=0;ou<otherUnits.length;ou++ ) {

                                var ud = otherUnits[ou];

                                if ( ud == units[u] ) continue;


                                //var distance = DistanceBetweenPoints(ud.position.x, ud.position.z, units[u].position.x, units[u].position.z);
                                //log("Adding unit "+ud.id+" for player "+units[u].id+" (distance "+distance+")");
                                // Check if the unit is too far from us
                                //if ( distance > 40 ) continue;


                                if ( ud.id < 0 ) {
                                    if ( ud.template.type == UnitTypeEnum.MOVINGOBSTACLE
                                    || ud.template.type == UnitTypeEnum.TOGGLEABLEOBSTACLE ) {
                                        // No movement packets for us, since we'll do everything locally
                                        // Toggleable obstacles just receive toggle events and react on that
                                        continue;
                                    }
                                }


                                var id = ud.id;
                                var pos = ud.position;

                                var packet = {
                                    id:id,
                                    p:pos
                                    };

                                if ( ud.standingOnUnitId ) {
                                    packet.u = ud.standingOnUnitId;

                                    // Send our local position instead!
                                    packet.p = ud.localPosition;
                                }


                                if ( !(ud instanceof Player) && (ud instanceof Fighter) ) {
                                    // Quickly make a rotation number for NPC's (since they only use heading vector while the client uses degrees)
                                    ud.rotation.y = (Math.atan2(ud.heading.z, ud.heading.x)).ToDegrees();

                                    if ( ud.rotation.y < 0 ) ud.rotation.y += 360;
                                    ud.rotation.y = 360 - ud.rotation.y;

                                }

                                if ( ud.sendRotationPacketX ) packet.rx = ud.rotation.x;
                                if ( ud.sendRotationPacketY ) packet.ry = ud.rotation.y;
                                if ( ud.sendRotationPacketZ ) packet.rz = ud.rotation.z;
                                snapshot.push(packet);

                            }


                            if ( snapshot.length == 0 ) continue;


                            units[u].socket.emit("snapshot", snapshot);

                        }

                    }

                //this.SaveCell(z, cx, cz);


                }
            }
        }

    }
});

var server = new Server();
