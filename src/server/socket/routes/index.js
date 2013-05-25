// index.js
module.exports = function(socket) {
    require('./main')(socket);
    require('./user')(socket);
};