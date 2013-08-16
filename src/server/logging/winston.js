
var winston = require('winston');
winston.add(winston.transports.File, { filename: './logs/somefile.log' })

module.exports.winston = winston;