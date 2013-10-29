// messages.js 

    var log = require('util').log;
module.exports = function(app, db) {

    var Message = require('../../entity/message')(db);
// create message
    app.post('/api/message', function(req, res) {
        var message = {
            from_user : req.user.id,
            to_user : req.body.to_user,
            body : req.body.content,
            subject : req.body.subject,
            datesend: (new Date()).valueOf() / 1000
        };

        Message.create(message).then(function(message) {
            // send back the completed details
            res.send(message);
        }, function(err) {
            res.send(500, err);
        });
    });

    app.post('/api/messages/delete', function(req, res){
        log(req.body);
        Message.delete(req.body).then(function(messages) {
            // send back the completed details
            res.send(messages);
        }, function(err) {
            res.send(500, err);
        });
    });


    app.get('/api/messages/', function(req, res){
        Message.getAll(req.user.id).then(function(messages) {
            // send back the completed details
            res.send(messages);
        }, function(err) {
            res.send(500, err);
        });
    });

    app.get('/api/message/:id', function(req, res){
        Message.get(req.params.id).then(function(message){
            res.send(message);
        }, function(err){
            res.send(500, err);
        });
    });
};