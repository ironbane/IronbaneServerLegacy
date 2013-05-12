module.exports = function(grunt) {

    var webScriptPath = 'src/client/web/js';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            web: {
                src: [webScriptPath + '/app.js', webScriptPath + '/homeCtrl.js'],
                dest: 'deploy/web/js/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'deploy/web/js/<%= pkg.name %>-<%= pkg.version %>.js',
                dest: 'deploy/web/js/<%= pkg.name %>-<%= pkg.version %>.min.js'
            }
        }
    });

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);

};