// index.js
module.exports = function(app, db) {
    require('./main')(app, db);
    require('./forum')(app, db);
    require('./article')(app, db);
    require('./characters')(app, db);

    // catchall - no 404 as angular will handle
    app.use(function(req, res) {
        res.sendfile('deploy/web/index.html');
    });
};