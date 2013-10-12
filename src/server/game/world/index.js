module.exports = function(mysql) {
  var log  = require('util').log;
    var WorldHandler = require('./worldHandler')(mysql);
    var w = new WorldHandler();
log("Worldhandler: "+w);
    
    return w;
};
