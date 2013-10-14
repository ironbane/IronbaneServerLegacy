// common instance of the mysql connection to be shared app wide
var config = require(global.APP_ROOT_PATH + '/nconf');

var mysql = require('mysql').createConnection({
    host: config.get('mysql_host'),
    user: config.get('mysql_user'),
    password: config.get('mysql_password'),
    database: config.get('mysql_database')
    //insecureAuth:false
});

module.exports = mysql;