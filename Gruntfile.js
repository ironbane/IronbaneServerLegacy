module.exports = function(grunt) {

    var conf = require('./nconf');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cfg: require('./nconf'),

        // these are the paths in the source, not the deployment, so they are OK to hard code
        webScriptPath: 'src/client/web/js',
        gameScriptPath: 'src/client/game/js',

        clean: {
            common: ['<%= cfg.get("buildTarget") %>'],
            web: ['<%= cfg.get("buildTarget") %>web/'],
            game: ['<%= cfg.get("buildTarget") %>game/']
        },
        jshint: {
            files: ['src/client/web/js/**/*.js', 'src/client/game/js/**/*.js']
        },
        jasmine: {
            pivotal: {
                src: 'src/client/web/js/**/*.js',
                options: {
                    specs: 'spec/*Spec.js',
                    helpers: 'spec/*Helper.js'
                }
            }
        },
        concat: {
            web: {
                src: [
                    '<%= webScriptPath %>/app.js',
                    '<%= webScriptPath %>/**/*.js'
                ],
                dest: '<%= cfg.get("buildTarget") %>web/js/<%= pkg.name %>-<%= pkg.version %>.js'
            },
            game: {
                src: [ // order matters!
                    "src/client/game/shared.js",
                    "<%= gameScriptPath %>/ng/app.js", // load angular app first
                    "<%= gameScriptPath %>/ng/chat.js",
                    "<%= gameScriptPath %>/ng/game.js",
                    "<%= gameScriptPath %>/ng/news.js",
                    "<%= gameScriptPath %>/ng/socket.js",

                    // Shared between client and server
                    "Shared/Util.js",
                    "Shared/Shared.js",
                    "Shared/NodeHandler.js",
                    "Shared/seedrandom.js",

                    "<%= gameScriptPath %>/External/Init.js",
                    "<%= gameScriptPath %>/External/Stats.js",
                    "<%= gameScriptPath %>/External/SteeringBehaviourLight.js",


                    "<%= gameScriptPath %>/Engine/Debug.js",
                    "<%= gameScriptPath %>/Engine/Events.js",
                    "<%= gameScriptPath %>/Engine/Input.js",
                    "<%= gameScriptPath %>/Engine/SocketHandler.js",
                    "<%= gameScriptPath %>/Engine/SoundHandler.js",
                    "<%= gameScriptPath %>/Engine/TextureHandler.js",
                    "<%= gameScriptPath %>/Engine/MeshHandler.js",
                    "<%= gameScriptPath %>/Engine/Shaders/PixelationShader.js",
                    "<%= gameScriptPath %>/Game/Hud.js",
                    "<%= gameScriptPath %>/Game/PhysicsObject.js",
                    "<%= gameScriptPath %>/Game/Unit.js",
                    "<%= gameScriptPath %>/Game/Billboard.js",
                    "<%= gameScriptPath %>/Game/Waypoint.js",
                    "<%= gameScriptPath %>/Game/ChatBubble.js",
                    "<%= gameScriptPath %>/Game/Mesh.js",
                    "<%= gameScriptPath %>/Game/DynamicMesh.js",
                    "<%= gameScriptPath %>/Game/MovingObstacle.js",
                    "<%= gameScriptPath %>/Game/Train.js",
                    "<%= gameScriptPath %>/Game/ToggleableObstacle.js",
                    "<%= gameScriptPath %>/Game/Lever.js",
                    "<%= gameScriptPath %>/Game/TeleportEntrance.js",
                    "<%= gameScriptPath %>/Game/TeleportExit.js",
                    "<%= gameScriptPath %>/Game/HeartPiece.js",
                    "<%= gameScriptPath %>/Game/MusicPlayer.js",
                    "<%= gameScriptPath %>/Game/Sign.js",
                    "<%= gameScriptPath %>/Game/Skybox.js",
                    "<%= gameScriptPath %>/Game/LootBag.js",
                    "<%= gameScriptPath %>/Game/LootableMesh.js",
                    "<%= gameScriptPath %>/Game/Fighter.js",
                    "<%= gameScriptPath %>/Game/Player.js",
                    "<%= gameScriptPath %>/Game/Cell.js",
                    "<%= gameScriptPath %>/Game/Cinema.js",
                    "<%= gameScriptPath %>/Game/Cutscenes.js",
                    "<%= gameScriptPath %>/Game/ParticleTypes.js",
                    "<%= gameScriptPath %>/Game/Projectile.js",
                    "<%= gameScriptPath %>/Game/ParticleEmitter.js",
                    "<%= gameScriptPath %>/Game/ParticleHandler.js",
                    "<%= gameScriptPath %>/Game/TerrainHandler.js",
                    "<%= gameScriptPath %>/Game/LevelEditor.js"
                ],
                dest: '<%= cfg.get("buildTarget") %>game/js/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            web: {
                src: '<%= cfg.get("buildTarget") %>web/js/<%= pkg.name %>-<%= pkg.version %>.js',
                dest: '<%= cfg.get("buildTarget") %>web/js/<%= pkg.name %>-<%= pkg.version %>.min.js'
            },
            game: {
                src: '<%= cfg.get("buildTarget") %>game/js/<%= pkg.name %>-<%= pkg.version %>.js',
                dest: '<%= cfg.get("buildTarget") %>game/js/<%= pkg.name %>-<%= pkg.version %>.min.js'
            }
        },
        less: {
            web: {
                options: {
                    yuicompress: true
                },
                files: {
                    '<%= cfg.get("buildTarget") %>web/css/<%= pkg.name %>.css': 'src/client/web/css/ironbane.less'
                }
            },
            game: {
                options: {
                    yuicompress: true
                },
                files: {
                    '<%= cfg.get("buildTarget") %>game/css/<%= pkg.name %>.css': 'src/client/game/css/ironbane.less'
                }
            }
        },
        // we must move the index files into common area for server rendering
        replace: {
            web: {
                options: {
                    variables: {
                        root: '<%= cfg.get("root") %>',
                        appName: '<%= pkg.name %>',
                        appVersion: '<%= pkg.version %>',
                        gameVersion: 'v<%= pkg.version %> Alpha' //todo: have alpha/beta stored in config?
                    }
                },
                files: [
                    {expand: true, flatten: true, src: ['src/client/web/index.html'], dest: '<%= cfg.get("buildTarget") %>web/'}
                ]
            },
            game: {
                options: {
                    variables: {
                        root: '<%= cfg.get("game_root") %>',
                        host: '<%= cfg.get("game_host") %>',
                        port: '<%= cfg.get("server_port") %>',
                        appName: '<%= pkg.name %>',
                        appVersion: '<%= pkg.version %>',
                        gameVersion: 'v<%= pkg.version %> Alpha' //todo: have alpha/beta stored in config?
                    }
                },
                files: [
                    {expand: true, flatten: true, src: ['src/client/game/index.html'], dest: '<%= cfg.get("buildTarget") %>game/'}
                ]
            }
        },
        copy: {
            options: {
                processContentExclude: ['**/*.{png,gif,jpg,ico,psd}']
            },
            common: {
                // todo: move lib files into common
            },
            web: {
                files: [{
                    src: 'src/client/web/views/*',
                    dest: '<%= cfg.get("buildTarget") %>web/views/',
                    expand: true,
                    flatten: true
                }, {
                    src: 'src/client/web/partials/*',
                    dest: '<%= cfg.get("buildTarget") %>web/partials/',
                    expand: true,
                    flatten: true
                }, {
                    src: 'images/**/*',
                    dest: '<%= cfg.get("buildTarget") %>web/',
                    cwd: 'src/client/web',
                    expand: true
                }, {
                    src: 'font/**/*',
                    dest: '<%= cfg.get("buildTarget") %>web/',
                    cwd: 'src/client/web',
                    expand: true
                }, { // TODO: setup lib to copy only certain files?
                    src: 'lib/**/*',
                    dest: '<%= cfg.get("buildTarget") %>web/',
                    expand: true,
                    cwd: 'src/client/web'
                }]
            },
            game: {
                files: [{
                    // this is the folder structure only? get actual game data elsewhere?
                    src: 'media/**/*',
                    dest: '<%= cfg.get("buildTarget") %>game/',
                    cwd: 'src/client/game',
                    expand: true
                }, {
                    src: 'lib/**/*',
                    dest: '<%= cfg.get("buildTarget") %>game/',
                    expand: true,
                    cwd: 'src/client/game'
                }, {
                    src: 'flash/**/*',
                    dest: '<%= cfg.get("buildTarget") %>game/',
                    expand: true,
                    cwd: 'src/client/game'
                }, {
                    src: ['**/*', '!**/*.php'],
                    dest: '<%= cfg.get("buildTarget") %>game/',
                    expand: true,
                    cwd: '<%= cfg.get("assetDir") %>'
                }, {
                    src: 'favicon.ico',
                    dest: '<%= cfg.get("buildTarget") %>game/',
                    expand: true,
                    cwd: 'src/client/game'
                }]
            }
        },
        // TODO: make less agressive?
        watch: {
            css: {
                files: 'src/client/**/*.less',
                tasks: ['less', 'beep']
            },
            html: {
                files: 'src/client/**/*.html',
                tasks: ['default', 'beep']
            },
            js: {
                files: 'src/client/**/*.js',
                tasks: ['default', 'beep']
            },
            assets: {
                files: '<%= cfg.get("assetDir") %>**/*',
                tasks: ['default', 'beep']
            }
        },
        // TODO: should process these from asset dir instead of copying both over?
        three_obj: {
            options: {
                /** @optional  - if true the files are converted to binary JSON */
                minify: false
            },
            dist: {
                /** @required  - string (or array of) including grunt glob variables */
                src: ['<%= cfg.get("buildTarget") %>game/**/*.obj']
                /** @optional  - if provided the converted files will be saved in this folder instead */
                //dest: './assets/'
            }
        }
    });

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-beep');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-three-obj');

    // Default task(s).
    grunt.registerTask('game', ['clean:game', 'concat:game', 'uglify:game', 'less:game', 'replace:game', 'copy:game', 'three_obj']);
    grunt.registerTask('website', ['clean:web', 'concat:web', 'uglify:web', 'less:web', 'replace:web', 'copy:web']);

    // when ready do both
    grunt.registerTask('default', ['website', 'game']);
};