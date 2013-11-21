
var winston = require('winston');
var today = new Date();
var dateString = today.getUTCDate() +'' + today.getUTCMonth() + ''+ today.getUTCFullYear();
  var logger = new (winston.Logger)({
    transports: [
      new winston.transports.File({ filename: './logs/'+dateString+'error.log', name: 'file.error', level: 'error' }),
new winston.transports.File({ filename: './logs/'+dateString+'info.log', name: 'file.info', level: 'info' }),
new winston.transports.File({ filename: './logs/'+dateString+'warn.log', name: 'file.warn', level: 'warn' }),
    ]
  });
module.exports = logger;