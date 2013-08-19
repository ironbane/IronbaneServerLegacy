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
            password: options.password
        });

        function checkDB() {
            var deferred = Q.defer();

            // make sure we have
            mysql.query('CREATE DATABASE IF NOT EXISTS `' + options.database + '`', function(err) {
                if(err) {
                    deferred.reject('error creating missing database: ' + options.database + ' :: ' + err);
                    return;
                }

                // db is good, use it
                mysql.query('USE `' + options.database + '`', function(err) {
                    if(err) {
                        deferred.reject('error selecting database: ' + options.database + ' :: ' + err);
                        return;
                    }

                    deferred.resolve();
                });
            });

            return deferred.promise;
        }

        function checkTable() {
            var deferred = Q.defer();

            // make sure we have the revsion tracking table
            mysql.query('CREATE TABLE IF NOT EXISTS db_revision (`revision_number` int(4) unsigned zerofill NOT NULL, `last_update` int(11) DEFAULT NULL, PRIMARY KEY (`revision_number`) )', function(err) {
                if(err) {
                    deferred.reject('error creating table ' + err);
                    return;
                }

                deferred.resolve();
            });

            return deferred.promise;
        }

        function getRevision() {
            var deferred = Q.defer();

            // get last revision number
            mysql.query('SELECT revision_number FROM db_revision', function(err, results) {
                if(err) {
                    deferred.reject('DB error getting last revision ' + err);
                    return;
                }

                if(results.length < 1) {
                    // no previous install?
                    grunt.verbose.writeln('DB looks like fresh install, no previous revision');
                    deferred.resolve('0000');
                    return;
                }

                deferred.resolve(results[0].revision_number.toString());
            });

            return deferred.promise;
        }

        function findDelta(rev) {
            var path = require('path');
            var delta = [];

            task.filesSrc.forEach(function(file) {
                var parts = path.basename(file, '.sql').split('_'),
                    fRev = parseInt(parts[parts.length-1], 10);

                grunt.verbose.writeln('found script: ' + fRev + ' :: ' + file);
                if(fRev > parseInt(rev, 10)) {
                    delta[fRev] = file;
                }
            });

            return Q(delta.sort());
        }

        function getMergeFunction(script) {
            var deferred = Q.defer();

            var sql = grunt.file.read(script);

            grunt.verbose.writeln('applying script ' + script + ' ...');

            deferred.resolve('w00t');

            return deferred.promise;
        }

        function applyDelta(scripts) {
            var merges = [];

            scripts.forEach(function(script) {
                merges.push(getMergeFunction(script));
            });

            return merges.reduce(Q.when, Q());
        }

        grunt.verbose.writeflags(options, 'Options');

        // can be less chainy with better Q-fu?
        checkDB().then(function() {
            checkTable().then(function() {
                getRevision().then(function(rev) {
                    grunt.verbose.writeln('previous revision: ' + rev);
                    findDelta(rev).then(function(scripts) {
                        grunt.verbose.writeln(scripts.length + ' change scripts found!');
                        applyDelta(scripts).then(function(results) {
                            grunt.verbose.writeln('delta results: ' + results);
                            // grunt task done!
                            taskDone(true);
                        }, function(err) {
                            grunt.fail.warn('merge error: ' + err);
                            taskDone(false);
                        });
                    });
                }, function(err) {
                    grunt.fail.warn(err);
                });
            }, function(err) {
                grunt.fail.warn(err);
            });
        }, function(err) {
            grunt.fail.warn(err);
        });
    });
};
