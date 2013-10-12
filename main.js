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
    if (!isProduction && config.get('use_nodetime')) {
        require('nodetime').profile(config.get('nodetime'));
    }

    var pkg = require('./package.json'),
        log = require('util').log; // built in timestampped logger

    global.clientDir = config.get('buildTarget') + 'game/';
    global.assetDir = config.get('assetDir');
    var persistentWorldChanges = config.get('persistentWorldChanges');

    if (!cryptSalt) {
        var warn = function() {
            console.log("Warning: no password hash set! Your server works, but is very insecure. Edit config.json and set the cryptSalt variable.");
        };
        if (isProduction) {
            setInterval(warn, 1000);
        } else {
            setTimeout(warn, 3000);
        }
    }

    // System start
    var SERVER = true;

    var fs = require('fs');
    var spawn = require('child_process').spawn;
    var window = {};

    // Custom
    var NameGen = require('./External/namegen.js');
    var wrench = require('wrench');
    var util = require('util');
    var crypto = require('crypto');
    var path = require('path');

    var util = require('./src/server/game/util.js');

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

    // These are all to be converted to modules
    var includes = [
        './Shared/seedrandom.js',
        './Shared/Buffs.js',
        //'./Shared/Util.js',
        './Game/AI/graph.js',
        './Game/AI/astar.js',
        
    ];

    // Include scripts from the assets
    var scriptPath = assetDir + 'scripts';

    var actorScripts = {};
    util.walk(scriptPath, function(err, results) {
        if (err) {
            throw err;
        }

        _.each(results, function(result) {
            //console.log(result);
            if (path.extname(result) === ".js") {
                includes = includes.concat([
                    result
                ]);
            }

        });

        start(includes);
    });

    // create game server, do it first so that the other 2 "servers" can query it
    var IronbaneGame;

    // create express.io server
    var HttpServer,
        httpServer;

    // for the global access coming...todo: refactor
    var io,
        ioApp;

    function start(scripts) {
        // create game server, do it first so that the other 2 "servers" can query it
        IronbaneGame = require('./src/server/game');

        // create express.io server
        HttpServer = require('./src/server/http/server').Server;
        httpServer = new HttpServer({
            db: mysql
        });

        // for the global access coming...todo: refactor
        io = httpServer.server.io;
        ioApp = httpServer.server;

        // load constants (was Shared.js)
        var IB = require('./src/common/constants');
        // inject into global until rest is modular
        _.extend(global, IB);

        // Load DataHandler global for now (holds memory DB of item and unit templates)
        global.dataHandler = require('./src/server/game/dataHandler')(mysql);
        global.worldHandler = require('./src/server/game/world')(mysql);

        // load AI as a module
        var AI = require('./src/server/game/ai');
        // temp pass them on to global for access below
        global.StateMachine = AI.StateMachine;
        global.State = AI.State;
        _.extend(global, AI.States);

        // READ REST OF OLD GLOBAL APP HERE
        for (var f = 0; f < scripts.length; f++) {
            log("Loading: " + scripts[f]);
            eval(fs.readFileSync(scripts[f]) + '');
        }

        // Load Chat module - after worldHandler, there is a dep
        global.chatHandler = require('./src/server/game/chat')(io, global.dataHandler.items, global.dataHandler.units, global.worldHandler);
        //console.log("chatHandler", chatHandler);

        // All set! Tell WorldHandler to load
        global.worldHandler.loadWorldLight();
        var server = require('./Server')(mysql);
        global.server = new server();
        // this replaces MainLoop, must go here since server hasn't been defined earlier...
        IronbaneGame.on('tick', function(elapsed) {
            // eventually we wouldn't be accessing the global var here...
            server.Tick(elapsed);
        });

        // start it up, todo: only per config?
        startREPL();

        setInterval(keepAlive, 10000);

        setInterval(function autoSave() {
            log("Auto-saving all players...");
            worldHandler.loopUnits(function(unit) {
                if (unit instanceof Player) {
                    unit.Save();
                }
            });
        }, 60 * 1 * 1000);

        // Schedule an auto-restart to prevent EM readfile errors
        // We can only prevent this by upgrading to a real dedicated server, which we will do
        // when we have more people. Currently IB runs on a VPS.
        setTimeout(function() {
            global.chatHandler.announce("This server needs to restart in order to keep it running smoothly. The restart will happen in 1 minute. Your progress will be saved.", "red");
            setTimeout(function() {
                process.exit();
            }, 60000);
        }, 60 * 60 * 24 * 1000);
    }

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

                global.chatHandler.announce("&lt;Server&gt; New update available!", "red");
                global.chatHandler.announce("&lt;Server&gt; Auto-restarting in 10 seconds...", "red");

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
};