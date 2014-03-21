module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'src/client/game/lib/angular/angular.min.js',
      'test/angular-mocks.js',
      'src/client/game/lib/three/three.js',
      'src/client/game/lib/underscore/underscore-min.js', 
      'src/client/game/js/ng/app.js',
     'src/client/game/js/ng/services/units/unitlist.js', 
      'test/unit/**/*.js'
    ],

    exclude : [
      'app/lib/angular/angular-loader.js',
      'app/lib/angular/*.min.js',
      'app/lib/angular/angular-scenario.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}