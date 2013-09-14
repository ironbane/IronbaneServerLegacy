// access github api
module.exports = function(app) {

    var config = require('../../../../nconf'),
        ghcfg = config.get('github'),
        GitHubApi = require("github"),
        github = new GitHubApi({
            // required
            version: "3.0.0",
            // optional
            timeout: 5000
        });

    app.get('/api/github/events', function(req, res) {
        github.events.getFromRepo({
            user: 'ironbane',
            repo: 'IronbaneServer'
        }, function(err, results) {
            //console.log('github', arguments);
            if(err) {
                res.send(500, err);
                return;
            }

            res.send(results);
        });
    });

};