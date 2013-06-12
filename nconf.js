// nconf.js - setup configuration
var nconf = require('nconf');

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. 'config.json'
//
nconf.argv()
    .env()
    .file({ file: './config.json' });

// if not provided use these values
nconf.defaults({
    root: '',
    mysql_host: 'localhost',
    mysql_user: 'root',
    mysql_password: '',
    mysql_database: 'ironbane',
    clientDir: 'deploy/game/',
    // socket server
    server_port: 8080,
    // web api for client
    http_port: 8081,
    // game settings
    guestSpawnZone: 1,
    guestSpawnPosition: {x: 10, y: 0, z: 0},
    playerSpawnTimeout: 5.0,
    NPCSpawnTimeout: 10.0,
    irc: {
        enabled: false, // default false so contributors dont *have* to flood the channel with Ironbane clones :)
        server: 'irc.freenode.net',
        nick: 'Ironbane',
        channels: ['#ironbane']
    }
});

// send this configured reference
module.exports = nconf;