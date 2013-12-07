// main, routes not categorized nicely
var express = require('express'),
    util = require('util'),
    config = require('../../../../nconf'),
    gm = require('gm'),
    fs = require('fs'),
    Q = require('q');

module.exports = function(app, db) {
    var gamePath = config.get('buildTarget') + 'game/',
        webPath = config.get('buildTarget') + 'web/';

    // legacy media
    var month = 1000 * 60 * 60 * 24 * 30;
    app.use('/game/data', express.static(gamePath + 'data'));
    app.use('/game/images', express.static(gamePath + 'images', { maxAge: month }));
    app.use('/game/sound', express.static(gamePath + 'sound', { maxAge: month }));

    app.use('/game/css', express.static(gamePath + 'css'));
    app.use('/game/fonts', express.static(gamePath + 'fonts', { maxAge: month }));
    app.use('/game/flash', express.static(gamePath + 'flash', { maxAge: month }));
    app.use('/game/media', express.static(gamePath + 'media', { maxAge: month }));
    app.use('/game/js', express.static(gamePath + 'js'));
    app.use('/game/lib', express.static(gamePath + 'lib', { maxAge: month }));

    app.use('/css', express.static(webPath + 'css'));
    app.use('/fonts', express.static(webPath + 'fonts', { maxAge: month }));
    app.use('/images', express.static(webPath + 'images', { maxAge: month }));
    app.use('/js', express.static(webPath + 'js'));
    app.use('/lib', express.static(webPath + 'lib', { maxAge: month }));
    app.use('/partials', express.static(webPath + 'partials'));
    app.use('/views', express.static(webPath + 'views'));

    app.use(app.router);

    // list available image ids
    app.get('/game/images/items', function(req, res) {
        var fs = require('q-io/fs'),
            _ = require('underscore'),
            path = require('path');

        fs.listTree(gamePath + 'images/items', function(file) {
            // don't return the cached images (with the _size)
            return path.extname(file) === '.png' && file.indexOf('_') < 0;
        }).then(function(files) {
            var names = _.map(files, function(file) {
                return path.basename(file, '.png');
            });
            res.send(names);
        }, function(err) {
            res.send(500, err);
        });
    });

    app.get('/game/images/tiles', function(req, res) {
        var fs = require('q-io/fs'),
            _ = require('underscore'),
            path = require('path');

        fs.listTree(gamePath + 'images/tiles', function(file) {
            // don't return the cached images (with the _size)
            return path.extname(file) === '.png' && file.indexOf('_') < 0;
        }).then(function(files) {
            var names = _.map(files, function(file) {
                return path.basename(file, '.png');
            });
            res.send(names);
        }, function(err) {
            res.send(500, err);
        });
    });

    app.get('/game/images/armor/:subtype', function(req, res) {
        var fs = require('q-io/fs'),
            _ = require('underscore'),
            path = require('path');

        fs.listTree(gamePath + 'images/characters/base/' + req.params.subtype, function(file) {
            return path.extname(file) === '.png' && file.indexOf('_') < 0;
        }).then(function(files) {
            var names = _.map(files, function(file) {
                return path.basename(file, '.png');
            });
            res.send(names);
        }, function(err) {
            res.send(500, err);
        });
    });

    // get item images scaled to arbitrary sizes
    app.get('/game/images/items/:imageId/:width/:height', function(req, res) {
        var imageId = req.params.imageId,
            width = req.params.width,
            height = req.params.height,
            baseImage = gamePath + 'images/items/' + imageId + '.png',
            path = gamePath + 'images/items/' + imageId + '_' + width + '_' + height + '.png';

        res.setHeader("Cache-Control", "max-age=" + month);

        fs.exists(path, function(exists) {
            if(exists) {
                res.sendfile(path);
            } else {
                gm(baseImage)
                    .filter('point')
                    .resize(width, height)
                    .write(path, function(err) {
                        if(err) {
                            res.send(500, err);
                        } else {
                            res.sendfile(path);
                        }
                    });
            }
        });
    });

    // get armor images scaled to arbitrary sizes
    app.get('/game/images/characters/base/:subtype/:imageId/:width/:height', function(req, res) {
        var imageId = req.params.imageId,
            width = req.params.width,
            height = req.params.height,
            subtype = req.params.subtype,
            baseImage = gamePath + 'images/characters/base/' + subtype + '/' + imageId + '.png',
            path = gamePath + 'images/characters/base/' + subtype + '/' + imageId + '_' + width + '_' + height + '.png',
            cutpoint = [16, 76]; // for body

        if(subtype === 'head') {
            cutpoint = [0, 70];
        }

        if(subtype === 'feet') {
            cutpoint = [16, 80];
        }

        res.setHeader("Cache-Control", "max-age=" + month);

        fs.exists(path, function(exists) {
            if(exists) {
                res.sendfile(path);
            } else {
                gm(baseImage)
                    .crop(16, 16, cutpoint[0], cutpoint[1])
                    .filter('point')
                    .resize(width, height)
                    .write(path, function(err) {
                        if(err) {
                            res.send(500, err);
                        } else {
                            res.sendfile(path);
                        }
                    });
            }
        });
    });

    // define special routes prior to statics
    app.get('/game/images/items/big.php', function(req, res) {
        var imageId = req.query.i,
            path = gamePath + 'images/items/' + imageId;

        if(!imageId) {
            res.send(500, 'missing required param i');
            return;
        }

        res.setHeader("Cache-Control", "max-age=" + month);

        fs.exists(path + '_big.png', function(exists) {
            if(exists) {
                res.sendfile(path + '_big.png');
            } else {
                gm(path + '.png')
                    .filter('point')
                    .resize(40, 40)
                    .write(path + '_big.png', function(err) {
                        if(err) {
                            res.send(500, err);
                        } else {
                            res.sendfile(path + '_big.png');
                        }
                    });
            }
        });
    });

    app.get('/game/images/items/medium.php', function(req, res) {
        var imageId = req.query.i,
            path = gamePath + 'images/items/' + imageId;

        if(!imageId) {
            res.send(500, 'missing required param i');
            return;
        }

        res.setHeader("Cache-Control", "max-age=" + month);

        fs.exists(path + '_medium.png', function(exists) {
            if(exists) {
                res.sendfile(path + '_medium.png');
            } else {
                gm(path + '.png')
                    .filter('point')
                    .resize(24, 24)
                    .write(path + '_medium.png', function(err) {
                        if(err) {
                            res.send(500, err);
                        } else {
                            res.sendfile(path + '_medium.png');
                        }
                    });
            }
        });
    });

    app.get('/game/images/tiles/medium.php', function(req, res) {
        var imageId = req.query.i,
            path = gamePath + 'images/tiles/' + imageId;

        if(!imageId) {
            res.send(500, 'missing required param i');
            return;
        }

        res.setHeader("Cache-Control", "max-age=" + month);

        fs.exists(path + '_medium.png', function(exists) {
            if(exists) {
                res.sendfile(path + '_medium.png');
            } else {
                gm(path + '.png')
                    .filter('point')
                    .resize(24, 24)
                    .write(path + '_medium.png', function(err) {
                        if(err) {
                            res.send(500, err);
                        } else {
                            res.sendfile(path + '_medium.png');
                        }
                    });
            }
        });
    });

    app.get('/game/images/textures/medium.php', function(req, res) {
        var imageId = req.query.i,
            path = gamePath + 'images/textures/' + imageId;

        if(!imageId) {
            res.send(500, 'missing required param i');
            return;
        }

        res.setHeader("Cache-Control", "max-age=" + month);

        fs.exists(path + '_medium.png', function(exists) {
            if(exists) {
                res.sendfile(path + '_medium.png');
            } else {
                gm(path + '.png')
                    .filter('point')
                    .resize(24, 24)
                    .write(path + '_medium.png', function(err) {
                        if(err) {
                            res.send(500, err);
                        } else {
                            res.sendfile(path + '_medium.png');
                        }
                    });
            }
        });
    });

    // armors grab the front and center and blow it up
    app.get('/game/images/characters/base/:subtype/big.php', function(req, res) {
        var imageId = req.query.i,
            subtype = req.params.subtype,
            path = gamePath + 'images/characters/base/' + subtype + '/' + imageId,
            cutpoint = [16, 76]; // for body

        if(subtype === 'head') {
            cutpoint = [0, 70];
        }

        if(subtype === 'feet') {
            cutpoint = [16, 80];
        }

        if(!imageId) {
            res.send(500, 'missing required param i');
            return;
        }

        res.setHeader("Cache-Control", "max-age=" + month);

        fs.exists(path + '_big.png', function(exists) {
            if(exists) {
                res.sendfile(path + '_big.png');
            } else {
                gm(path + '.png')
                    .crop(16, 16, cutpoint[0], cutpoint[1])
                    .filter('point')
                    .resize(48, 48)
                    .write(path + '_big.png', function(err) {
                        if(err) {
                            res.send(500, err);
                        } else {
                            res.sendfile(path + '_big.png');
                        }
                    });
            }
        });
    });

    app.get('/game/images/characters/base/:subtype/medium.php', function(req, res) {
        var imageId = req.query.i,
            subtype = req.params.subtype,
            path = gamePath + 'images/characters/base/' + subtype + '/' + imageId,
            cutpoint = [16, 76]; // for body

        if(subtype === 'head') {
            cutpoint = [0, 70];
        }

        if(subtype === 'feet') {
            cutpoint = [16, 80];
        }

        if(!imageId) {
            res.send(500, 'missing required param i');
            return;
        }

        res.setHeader("Cache-Control", "max-age=" + month);

        // no need to regenerate if it it already exists
        fs.exists(path + '_medium.png', function(exists) {
            if(exists) {
                res.sendfile(path + '_medium.png');
            } else {
                gm(path + '.png')
                    .crop(16, 16, cutpoint[0], cutpoint[1])
                    .filter('point')
                    .resize(32, 32)
                    .write(path + '_medium.png', function(err) {
                        if(err) {
                            res.send(500, err);
                        } else {
                            res.sendfile(path + '_medium.png');
                        }
                    });
            }
        });
    });

    // character cache
    function createCharacterHeadImage(id, isHead) {
        var deferred = Q.defer(),
            basePath = gamePath + 'images/characters/base/',
            cachePath = gamePath + 'images/characters/cache/',
            headType = isHead ? 'head' : 'hair';

        // easier to just pass in 0 than have even more conditional logic below
        if(parseInt(id, 10) === 0) {
            deferred.resolve('skip');
            return deferred.promise;
        }

        fs.exists(basePath + headType + '/' + id + '.png', function(exists) {
            if(!exists) {
                deferred.reject('invalid id for ' + headType);
                return;
            }

            fs.exists(cachePath + headType + '_' + id + '.png', function(cacheExists) {
                if(cacheExists) {
                    deferred.resolve(cachePath + headType + '_' + id + '.png');
                    return;
                } else {
                    gm(basePath + headType + '/' + id + '.png')
                        .append(basePath + headType + '/' + id + '.png', true)
                        .append(basePath + headType + '/' + id + '.png', true)
                        .write(cachePath + headType + '_' + id + '.png', function(err) {
                            if(err) {
                                deferred.reject('error generating head');
                                return;
                            }

                            deferred.resolve(cachePath + headType + '_' + id + '.png');
                        });
                }
            });
        });

        return deferred.promise;
    }

    // $character, $skin, $hair, $head, $body, $feet, $big=false
    function createFullCharacterImage($skin, $eyes, $hair, $feet, $body, $head, $big) {
        var deferred = Q.defer(),
            basePath = gamePath + 'images/characters/base/',
            cachePath = gamePath + 'images/characters/cache/',
            outSmall = cachePath + [$skin, $eyes, $hair, $feet, $body, $head, 0].join('_') + '.png',
            outBig = cachePath + [$skin, $eyes, $hair, $feet, $body, $head, 1].join('_') + '.png';

        // for now need to build the head and hair separately
        Q.all([createCharacterHeadImage($head, true), createCharacterHeadImage($hair, false)])
            .then(function(results) {
                // start with the skin
                var img = gm()
                    .background('transparent')
                    .out(basePath + 'skin/' + $skin + '.png');

                if(parseInt($eyes, 10) > 0) {
                    img = img.out(basePath + 'eyes/' + $eyes + '.png');
                }

                // head or hair
                if(parseInt($head, 10) > 0) {
                    img = img.out(results[0]);
                } else if(parseInt($hair, 10) > 0) {
                    img = img.out(results[1]);
                }

                if(parseInt($feet, 10) > 0) {
                    img = img.out(basePath + 'feet/' + $feet + '.png');
                }

                if(parseInt($body, 10) > 0) {
                    img = img.out(basePath + 'body/' + $body + '.png');
                }

                img = img.mosaic();

                // have to write the flatten first!
                img.write(outSmall, function(err) {
                    if(err) {
                        deferred.reject('image error: ' + err);
                        return;
                    }

                    if(parseInt($big, 10) === 1) {
                        gm(outSmall)
                            .crop(16, 18, 16, 72)
                            .filter('point')
                            .resize(16*8, 18*8)
                            .write(outBig, function(err) {
                                if(err) {
                                    deferred.reject('image error: ' + err);
                                    return;
                                }

                                deferred.resolve(outBig);
                            });
                    } else {
                        deferred.resolve(outSmall);
                    }
                });
            }, function(err) {
                deferred.reject('error with head: ' + err);
                return;
            });

        return deferred.promise;
    }

    app.get('/game/images/characters/cache/*', function(req, res) {
        var path = require('path'),
            filename = path.basename(req.url, '.png');

        // todo: test if exist and serve

        var parts = filename.split('_');

        createFullCharacterImage(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6])
            .then(function(image) {
                //res.setHeader('Content-Type', 'image/png');
                res.setHeader("Cache-Control", "max-age=" + month);
                res.sendfile(image);
            }, function(err) {
                res.send(500, err);
            });
    });
};