// custom task to manage database changes

module.exports = function(grunt) {
    var Q = require('q');

    grunt.registerMultiTask('dbupgrade', 'Upgrade the database.', function() {
        var task = this,
            taskDone = this.async();

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
              host: 'localhost',
              port: 3306,
              user: 'root',
              password: 'root',
              scriptPath: 'install'
        });

        var mysql = require('mysql').createConnection({
            host: options.host,
            port: options.port,
            user: options.user,
            password: options.password,
            multipleStatements: true
        });

        var currentRevision = null;
        var newRevision = null;

        var deferredQuery = function(query) {
            var deferred = Q.defer();

            mysql.query(query, function(err, results) {
                if(err) {
                    deferred.reject('error with query: ' + err);
                    return;
                }

                deferred.resolve(results);
            });

            return deferred.promise;
        };

        function checkDB() {
            var deferred = Q.defer();

            // make sure we have
            deferredQuery('CREATE DATABASE IF NOT EXISTS `' + options.database + '`')
            .then(function() {
                return deferredQuery('USE `' + options.database + '`');
            }, function(err) {
                deferred.reject('error creating missing database: ' + options.database + ' :: ' + err);
            })
            .then(function() {
                deferred.resolve();
            }, function(err) {
                deferred.reject('error selecting database: ' + options.database + ' :: ' + err);
            });

            return deferred.promise;
        }

        function checkTable() {
            var deferred = Q.defer();

            // make sure we have the revsion tracking table
            deferredQuery('CREATE TABLE IF NOT EXISTS db_revision (`revision_number` int(10) unsigned NOT NULL, `last_update` int(11) DEFAULT NULL, PRIMARY KEY (`revision_number`) )')
            .then(function() {
                deferred.resolve();
            }, function(err) {
                deferred.reject('error creating table ' + err);
            });

            return deferred.promise;
        }

        function getRevision() {
            var deferred = Q.defer();

            // get last revision number
            deferredQuery('SELECT revision_number FROM db_revision')
            .then(function(results) {
                if(results.length < 1) {
                    // no previous install?
                    grunt.verbose.writeln('DB looks like fresh install, no previous revision');

                    // Insert a row so we can query it later
                    mysql.query('INSERT INTO db_revision (revision_number, last_update) VALUES(0, UNIX_TIMESTAMP(now()))', function() {
                        deferred.resolve(0);
                    });
                }
                else {
                    deferred.resolve(results[0].revision_number);
                }
            });

            return deferred.promise;
        }

        // TODO: test if the current DB revision script is missing?
        function findDelta(rev) {
            var path = require('path'),
                delta = {},
                ordered = [];

            task.filesSrc.forEach(function(file) {
                var parts = path.basename(file, '.sql').split('_'),
                    fRev = parseInt(parts[0], 10);

                newRevision = Math.max(newRevision, fRev);

                // Check if we already have the update
                if ( fRev > rev ) {
                    grunt.verbose.writeln('found script: ' + fRev + ' :: ' + file);

                    delta[fRev] = file;
                }
            });

            // Create an ordered list ourselves
            var amountOfScripts = Object.keys(delta).length;
            for (var i = 1; i <= newRevision; i++) {
                if ( delta[i] ) ordered.push(delta[i]);
            }

            return Q(ordered);
        }

        function getMergeFunction(script) {

            grunt.verbose.write('Applying script ' + script + '...');

            var sql = grunt.file.read(script);

            var promises = [];

            promises.push(function() {
                return deferredQuery(sql);
            });

            promises.push(function() {
                return deferredQuery('UPDATE db_revision SET revision_number=revision_number+1, last_update=UNIX_TIMESTAMP(now())');
            });

            return promises.reduce(Q.when, Q());
        }

        function applyDelta(scripts) {

            var merges = [];

            scripts.forEach(function(script) {
                merges.push(function() {
                    return getMergeFunction(script);
                });
            });

            return merges.reduce(Q.when, Q());
        }

        grunt.verbose.writeflags(options, 'Options');

        checkDB().then(function() {
            return checkTable();
        }, function(err) {
            grunt.fail.warn(err);
        })
        .then(function() {
            return getRevision();
        }, function(err) {
            grunt.fail.warn(err);
        })
        .then(function(rev) {
            currentRevision = rev;
            return findDelta(rev);
        }, function(err) {
            grunt.fail.warn(err);
        })
        .then(function(scripts) {
            grunt.verbose.writeln(scripts.length + ' change scripts found!');
            return applyDelta(scripts);
        }, function(err) {
            grunt.fail.warn(err);
        })
        .then(function(results) {

            var patchesApplied = newRevision-currentRevision;

            if ( !currentRevision ) {
                grunt.log.writeln("No database found or database empty.");
                grunt.log.writeln("Base database installed.");
            }
            else {
                grunt.log.writeln("Your database is currently at revision #"+currentRevision);
            }

            if ( patchesApplied ) {
                grunt.log.writeln(patchesApplied+" patches were applied.");
                grunt.log.writeln("Your database is now at revision #"+newRevision);
            }
            else {
                grunt.log.writeln("Your database is up-to-date.");
            }

            // grunt task done!
            taskDone(true);
        }, function(err) {
            grunt.fail.warn('merge error: ' + err);
            taskDone(false);
        });
    });
};
