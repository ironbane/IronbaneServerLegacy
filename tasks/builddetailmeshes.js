var shell = require('shelljs');
var fs = require('fs');
var path = require('path');
var Q = require('q');
var _ = require('underscore');
var THREE = require('../src/client/game/lib/three/three.js');
var ibutil = require('../Engine/ibutil.js');

var nodeIdCount = 1;
var polygonId = 1;



module.exports = function(grunt) {


    grunt.registerMultiTask('builddetailmeshes', 'Create a full-detail level mesh', function() {
        var task = this,
            taskDone = this.async();

        var options = this.options({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'root',
            assetDir: "./IronbaneAssets/"
        });

        var mysql = require('mysql').createConnection({
            host: options.host,
            port: options.port,
            user: options.user,
            password: options.password,
            multipleStatements: true
        });

        var deferredQuery = function(query) {
            var deferred = Q.defer();

            mysql.query(query, function(err, results) {
                if (err) {
                    deferred.reject('error with query: ' + err);
                    return;
                }

                deferred.resolve(results);
            });

            return deferred.promise;
        };

        var saveToObj = function(file, geometry) {
            var s = '';

            geometry.mergeVertices();

            _.each(geometry.vertices, function(v) {
                s += 'v ';
                s += v.x + ' ';
                s += v.y + ' ';
                s += v.z + '\n';
            });

            s += '\n';

            _.each(geometry.faces, function(f) {
                s += 'f ';

                var mapped = [
                    f.a+1,
                    f.b+1,
                    f.c+1
                ];

                s += mapped.join(' ');
                s += '\n';
            });

            fs.writeFileSync(file, s);

        };

        var buildZone = function(file) {
            var deferred = Q.defer();

            var zone = path.basename(file);

            console.log("Generating full-detail mesh for zone " + zone);
            console.log(options.assetDir + "images/skybox/" + zone + ".js");

            var rawfile = JSON.parse(fs.readFileSync(options.assetDir + "images/skybox/" + zone + ".js", 'utf8'));
            var jsonLoader = new THREE.JSONLoader();
            result = jsonLoader.parse(rawfile);

            var geometry = result.geometry;

            var allMeshes = {};

            deferredQuery('USE `' + options.database + '`')
                .then(function() {
                    return deferredQuery("SELECT id, filename FROM ib_meshes");
                })
                .then(function(results) {

                    _.each(results, function(r) {
                        allMeshes[r.id] = r.filename;
                    });

                    // Now we need to merge all the objects found in the JSON files with the level mesh
                    ibutil.walk(options.assetDir + "data/" + zone, function(err, results) {

                        if (err) throw err;

                        _.each(results, function(r) {

                            if (path.basename(r) === "objects.json") {
                                var rawfile = JSON.parse(fs.readFileSync(r, 'utf8'));

                                _.each(rawfile, function(mesh) {

                                    if ( !allMeshes[mesh.p] ) {
                                        console.log("Mesh with id "+mesh.p+" does not exist!");
                                        return;
                                    }

                                    var rawfile = JSON.parse(fs.readFileSync(options.assetDir + "images/meshes/" +
                                        allMeshes[mesh.p].replace(".obj", "") + ".js", 'utf8'));
                                    var jsonLoader = new THREE.JSONLoader();
                                    var objGeometry = jsonLoader.parse(rawfile).geometry;
                                    var euler = new THREE.Euler(mesh.rX, mesh.rY, mesh.rZ);
                                    var pos = new THREE.Vector3(mesh.x, mesh.y, mesh.z);

                                    // Translate and rotate the vertices, then merge
                                    _.each(objGeometry.vertices, function(vertex) {
                                        vertex.applyEuler(euler);
                                        vertex.add(pos);
                                    });

                                    THREE.GeometryUtils.merge(geometry, objGeometry);

                                });

                            }



                        });

                        saveToObj(options.assetDir + "/images/skybox/"+zone+".full.obj", result.geometry);
                        console.log("Saved to "+options.assetDir + "/images/skybox/"+zone+".full.obj");

                        deferred.resolve();
                    });

                }, function(err) {
                    deferred.reject('error doing query: ' + err);
                });


            return deferred.promise;
        };


        var promises = [];

        task.filesSrc.forEach(function(file) {
            promises.push(function() {
                return buildZone(file);
            });

        });

        promises.reduce(Q.when, Q()).then(function() {
            grunt.log.writeln("All done!");
            taskDone(true);
        });

    });

};