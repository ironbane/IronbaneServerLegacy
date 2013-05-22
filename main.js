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
var config = require('./nconf'),
    log = require('util').log; // built in timestampped logger

// Mysql config
var mysql_user = config.get('mysql_user');
var mysql_password = config.get('mysql_password');
var mysql_database = config.get('mysql_database');
var clientDir = config.get('clientDir');

// System start
var SERVER = true;
var params = {
    log: 0
};

//
// For running locally, don't use for production
params.log = 0;
params['close timeout'] = 86400;
params['heartbeat timeout'] = 86400;
params['heartbeat interval'] = 86400;
params['polling duration'] = 86400;
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

var fsi = require('./External/fsi.js');
var check = require('./External/validator.js').check;
var sanitize = require('./External/validator.js').sanitize;
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

            setTimeout(function() {
                mysql.query('DELETE FROM ib_config WHERE name = ?', ["restart"], function(err, results, fields) {
                    if (err) {
                        throw err;
                    }

                    process.exit();
                });
            }, 10000);
        }

    });
    return;
}
setInterval(keepAlive, 10000);

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


// create http api server
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    mysql.query('select * from bcs_users where id = ?', [id], function(err, results) {
        if(err) {
            done(err, null);
            return;
        }

        if(results.length === 0) {
            done("no user found", false);
        } else {
            var user = results[0];
            // add in security roles
            mysql.query('select name from bcs_roles where id in (select role_id from bcs_user_roles where user_id = ?)', [user.id], function(err, results) {
                if(err) {
                    log('error getting roles!', err);
                    user.roles = [];
                } else {
                    user.roles = results.map(function(r) { return r.name; });
                }
                // at this point still send the user, error isn't fatal
                done(null, user);
            });
        }
    });
});

passport.use(new LocalStrategy(function(username, password, done) {
    var bcrypt = require('bcrypt-nodejs');
    // asynchronous verification, for effect...
    process.nextTick(function() {
        // Find the user by username.  If there is no user with the given
        // username, or the password is not correct, set the user to `false` to
        // indicate failure and set a flash message.  Otherwise, return the
        // authenticated `user`.
        mysql.query('select * from bcs_users where username = ?', [username], function(err, results) {
            if (err) {
                return done(err);
            }

            if (results.length < 1) {
                return done(null, false, {
                    message: 'Unknown user ' + username
                });
            }

            bcrypt.compare(password, results[0].password, function(err, res) {
                if (err) {
                    return done(null, false, {
                        message: 'bcrypt error'
                    });
                }

                if (res === false) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                } else {
                    var user = results[0];
                    // add in security roles
                    mysql.query('select name from bcs_roles where id in (select role_id from bcs_user_roles where user_id = ?)', [user.id], function(err, results) {
                        if(err) {
                            log('error getting roles!', err);
                            user.roles = [];
                        } else {
                            user.roles = results.map(function(r) { return r.name; });
                        }
                        // at this point still send the user, error isn't fatal
                        done(null, user);
                    });
                }
            });
        });
    });
}));
var app = express(); // purposefully global
app.passport = passport; // convienience
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({
        secret: 'horsehead bookends'
    }));
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());

    // Simple route middleware to ensure user is authenticated.
    //   Use this route middleware on any resource that needs to be protected.  If
    //   the request is authenticated (typically via a persistent login session),
    //   the request will proceed.  Otherwise, the user will be redirected to the
    //   login page.
    app.ensureAuthenticated = function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    };

    // ALL roles must be present to access
    app.authorize = function(roles) {
        // array or single...
        if(typeof roles === 'string') {
            roles = [roles];
        }

        var middle = function(req, res, next) {
            if(!req.user.roles || req.user.roles.length === 0) {
                next('unauthorized', 403);
                return;
            }

            for(var i=0;i<roles.length;i++) {
                if(req.user.roles.indexOf(roles[i]) < 0) {
                    next('unauthorized', 403);
                    return;
                }
            }
            next();
        };

        return middle;
    };

    // ANY role may access
    app.authorizeAny = function(roles) {
        var middle = function(req, res, next) {
            if(!req.user.roles || req.user.roles.length === 0) {
                next('unauthorized', 403);
                return;
            }

            for(var i=0;i<roles.length;i++) {
                if(req.user.roles.indexOf(roles[i]) >= 0) {
                    next();
                    return;
                }
            }
            next('unauthorized', 403);
            return;
        };

        return middle;
    };
});
// load routes
require('./src/api')(app, mysql);
// start api server
app.listen(config.get('api_port'));


process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(text) {
    consoleHandler.Exec(text);
});



var oldTime = 0.0;
var dTime = 0.0;
var totalTimer = 0.0;

var endTime = 0;


// Main loop

function MainLoop() {

    setTimeout(function() {
        MainLoop();
    }, 100);

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