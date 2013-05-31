// index.js
module.exports = function(socket, io, game, db) {
    require('./main')(socket, io, game, db);
    require('./user')(socket, io, game, db);
    require('./chat')(socket, io, game, db);
};