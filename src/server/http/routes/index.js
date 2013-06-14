// index.js
module.exports = function(app, db) {
    // order matters to some degree, main first
    require('./main')(app, db);
    require('./user')(app, db);
    require('./menu')(app, db);
    require('./forum')(app, db);
    require('./editor')(app, db);
    require('./article')(app, db);
    require('./characters')(app, db);
    require('./world')(app, db);


    // special routing to make game a separate app
    app.get('/game/*', function(req, res) {
        res.sendfile('deploy/web/game/index.html');
    });

    // catchall - no 404 as angular will handle
    app.use(function(req, res) {
        res.sendfile('deploy/web/index.html');
    });
};