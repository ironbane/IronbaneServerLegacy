module.exports = function(grunt) {

    var webScriptPath = 'src/client/web/js',
        gameScriptPath = 'src/client/game/js';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cfg: require('./nconf'),
        clean: {
            web: ['deploy/web']
        },
        jshint: {
            files: ['src/client/web/js/**/*.js', 'Game/**/*.js']
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
                src: [webScriptPath + '/app.js', webScriptPath + '/**/*.js'],
                dest: 'deploy/web/js/<%= pkg.name %>-<%= pkg.version %>.js'
            },
            game: {
                // order is important
                src: [
                    'node_modules/three/three.js', // ensure using same copy as server
                    'src/client/game/lib/ThreeOctree.js',
                    'src/common/*.js',
                    gameScriptPath + '/game.js', // bootstraps the module
                    gameScriptPath + '/**/*.js'
                ],
                dest: 'deploy/web/game/js/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            web: {
                src: 'deploy/web/js/<%= pkg.name %>-<%= pkg.version %>.js',
                dest: 'deploy/web/js/<%= pkg.name %>-<%= pkg.version %>.min.js'
            },
            game: {
                src: 'deploy/web/game/js/<%= pkg.name %>-<%= pkg.version %>.js',
                dest: 'deploy/web/game/js/<%= pkg.name %>-<%= pkg.version %>.min.js'
            }
        },
        less: {
            web: {
                options: {
                    yuicompress: true
                },
                files: {
                    'deploy/web/css/<%= pkg.name %>.css': 'src/client/web/css/ironbane.less'
                }
            },
            game: {
                options: {
                    yuicompress: true
                },
                files: {
                    'deploy/web/game/css/<%= pkg.name %>.css': 'src/client/game/css/ironbane.less'
                }
            }
        },
        replace: {
            web: {
                options: {
                    variables: {
                        root: '<%= cfg.get("root") %>',
                        appName: '<%= pkg.name %>',
                        appVersion: '<%= pkg.version %>'
                    }
                },
                files: [
                    {expand: true, flatten: true, src: ['src/client/web/index.html'], dest: 'deploy/web/'}
                ]
            },
            game: {
                options: {
                    variables: {
                        appName: '<%= pkg.name %>',
                        appVersion: '<%= pkg.version %>'
                    }
                },
                files: [
                    {expand: true, flatten: true, src: ['src/client/game/index.html'], dest: 'deploy/web/game/'}
                ]
            }
        },
        copy: {
            options: {
                processContentExclude: ['**/*.{png,gif,jpg,ico,psd}']
            },
            web: {
                files: [{
                    src: 'src/client/web/views/*',
                    dest: 'deploy/web/views/',
                    expand: true,
                    flatten: true
                }, {
                    src: 'src/client/web/partials/*',
                    dest: 'deploy/web/partials/',
                    expand: true,
                    flatten: true
                }, {
                    src: 'images/**/*',
                    dest: 'deploy/web/',
                    cwd: 'src/client/web',
                    expand: true
                }, {
                    src: 'font/**/*',
                    dest: 'deploy/web/',
                    cwd: 'src/client/web',
                    expand: true
                }, { // TODO: setup lib to copy only certain files?
                    src: 'lib/**/*',
                    dest: 'deploy/web/',
                    expand: true,
                    cwd: 'src/client/web'
                }]
            },
            game: {
                files: [{
                    src: 'data/**/*',
                    dest: 'deploy/web/game/',
                    cwd: 'src/client/game',
                    expand: true
                }, {
                    src: 'src/client/game/views/*',
                    dest: 'deploy/web/game/views/',
                    expand: true,
                    flatten: true
                }, {
                    src: 'src/client/game/partials/*',
                    dest: 'deploy/web/game/partials/',
                    expand: true,
                    flatten: true
                }]
            }
        },
        watch: {
            css: {
                files: 'src/client/web/css/**/*',
                tasks: ['less', 'beep']
            },
            html: {
                files: 'src/client/web/**/*.html',
                tasks: ['default', 'beep']
            },
            js: {
                files: 'src/client/web/**/*.js',
                tasks: ['default', 'beep']
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

    // Default task(s).
    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'less', 'replace', 'copy']);

};