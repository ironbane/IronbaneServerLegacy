
// WARNING: These tasks are meant to do a one time convert of data files
// due to a core engine changes. DO NOT RUN

function roundNumber(number, decimals) {
  var newnumber = new Number(number+'').toFixed(parseInt(decimals));
  return parseFloat(newnumber);
}

Number.prototype.Round2 = function() {
  return this % 2 == 0 ? this : this+1;
};
Number.prototype.Round = function(digits) {
  return roundNumber(this, digits);
};

module.exports = function(grunt) {
    var shell = require('shelljs');
    var fs = require('fs');
    var crypto = require('crypto');
    var Q = require('q');
    var _ = require('underscore');

    grunt.registerMultiTask('levelutil', 'Level data processing', function() {
        var task = this,
            taskDone = this.async();


        var convertJSON = function(file) {
            var deferred = Q.defer();


            console.log(file);
            // Read the file and clean it up
            fs.readFile(file, function read(err, data) {
                if (err) {
                    throw err;
                }

                data = JSON.parse(data);

                if ( _.isArray(data) ) {
                    _.each(data, function(obj) {
                        // if ( obj.rX !== undefined ) {
                        //     obj.rX *= (Math.PI / 180);
                        //     obj.rY *= (Math.PI / 180);
                        //     obj.rZ *= (Math.PI / 180);
                        // }
                        // obj.rX = obj.rX.Round();
                        // obj.rY = obj.rY.Round();
                        // obj.rZ = obj.rZ.Round();
                    });
                }

                fs.writeFile(file, JSON.stringify(data, null, 4), function(err) {
                    if (err) {
                        throw err;
                    }
                    deferred.resolve();
                });
            });

            return deferred.promise;
        };

        var promises = [];

        task.filesSrc.forEach(function(file) {
            promises.push(function() {
                return convertJSON(file);
            });

        });

        promises.reduce(Q.when, Q()).then(function() {
            grunt.log.writeln("All done!");
            taskDone(true);
        });

    });


    grunt.registerMultiTask('dbutil', 'Database processing', function() {
        var task = this,
            taskDone = this.async();


        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
              host: 'localhost',
              port: 3306,
              user: 'root',
              password: 'root'
        });

        var mysql = require('mysql').createConnection({
            host: options.host,
            port: options.port,
            user: options.user,
            password: options.password
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

        deferredQuery('USE `' + options.database + '`')
            .then(function() {
                return deferredQuery("SELECT id, data FROM ib_units");
            }, function(err) {
                deferred.reject('error selecting database: ' + options.database + ' :: ' + err);
            })
            .then(function(results) {

                grunt.log.writeln("Starting...");

                _.each(results, function(obj) {

                    console.log(obj.data);
                    if ( obj.data !== 'null' ) {

                        var data = JSON.parse(obj.data);

                        if ( data.rotY !== undefined ) {
                            //grunt.log.writeln("OLD: "+data.rotY);
                            data.rotY *= (Math.PI / 180);
                            data.rotY = data.rotY.Round(2);
                            //grunt.log.writeln("NEW: "+data.rotY);


                            data = JSON.stringify(data);

                            var query = "UPDATE ib_units SET data = ? WHERE id = ?";
                            mysql.query(query, [data, obj.id]);
                            //console.log(query, [data, obj.id]);
                        }

                    }


                });

                grunt.log.writeln("All done!");
                setTimeout(function() {
                    taskDone(true);
                }, 5000);
            }, function(err) {
                deferred.reject('error selecting data from ib_units: ' + err);
            });


    });
};
