var listeners = {};

var backToMainListener = require('./backToMainListener')();
listeners.backToMainListener = new backToMainListener();
chatMessageListener = require('./chatMessageListener')();
listeners.chatMessageListener = new chatMessageListener();
console.log(listeners);
console.log(listeners.backToMainListener);
console.log(listeners.chatMessageListener);
module.exports = listeners;