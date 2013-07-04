// index.js
module.exports = function(app, db) {
    var config = require('../../../../nconf');

    require('./main')(app, db);
    require('./user')(app, db);
    require('./characters')(app, db);

    // catchall - no 404 as angular will handle
    app.use(function(req, res) {
        res.sendfile(config.get('clientDir') + 'index.html');
    });
};