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

// Config variables

var config = require('./config');

// Mysql config
var mysql_user = config.mysql_user;
var mysql_password = config.mysql_password;
var mysql_database = config.mysql_database;
var clientDir = config.clientDir;

// System start
var SERVER = true;
var params = { log: 0 };

//
// For running locally, don't use for production
params.log = 0;
params['close timeout'] = 86400;
params['heartbeat timeout'] = 86400;
params['heartbeat interval'] = 86400;
params['polling duration'] = 86400;
//

var io = require('socket.io').listen(config.server_port, params);
var mmysql = require('mysql');
var fs = require('fs');
var spawn = require('child_process').spawn;





var window = {};

// Custom
var NameGen = require('./External/namegen');
var wrench = require('wrench');
var util = require('util');

var fsi = require('./External/fsi.js');
var check = require('./External/validator.js').check;
var sanitize = require('./External/validator.js').sanitize
var _ = require('./External/underscore-min.js');


// Everything runs on one database, since the db is not hurt that bad by performance
// We cut the middle man and only use mysql occasionally to save/load data


// Start MySQL
var mysql = mmysql.createConnection({
    user: mysql_user,
    password: mysql_password,
    database: mysql_database
    //insecureAuth:false
});


// Necessary to prevent 'Mysql has gone away' errors
// Use it check for restarting on git push
setInterval(keepAlive, 600);
function keepAlive() {
    //mysql.query('SELECT 1');
    mysql.query('SELECT value FROM ib_config WHERE name = ?', ["restart"], function (err, results, fields) {
        if (err) throw err;

        if ( results.length ) {

            chatHandler.Announce("<Server> New update available!", "red");
            chatHandler.Announce("<Server> Auto-restarting in 10 seconds...", "red");

            setTimeout(function() {
                mysql.query('DELETE FROM ib_config WHERE name = ?', ["restart"], function (err, results, fields) {
                    if (err) throw err;

                    process.exit();
                });
            }, 10000);
        }

    });
    return;
}


var includes = [

    './Engine/Vector3.js',
    './Engine/Util.js',

    './Init.js',


    clientDir+'plugins/game/js/External/Shared.js',
    clientDir+'plugins/game/js/External/Util.js',
    clientDir+'plugins/game/js/External/NodeHandler.js',

    './External/perlin.js',

    clientDir+'plugins/game/js/External/ImprovedNoise.js',


    './Engine/ConsoleCommand.js',
    './Engine/ConsoleHandler.js',

    './Engine/Switch.js',

    './Engine/SocketHandler.js',
    './Engine/WorldHandler.js',
    './Engine/DataHandler.js',
    './Engine/ChatHandler.js',

    './Game/AI/graph.js',
    './Game/AI/astar.js',
    './Game/AI/Telegram.js',
    './Game/AI/MessageDispatcher.js',
    './Game/AI/State.js',
    './Game/AI/StateMachine.js',

    './Game/AI/MonsterScripts.js',

    './Game/AI/States/ChaseEnemy.js',
    './Game/AI/States/ExploreAndLookForEnemies.js',
    './Game/AI/States/NPCGlobalState.js',
    './Game/AI/States/EmptyState.js',
    './Game/AI/States/SellMerchandise.js',
    './Game/AI/States/Turret.js',
    './Game/AI/States/TurretStraight.js',
    './Game/AI/States/TurretKillable.js',
    './Game/AI/States/Wander.js',


    './Game/SteeringBehaviour.js',
    './Game/Unit.js',
    './Game/MovingUnit.js',
    './Game/Actor.js',
    './Game/Fighter.js',
    './Game/NPC.js',
    './Game/Lootable.js',
    './Game/Player.js',

    './Game/Special/MovingObstacle.js',
    './Game/Special/ToggleableObstacle.js',
    './Game/Special/Train.js',
    './Game/Special/Lever.js',
    './Game/Special/TeleportEntrance.js',
    './Game/Special/TeleportExit.js',
    './Game/Special/Sign.js',
    './Game/Special/HeartPiece.js',
    './Game/Special/MusicPlayer.js',

    './Server.js'


];

for(var f=0;f<includes.length;f++){
	log("Loading: "+includes[f]);
    eval(fs.readFileSync(includes[f])+'');
}

function log(msg) {
    console.log("["+(new Date()).toLocaleTimeString()+"] "+msg)    ;
}


process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (text) {
	consoleHandler.Exec(text);
});



var oldTime = 0.0;
var dTime = 0.0;
var totalTimer = 0.0;

var endTime = 0;


// Main loop
function MainLoop() {

    setTimeout(function(){
        MainLoop()
    }, 100);

    var now = (new Date()).getTime();
    dTime = (now-oldTime)/1000.0;//time diff in seconds
    if ( dTime > 0.3 ) dTime = 0.3;
    oldTime=now;

	var startTime = (new Date()).getTime();

    //setTimeout(function(){log(NameGen(3, 8, "", ""))}, 1000);
    server.Tick(dTime);

	endTime = (new Date()).getTime() - startTime;
}

MainLoop();

