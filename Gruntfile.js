module.exports = function(grunt) {

    var webScriptPath = 'src/client/web/js';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cfg: require('./nconf'),
        clean: {
            web: ['deploy/web']
        },
        concat: {
            web: {
                src: [webScriptPath + '/app.js', webScriptPath + '/**/*.js'],
                dest: 'deploy/web/js/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            web: {
                src: 'deploy/web/js/<%= pkg.name %>-<%= pkg.version %>.js',
                dest: 'deploy/web/js/<%= pkg.name %>-<%= pkg.version %>.min.js'
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
            }
        },
        replace: {
            web: {
                options: {
                    variables: {
                        root: '<%= cfg.get("root") %>'
                    }
                },
                files: [
                    {expand: true, flatten: true, src: ['src/client/web/index.html'], dest: 'deploy/web/'}
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
                    dest: 'deploy/game/',
                    cwd: 'src/client/game',
                    expand: true
                }]
            }
        }
    });

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-replace');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'less', 'replace', 'copy']);

};