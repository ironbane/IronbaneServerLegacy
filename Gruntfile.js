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
        docular: {
            groups: [],
            showDocularDocs: true,
            showAngularDocs: true
        },
        jshint: {
            web: {
                src: ['src/client/common/js/**/*.js', 'src/client/web/js/**/*.js']
            }
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
                    // common modules must be loaded before app.js as they are dependencies
                    "src/client/common/js/general/module.js",
                    "src/client/common/js/general/log.js",
                    "src/client/common/js/general/directives/passwordField.js",
                    "src/client/common/js/general/directives/checkboxCustom.js",
                    "src/client/common/js/general/filters/unsafe.js",

                    "src/client/common/js/user/module.js",
                    "src/client/common/js/user/services/user.js",

                    '<%= webScriptPath %>/app.js',
                    '<%= webScriptPath %>/**/*.js'
                ],
                dest: '<%= cfg.get("buildTarget") %>web/js/<%= pkg.name %>-<%= pkg.version %>.js'
            },
            game: {
                src: [ // order matters!
                    "src/client/game/shared.js",
                    "src/common/constants.js",

                    // common modules must be loaded before app.js as they are dependencies
                    "src/client/common/js/user/module.js",
                    "src/client/common/js/user/services/user.js",
                    "src/client/common/js/user/directives/usernameValidate.js",
                    "src/client/common/js/user/directives/emailValidate.js",
                    "src/client/common/js/friendship/module.js",
                    "src/client/common/js/friendship/services/friend.js",
                    "src/client/common/js/friendship/directives/friendsDialog.js",
                    "src/client/common/js/general/module.js",
                    "src/client/common/js/general/directives/passwordField.js",
                    "src/client/common/js/general/directives/checkboxCustom.js",
                    "src/client/common/js/general/filters/unsafe.js",

                    "<%= gameScriptPath %>/ng/app.js", // load angular app first
                    //"<%= gameScriptPath %>/ng/states.js", // do not load this yet
                    "<%= gameScriptPath %>/ng/services/game.js",
                    "<%= gameScriptPath %>/ng/services/socket.js",
                    "<%= gameScriptPath %>/ng/services/character.js",
                    "<%= gameScriptPath %>/ng/services/timer.js",
                    "<%= gameScriptPath %>/ng/services/news.js",
                    "<%= gameScriptPath %>/ng/services/alerts.js",

                    "<%= gameScriptPath %>/ng/services/units/ParticleTypes.js",

                    "<%= gameScriptPath %>/ng/services/units/ProjectileTypeEnum.js",
                    "<%= gameScriptPath %>/ng/services/units/ParticleEmitter.js",
                    "<%= gameScriptPath %>/ng/services/units/ParticleHandler.js",
                    "<%= gameScriptPath %>/ng/services/engine/zoneconstants.js",
                    "<%= gameScriptPath %>/ng/services/engine/textureHandler.js",
                    "<%= gameScriptPath %>/ng/services/engine/meshHandler.js",
                    "<%= gameScriptPath %>/ng/services/units/TerrainHandler.js",
                    "<%= gameScriptPath %>/ng/services/engine/snow.js",

                    "<%= gameScriptPath %>/ng/controllers/charSelect.js",
                    "<%= gameScriptPath %>/ng/directives/chat.js",
                    "<%= gameScriptPath %>/ng/directives/alertBox.js",
                    "<%= gameScriptPath %>/ng/directives/newsPane.js",
                    "<%= gameScriptPath %>/ng/directives/loadingBar.js",
                    "<%= gameScriptPath %>/ng/filters/timeSince.js",
                    "<%= gameScriptPath %>/ng/filters/mouthwash.js",

                    "<%= gameScriptPath %>/ng/unit/unit.js",
                    "<%= gameScriptPath %>/ng/unit/unit.svc.js",
                    "<%= gameScriptPath %>/ng/unit/unitTemplate.js",
                    "<%= gameScriptPath %>/ng/unit/unitTemplate.svc.js",

                    "<%= gameScriptPath %>/ng/items/itemTemplate.js",
                    "<%= gameScriptPath %>/ng/items/itemTemplate.svc.js",

                    "<%= gameScriptPath %>/ng/editor/npc/npc_editor.js",
                    "<%= gameScriptPath %>/ng/editor/item/item_editor.js",
                    "<%= gameScriptPath %>/ng/help/help_dialog.js",

                    // Shared between client and server
                    "Shared/Util.js",
                    "Shared/Shared.js",
                    "Shared/NodeHandler.js",
                    "Shared/seedrandom.js",
                    "Shared/Buffs.js",

                    "<%= gameScriptPath %>/External/Init.js",
                    "<%= gameScriptPath %>/External/Stats.js",
                    "<%= gameScriptPath %>/External/SteeringBehaviourLight.js",

                    "<%= gameScriptPath %>/Engine/Debug.js",
                    "<%= gameScriptPath %>/Engine/Events.js",
                    "<%= gameScriptPath %>/Engine/Input.js",
                    "<%= gameScriptPath %>/Engine/SocketHandler.js",
                    "<%= gameScriptPath %>/Engine/SoundHandler.js",
                    //"<%= gameScriptPath %>/Engine/TextureHandler.js",
                    //"<%= gameScriptPath %>/Engine/MeshHandler.js",
                    "<%= gameScriptPath %>/Engine/Shaders/PixelationShader.js",
                    "<%= gameScriptPath %>/ng/services/units/unitlist.js",
                    "<%= gameScriptPath %>/ng/services/units/Hud.js",
                    "<%= gameScriptPath %>/ng/services/units/PhysicsObject.js",
                    "<%= gameScriptPath %>/ng/services/units/Unit.js",
                    //"<%= gameScriptPath %>/ng/services/units/NewLevelEditor.js",
                    "<%= gameScriptPath %>/ng/services/units/Billboard.js",
                    "<%= gameScriptPath %>/ng/services/units/Waypoint.js",
                    "<%= gameScriptPath %>/ng/services/units/ChatBubble.js",
                    "<%= gameScriptPath %>/ng/services/units/Mesh.js",
                    "<%= gameScriptPath %>/ng/services/units/DynamicMesh.js",
                    "<%= gameScriptPath %>/ng/services/units/MovingObstacle.js",
                    "<%= gameScriptPath %>/ng/services/units/Train.js",
                    "<%= gameScriptPath %>/ng/services/units/ToggleableObstacle.js",
                    "<%= gameScriptPath %>/ng/services/units/Lever.js",
                    "<%= gameScriptPath %>/ng/services/units/TeleportEntrance.js",
                    "<%= gameScriptPath %>/ng/services/units/TeleportExit.js",
                    "<%= gameScriptPath %>/ng/services/units/HeartPiece.js",
                    //"<%= gameScriptPath %>/ng/services/units/MusicPlayer.js",
                    "<%= gameScriptPath %>/ng/services/units/Sign.js",
                    "<%= gameScriptPath %>/ng/services/units/Skybox.js",
                    "<%= gameScriptPath %>/ng/services/units/LootBag.js",
                    "<%= gameScriptPath %>/ng/services/units/LootableMesh.js",
                    "<%= gameScriptPath %>/ng/services/units/Fighter.js",
                    "<%= gameScriptPath %>/ng/services/units/Player.js",
                    "<%= gameScriptPath %>/ng/services/units/Cell.js",
                    "<%= gameScriptPath %>/ng/services/units/Cinema.js",
                    "<%= gameScriptPath %>/ng/services/units/Cutscenes.js",
                    "<%= gameScriptPath %>/ng/services/units/Projectile.js",
                    "<%= gameScriptPath %>/ng/services/units/LevelEditor.js"
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
                        gameVersion: 'v<%= pkg.version %> Alpha', //todo: have alpha/beta stored in config?
                        minified: '<%= cfg.get("isProduction") ? ".min" : "" %>'
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
                        gameVersion: 'v<%= pkg.version %> Alpha', //todo: have alpha/beta stored in config?
                        minified: '<%= cfg.get("isProduction") ? ".min" : "" %>'
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
                    src: 'fonts/**/*',
                    dest: '<%= cfg.get("buildTarget") %>web/',
                    cwd: 'src/client/common',
                    expand: true
                }, { // TODO: setup lib to copy only certain files?
                    src: 'lib/**/*',
                    dest: '<%= cfg.get("buildTarget") %>web/',
                    expand: true,
                    cwd: 'src/client/web'
                }, {
                    src: 'lib/**/*',
                    dest: '<%= cfg.get("buildTarget") %>web/',
                    expand: true,
                    cwd: 'src/client/common'
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
                    src: 'fonts/**/*',
                    dest: '<%= cfg.get("buildTarget") %>game/',
                    cwd: 'src/client/common',
                    expand: true
                }, {
                    src: 'src/client/game/js/ng/**/*.html',
                    dest: '<%= cfg.get("buildTarget") %>game/templates/',
                    expand: true,
                    flatten: true
                }, {
                    src: 'lib/**/*',
                    dest: '<%= cfg.get("buildTarget") %>game/',
                    expand: true,
                    cwd: 'src/client/game'
                }, {
                    src: ['**/*.js', '**/*.map'],
                    dest: '<%= cfg.get("buildTarget") %>game/lib/',
                    expand: true,
                    cwd: 'src/client/common/lib'
                }, {
                    src: 'flash/**/*',
                    dest: '<%= cfg.get("buildTarget") %>game/',
                    expand: true,
                    cwd: 'src/client/game'
                }, {
                    src: ['**/*', '!**/*.php','!**/*.obj', '!**/*.mtl'],
                    dest: '<%= cfg.get("buildTarget") %>game/',
                    expand: true,
                    cwd: '<%= cfg.get("assetDir") %>'
                }, {
                    src: 'favicon.ico',
                    dest: '<%= cfg.get("buildTarget") %>game/',
                    expand: true,
                    cwd: 'src/client/game'
                }]
            },
            assets: {
                files: [{
                    // Whats the '!**/*.php' for?
                    src: ['**/*', '!**/*.php', '!**/*.obj', '!**/*.mtl'],
                    dest: '<%= cfg.get("buildTarget") %>game/',
                    expand: true,
                    cwd: '<%= cfg.get("assetDir") %>'
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
                tasks: ['game', 'website', 'beep']
            },
            js: {
                files: 'src/client/**/*.js',
                tasks: ['game', 'website', 'beep']
            }
            // assets: {
            //     files: '<%= cfg.get("assetDir") %>**/*',
            //     tasks: ['assets', 'beep']
            // }
        },
        // TODO: should process these from asset dir instead of copying both over?
        three_obj: {
             src: ['<%= cfg.get("assetDir") %>images/**/*.obj']
        },
        builddetailmeshes: {
             // src: ['<%= cfg.get("assetDir") %>**/objects.json']
             options: {
                assetDir: ['<%= cfg.get("assetDir") %>'],
                host: '<%= cfg.get("mysql_host") %>',
                user: '<%= cfg.get("mysql_user") %>',
                password: '<%= cfg.get("mysql_password") %>',
                database: '<%= cfg.get("mysql_database") %>'
             },
             src: ['<%= cfg.get("assetDir") %>data/*']
        },
        buildnavnodes: {
             // src: ['<%= cfg.get("assetDir") %>images/**/*.nav.js']
             src: ['<%= cfg.get("assetDir") %>images/**/*.nav.js']
        },
        dbutil: {
            options: {
                host: '<%= cfg.get("mysql_host") %>',
                user: '<%= cfg.get("mysql_user") %>',
                password: '<%= cfg.get("mysql_password") %>',
                database: '<%= cfg.get("mysql_database") %>'
            },
            src: {

            }
        },
        // db script mgmt
        dbupgrade: {
            options: {
                host: '<%= cfg.get("mysql_host") %>',
                user: '<%= cfg.get("mysql_user") %>',
                password: '<%= cfg.get("mysql_password") %>',
                database: '<%= cfg.get("mysql_database") %>'
            },
            // Nick: doesn't really make sense to me to make two configurations for dev and prod here
            // since they will have their own repository set with their own gruntfile, db config, etc
            //dev: {
                src: ['install/**/*.sql']
            //}
        },
        download: {
            assets: {
                url: 'http://ironbane.com/data.tar',
                manifest: false,
                filename: '<%= cfg.get("assetDir") %>'
            }
        }
    });

    // load tasks
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-jasmine');
    //grunt.loadNpmTasks('grunt-docular');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-beep');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-download');

    // Default task(s).
    grunt.registerTask('assets', ['three_obj', 'copy:assets']);
    grunt.registerTask('game', ['clean:game', 'concat:game', 'uglify:game', 'less:game', 'replace:game', 'copy:game']);
    grunt.registerTask('website', ['jshint:web', 'clean:web', 'concat:web', 'uglify:web', 'less:web', 'replace:web', 'copy:web']);
    grunt.registerTask('full', ['dbupgrade', 'game', 'website', 'assets']);
    grunt.registerTask('detailmeshes', ['builddetailmeshes', 'three_obj']);
    grunt.registerTask('navnodes', ['three_obj', 'buildnavnodes']);

    // when ready do both
    grunt.registerTask('default', ['full']);
};
