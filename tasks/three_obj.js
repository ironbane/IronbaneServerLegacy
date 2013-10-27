// custom task to manage database changes

module.exports = function(grunt) {
    var shell = require('shelljs');
    var fs = require('fs');
    var crypto = require('crypto');
    var Q = require('q');
    var _ = require('underscore');

    grunt.registerMultiTask('three_obj', 'Convert OBJ to JS.', function() {
        var task = this,
            taskDone = this.async();

        var getFileMd5 = function(file) {
            var deferred = Q.defer();

            var md5sum = crypto.createHash('md5');

            var s = fs.ReadStream(file);
            s.on('data', function(d) {
                md5sum.update(d);
            });
            s.on('end', function() {
                var d = md5sum.digest('hex');
                deferred.resolve({
                    file: file,
                    md5: d
                });
            });
            return deferred.promise;
        };

        var checkIfJsFileIsUpToDate = function(result) {
            var deferred = Q.defer();

            var jsfile = path.dirname(result.file) + "/" +
                path.basename(result.file, ".obj") + ".js";

            var basename = path.basename(result.file);

            if (!fs.existsSync(jsfile)) {
                deferred.resolve("bla");
            }
            else {
                fs.readFile(jsfile, function read(err, data) {
                    if (err) {
                        throw err;
                    }
                    data = JSON.parse(data);

                    if (data.metadata) {
                        if (!data.metadata.md5 || data.metadata.md5 !== result.md5) {
                            //console.log(basename+" is not up-to-date.");
                            // This file is not up-to-date
                            deferred.resolve(result.md5);
                        }
                        else {
                            //console.log(basename+" is up-to-date!");
                            // Looks good!
                            deferred.resolve();
                        }
                    }
                });
            }

            return deferred.promise;
        };

        var compileObj = function(file, md5) {
            var deferred = Q.defer();

            var cmd = "python " +
                path.dirname(file) + "/convert_obj_three.py" +
                " -i " + path.dirname(file) + "/" + path.basename(file) +
                " -o " + path.dirname(file) + "/" + path.basename(file, ".obj") + ".js" +
                "";

            shell.exec(cmd, function(code, output) {
                // console.log('Exit code:', code);
                // console.log('Program output:', output);
                var jsfile = path.dirname(file) + "/" +
                    path.basename(file, ".obj") + ".js";

                // Read the file and clean it up
                fs.readFile(jsfile, function read(err, data) {
                    if (err) {
                        throw err;
                    }
                    data = JSON.parse(data);


                    var potentialZoneNumber = parseInt(path.basename(file, ".obj"), 10);

                    if (!_.isNaN(potentialZoneNumber) &&
                        file.indexOf(".full") === -1 && file.indexOf(".nav") === -1) {
                        // For terrain, set a scale factor of x300
                        // which is 0.003333 for the converter
                        // But not for detail and navigation meshes, as they are already scaled

                        var scaleHack = true;

                        if (potentialZoneNumber === 50) {
                            scaleHack = false;
                        }

                        if (scaleHack) {
                            data.scale = 0.003333;
                        }
                    }


                    data.metadata.md5 = md5;

                    if (data.materials) {
                        var badFields = [
                            "DbgColor",
                            "DbgIndex",
                            "DbgName",
                            "colorAmbient",
                            "colorDiffuse",
                            "colorSpecular",
                            "illumination",
                            "mapAlpha",
                            "opticalDensity",
                            "specularCoef",
                            "transparency"
                        ];
                        _.each(data.materials, function(mat) {
                            _.each(badFields, function(badField) {
                                delete mat[badField];
                            });
                        });
                    }

                    fs.writeFile(jsfile, JSON.stringify(data, null, 4), function(err) {
                        if (err) {
                            throw err;
                        }
                        deferred.resolve();
                    });
                });
            });
            return deferred.promise;
        };

        var promises = [];

        var modelsUpToDate = 0;
        var modelsToBeUpdated = 0;

        console.log("Checking for updated 3D models that require conversion");

        task.filesSrc.forEach(function(file) {

            // Check if a .js exists
            // If it does not exist, run the converter and write the md5 of the .obj file
            // in the .js file
            // If it does exist, check if there is a md5 line present, and check
            // if the md5 matches the md5 of the .obj
            // if it matches, do not generate a new .js file


            promises.push(function() {
                return getFileMd5(file)
                    .then(function(result) {
                        return checkIfJsFileIsUpToDate(result);
                    })
                    .then(function(md5) {
                        if (md5) {
                            modelsToBeUpdated++;
                            return compileObj(file, md5);
                        }
                        else {
                            modelsUpToDate++;
                            return Q();
                        }
                    });
            });

        });

        promises.reduce(Q.when, Q()).then(function() {
            grunt.log.writeln(modelsUpToDate + " models up-to-date, " + modelsToBeUpdated + " updated.");
            grunt.log.writeln("All done!");
            taskDone(true);
        });

    });
};