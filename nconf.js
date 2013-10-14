// nconf.js - setup configuration
var nconf = require('nconf');

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. 'config.json'
//
nconf.argv()
    .env()
    .file({ file: __dirname + '/config.json' });

// if not provided use these values
nconf.defaults({
    root: '',
    game_root: '/game',
    game_host: 'localhost',
    mysql_host: 'localhost',
    mysql_user: 'root',
    mysql_password: '',
    mysql_database: 'ironbane',

    buildTarget: 'deploy/', // replaces old clientDir

    assetDir: 'IronbaneAssets/',

    // Set to true to allow the game to modify the files in the assetDir directly.
    // Otherwise, next time you run grunt all changes will be lost.
    persistentWorldChanges: false,

    cryptSalt: '',
    isProduction: false,
    use_nodetime: false,
    nodetime: {
        accountKey: '1234FOO',
        appName: 'Ironbane MMO'
    },
    server_port: 8080,
    session_secret: 'horsehead bookends',
    // game settings
    game: {
        timeouts: {
            playerSpawn: 5,
            npcSpawn: 10
        },
        spawns: {
            guest: {
                zone: 1,
                position: {x: 10, y: 0, z: 0}
            },
            normal: {
                zone: 1,
                position: {x: 3, y: 20, z: -4}
            },
            tutorial: {
                zone: 3,
                position: {x: 42, y: 57, z: 59}
            }
        }
    },
    irc: {
        enabled: false, // default false so contributors dont *have* to flood the channel with Ironbane clones :)
        server: 'irc.freenode.net',
        nick: 'Ironbane',
        channels: ['#ironbane']
    },
    // integrate with Github API
    github: {
        enabled: false,
        username: 'FOO',
        password: 'BAR'
    }
});

// send this configured reference
module.exports = nconf;