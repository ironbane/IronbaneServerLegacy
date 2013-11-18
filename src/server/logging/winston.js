
var winston = require('winston');
var today = new Date();
var dateString = today.getUTCDate() +'' + today.getUTCMonth() + ''+ today.getUTCFullYear();
  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'logs/'+dateString+'.log' })
    ]
  });
module.exports = logger;