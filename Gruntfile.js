module.exports = function(grunt) {

    var webScriptPath = 'src/client/web/js';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
        copy: {
            options: {
                processContentExclude: ['**/*.{png,gif,jpg,ico,psd}']
            },
            web: {
                files: [{
                    src: 'src/client/web/*.html',
                    dest: 'deploy/web/',
                    expand: true,
                    flatten: true
                }, {
                    src: 'src/client/web/views/*',
                    dest: 'deploy/web/views/',
                    expand: true,
                    flatten: true
                }, {
                    src: 'images/**/*',
                    dest: 'deploy/web/',
                    cwd: 'src/client/web',
                    expand: true
                }, { // TODO: setup lib to copy only certain files?
                    src: 'lib/**/*',
                    dest: 'deploy/web/',
                    expand: true,
                    cwd: 'src/client/web'
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

    // Default task(s).
    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'less', 'copy']);

};