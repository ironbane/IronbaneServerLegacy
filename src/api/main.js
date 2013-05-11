// main, routes not categorized nicely
module.exports = function(app, db) {
    app.get('/', function(req, res) {
        res.end('Ironbane API');
    });
};