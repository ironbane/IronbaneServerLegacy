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
module.exports = function() {

    var config = require('./nconf');

    var isProduction = config.get('isProduction');
    var cryptSalt = config.get('cryptSalt');

    // profiling...
    if (isProduction && config.get('use_nodetime')) {
        require('nodetime').profile(config.get('nodetime'));
    }

    var pkg = require('./package.json'),
        log = require('util').log; // built in timestampped logger

    var clientDir = config.get('buildTarget') + 'game/';

    if (!cryptSalt) {
        throw "No password hash set!";
    }

    // System start
    var SERVER = true;

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
    // Start MySQL - has to be here for global access below...
    var mysql = require('mysql').createConnection({
        host: config.get('mysql_host'),
        user: config.get('mysql_user'),
        password: config.get('mysql_password'),
        database: config.get('mysql_database')
        //insecureAuth:false
    });

    process.on('uncaughtException', function(e) {
        debugger;
        console.log(e.stack);
    });

    var includes = [
            './Engine/Vector3.js',
            './Engine/Util.js',
            './Init.js',
            './Shared/seedrandom.js',
            './Shared/Shared.js',
            './Shared/Util.js',
            './Shared/NodeHandler.js',
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
            './Game/item.js',
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

    // create game server, do it first so that the other 2 "servers" can query it
    var IronbaneGame = require('./src/server/game');

    // create express.io server
    var HttpServer = require('./src/server/http/server').Server,
        httpServer = new HttpServer({db: mysql});

    // for the global access coming...todo: refactor
    var io = httpServer.server.io,
        ioApp = httpServer.server;

    // load these files AFTER the servers as they rely on some global stuff from them
    for (var f = 0; f < includes.length; f++) {
        log("Loading: " + includes[f]);
        eval(fs.readFileSync(includes[f]) + '');
    }

    // this replaces MainLoop, must go here since server hasn't been defined earlier...
    IronbaneGame.on('tick', function(elapsed) {
        // eventually we wouldn't be accessing the global var here...
        server.Tick(elapsed);
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
        log("Auto-saving all players...");
        worldHandler.LoopUnits(function(unit) {
            if (unit instanceof Player) {
                unit.Save();
            }
        });
    }, 60 * 1 * 1000);

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

        // context variables get attached to "global" of this instance
        serverREPL.context.version = pkg.version;
        serverREPL.context.httpServer = httpServer;
    };
    // start it up, todo: only per config?
    startREPL();

};