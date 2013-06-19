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
var config = require('./nconf');

if ( isProduction ) {
    require('nodetime').profile({
        accountKey: '02d4f7720345c788c184c7b46609f7f9ba82cb86',
        appName: 'Ironbane MMO'
      });
}

var pkg = require('./package.json'),
    log = require('util').log; // built in timestampped logger

// Mysql config
var mysql_user = config.get('mysql_user');
var mysql_password = config.get('mysql_password');
var mysql_database = config.get('mysql_database');
var clientDir = config.get('clientDir');
var isProduction = config.get('isProduction');
var cryptSalt = config.get('cryptSalt');

if ( !cryptSalt ) throw "No password hash set!";

// System start
var SERVER = true;
var params = {
    log: 0
};

//
// For running locally, don't use for production


if ( !isProduction ) {
    params.log = 0;
    params['close timeout'] = 86400;
    params['heartbeat timeout'] = 86400;
    params['heartbeat interval'] = 86400;
    params['polling duration'] = 86400;
}
else {
    params.log = 0;
    params['close timeout'] = 60 * 3;
    params['heartbeat timeout'] = 60  * 3;
    params['heartbeat interval'] = 25  * 3;
    params['polling duration'] = 20 * 3;
}
//

var io = require('socket.io').listen(config.get('server_port'), params);
var mmysql = require('mysql');
var fs = require('fs');
var spawn = require('child_process').spawn;
var window = {};

// Custom
var NameGen = require('./External/namegen');
var wrench = require('wrench');
var util = require('util');
var crypto = require('crypto');

var fsi = require('./External/fsi.js');

// https://github.com/chriso/node-validator
var check = require('validator').check,
    sanitize = require('validator').sanitize;

var _ = require('underscore');

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
var shuttingDown = false;

function keepAlive() {
    //mysql.query('SELECT 1');
    if (shuttingDown) {
        return;
    }

    mysql.query('SELECT value FROM ib_config WHERE name = ?', ["restart"], function(err, results, fields) {
        if (err) {
            throw err;
        }

        if (results.length) {
            shuttingDown = true;

            chatHandler.Announce("&lt;Server&gt; New update available!", "red");
            chatHandler.Announce("&lt;Server&gt; Auto-restarting in 10 seconds...", "red");

            // Disconnect all clients first
            io.sockets.emit("disconnect");

            setTimeout(function() {
                mysql.query('DELETE FROM ib_config WHERE name = ?', ["restart"], function(err, results, fields) {
                    if (err) {
                        throw err;
                    }

                    process.exit();
                });
            }, 20000);
        }

    });
    return;
}
setInterval(keepAlive, 10000);


setInterval(function autoSave() {
    log("Auto-saving all players...")
    worldHandler.LoopUnits(function(unit) {
        if ( unit instanceof Player ) {
            unit.Save();
        }
    });
}, 60 * 1 * 1000);

var includes = [

    './Engine/Vector3.js',
    './Engine/Util.js',

    './Init.js',

    './External/Shared.js',
    './External/Util.js',
    './External/NodeHandler.js',

    './External/perlin.js',

    './External/ImprovedNoise.js',


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

for (var f = 0; f < includes.length; f++) {
    log("Loading: " + includes[f]);
    eval(fs.readFileSync(includes[f]) + '');
}


// create web server
var HttpServer = require('./src/server/http/server').Server,
     httpServer = new HttpServer();

// create socket server
var SocketServer = require('./src/server/socket/server').Server,
    socketServer = new SocketServer(httpServer.server);

// setup REPL for console server mgmt
var startREPL = function() {
    var repl = require('repl'); // native node

    // Not game stuff, this is for the server executable
    process.stdin.setEncoding('utf8');

    // startup a full node repl for javascript awesomeness
    var serverREPL = repl.start({
        prompt: "ironbane> ",
        input: process.stdin,
        output: process.stdout
    });

    serverREPL.on('exit', function() {
        // todo: other shutdown stuff, like stop db, etc.
        process.exit();
    });

    // repl commands start with a dot i.e. ironbane> .exec
    // serverREPL.defineCommand('exec', function(text) {
    //     //consoleHandler.exec(text);
    //     log("Hello: "+text);
    // });

    // context variables get attached to "global" of this instance
    serverREPL.context.version = pkg.version;
};
// start it up, todo: only per config?
startREPL();


var oldTime = dTime = totalTimer = endTime = 0;
function MainLoop() {

    setTimeout(function() {
        MainLoop();
    }, 200);

    var now = (new Date()).getTime();
    dTime = (now - oldTime) / 1000.0; //time diff in seconds
    if (dTime > 0.3) {
        dTime = 0.3;
    }
    oldTime = now;

    var startTime = (new Date()).getTime();

    //setTimeout(function(){log(NameGen(3, 8, "", ""))}, 1000);
    server.Tick(dTime);

    endTime = (new Date()).getTime() - startTime;
}

MainLoop();