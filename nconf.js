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
    root: '', // default is /, if you want to host it like http://localhost/ironbane/ as your root, put 'ironbane' in your config.json
    mysql_host: 'localhost',
    mysql_user: 'root',
    mysql_password: 'root',
    mysql_database: 'ironbane',
    clientDir: 'deploy/game/',
    // socket server
    server_port: 8080,
    // web api for client
    http_port: 8081
});

// send this configured reference
module.exports = nconf;