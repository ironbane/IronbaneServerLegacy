module.exports = function(mysql) {
  var log  = require('util').log;
    var WorldHandler = require('./worldHandler');
    var w = new WorldHandler(mysql);
log("Worldhandler: "+w);
    
    return w;
};
