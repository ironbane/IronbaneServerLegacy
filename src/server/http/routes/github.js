// access github api
module.exports = function(app) {

    var config = require('../../../../nconf'),
        ghcfg = config.get('github'),
        github = require('octonode');

    app.get('/api/github/events', function(req, res) {
        var client = github.client(),
        repo = client.repo('ironbane/IronbaneServer');

        repo.info(function(err, results) {
            //console.log('github', arguments);
            if(err) {
                res.send(500, err);
                return;
            }

            res.send(results);
        });
    });

};