
// This task is to do a one time convert of data files due to a new level system

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

    grunt.registerMultiTask('convertradians', 'One time data convert to new level editor format.', function() {
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
};
