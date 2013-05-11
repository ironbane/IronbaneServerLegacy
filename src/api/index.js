// index.js
module.exports = function(app, db) {
    require('./main')(app, db);
    require('./characters')(app, db);
};