// index.js
module.exports = function(app, db) {
    require('./main')(app, db);
    require('./forum')(app, db);
    require('./characters')(app, db);

    // make sure last one
    app.get('*', function(req, res) {
        res.sendfile('deploy/web/index.html');
    });
};