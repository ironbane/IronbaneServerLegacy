#!/usr/bin/node

var program = require('commander'),
    pkg = require('./package.json'),
    config = require('./nconf'),
    q = require('q'),
    qfs = require('q-io/fs'),
    _ = require('underscore');

var setupWizard = function() {
    var prompt = require('prompt');

    prompt.message = "Ironbane!".green;

    var basics = {
        properties: {
            assetDir: {
                type: 'string',
                "default": config.get('assetDir')
            },
            buildTarget: {
                type: 'string',
                "default": config.get('buildTarget')
            },
            game_host: {
                type: 'string',
                "default": config.get('game_host')
            },
            server_port: {
                type: 'number',
                "default": config.get('server_port')
            },
            cryptSalt: {
                type: 'string',
                "default": config.get('cryptSalt')
            },
            session_secret: {
                type: 'string',
                "default": config.get('session_secret')
            }
        }
    };

    var db = {
        properties: {
            mysql_user: {
                type: 'string',
                "default": config.get('mysql_user')
            },
            mysql_password: {
                type: 'string',
                "default": config.get('mysql_password')
            },
            mysql_database: {
                type: 'string',
                "default": config.get('mysql_database')
            },
            mysql_host: {
                type: 'string',
                "default": config.get('mysql_host')
            }
        }
    };

    console.log('Please provide answers to the following questions to generate your config.json.');

    prompt.start();

    var pGet = q.denodeify(prompt.get);

    var steps = [function(res) {
        console.log('Step 1: SERVER CONFIG');
        return pGet(basics).then(function(results) {
            // todo: validate assetDir? check port is open?
            return _.extend(res, results);
        });
    }, function(res) {
        console.log('Step 2: DATABASE CONFIG');
        return pGet(db).then(function(results) {
            // todo: prompt to test db connection?
            return _.extend(res, results);
        });
    }];

    var finalResult = {};
    var result = q.resolve(finalResult);
    steps.forEach(function (f) {
        result = result.then(f);
    });
    return result;
};

var adminPass = function() {
    var prompt = require('prompt');

    prompt.message = "Ironbane!".green;

    var password = {
        properties: {
            password: {
                type: 'string',
                "default": ""
            }
        }
    };
    console.log('Please provide a password for the admin user.');

    prompt.start();

    var pGet = q.denodeify(prompt.get);

    var steps = [function(res) {
        return pGet(password).then(function(results) {
            return _.extend(res, results);
        });
    }];

    var finalResult = {};
    var result = q.resolve(finalResult);
    steps.forEach(function (f) {
        result = result.then(f);
    });
    return result;
};

program.version('Ironbane MMO v' + pkg.version + ' alpha');

program
    .command('init')
    .description('Create a config.json via command prompting.')
    .action(function() {
        setupWizard().then(function(responses) {
            //console.log('setup complete: ', responses);
            qfs.write('./config.json', JSON.stringify(responses, true, 4))
                .then(function() {
                    console.log('config saved...');
                }, function(err) {
                    console.log('error saving config!', err);
                })
                .done();

            // TODO: do DB installation as well (run mysql child process to insert script?)
        });
    });

program
    .command('adminpass')
    .description('Change the admin password via prompting.')
    .action(function() {
        adminPass().then(function(responses) {
		var db = require('mysql').createConnection({
			host: config.get('mysql_host'),
			user: config.get('mysql_user'),
			password: config.get('mysql_password'),
			database: config.get('mysql_database')
		}),
		user = {},
		crypto = require('crypto'),
                pHash = crypto.createHash('md5'),
                cryptSalt = config.get('cryptSalt');

                pHash.update(cryptSalt + responses.password);
                user.pass = pHash.digest('hex');

		// update admin password in the database
		var query = db.query("UPDATE bcs_users set ? where `name` = ?;", [user,'admin'], function(err) {
			if(err) console.log('SQL error during password change: ' + JSON.stringify(err));
		});
		db.end();
		console.log('Admin password saved.');
        });
    });

program
      .command('start')
      .description('Start the game!')
      .action(function() {
            console.log('starting the server...');
            // todo: validate config?
            var main = require(__dirname + '/main.js');
      });

program
    .command('*')
    .action(function(arg) {
        console.log('No such command, type -help for options.');
    });

program
    .command('validate')
    .description('validates the database')
    .action(function(){
        console.log("validating");
        var db = require('mysql').createConnection({
            host: config.get('mysql_host'),
            user: config.get('mysql_user'),
            password: config.get('mysql_password'),
            database: config.get('mysql_database')
        });
        db.query("Select count(id) as cCount from ib_characters", function(err, results){
            if(err){
                console.log(err);
            }
            else if(results.length>0){
                console.log("There are " +results[0].cCount+ " characters");
            }
        });
        db.query("Select count(id) as cCount from ib_characters where user = 0", function(err, results){
            if(err){
                console.log(err);
            }
            else if(results.length>0){
                console.log("There are " +results[0].cCount+ " guest characters");
            }
        });
        db.query("Select count(id) as cCount from ib_characters where user = 0 and lastplayed < ?",[(new Date().getTime() / 1000) - 60*60*24*14], function(err, results){
            if(err){
                console.log(err);
            }
            else if(results.length>0){
                console.log("There are " +results[0].cCount +" guest characters older than 2 weeks");
            }
        });
        db.query("Select name from ib_characters where zone = 41", function(err, results){
            if(err){
                console.log(err);
            }
            else if(results.length>0){
                console.log("There are " + results.length + " characters in hell: " + _.pluck(results, 'name'));
            }
        });
        db.query("Select id, owner from ib_items where template not in (select id from ib_item_templates)", function(err, results){
            if(err){
                console.log(err);
            }
            else if(results.length>0){
                console.log("There " + (results.length ===1 ? " is " : " are ") + results.length + " item" + (results.length===1 ? "" : "s") + " with an invalid item template:");
                _.each(results,function(result){
                    console.log("item id: " +result.id);
                    console.log("owner id: " +result.owner);
                    if(result.owner < 0){
                       db.query("Select name from ib_unit_templates INNER JOIN ib_units on ib_units.template = ib_unit_templates.id WHERE ib_units.id = ?", Math.abs(result.owner), function(err, results2){
                        console.log("Owner name: "+results2[0].name);
                       });
                    }
                    if(result.owner > 0){
                       db.query("Select name from ib_characters where id = ?",[result.owner], function(err, results2){
                            console.log("Owner name: "+results2[0].name);
                       });
                    }
                    
                });
            }
        });
    });

program.parse(process.argv);
