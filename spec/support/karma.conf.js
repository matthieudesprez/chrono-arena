// karma.conf.js
module.exports = function(config) {
    config.set({
        basePath: '../..',
        frameworks: ['jasmine'],
        singleRun: true,
        browsers: ['PhantomJS'],
        reporters: ['dots', 'coverage'],
        logLevel: config.LOG_WARN,

        preprocessors: {
            'build/app.js': ['coverage']
        },
        coverageReporter: {
            type : 'json',
            dir : 'out/coverage/',
            subdir: '.',
            file: 'coverage.json'
        },

        files: [
            'build/vendor/easystarjs/bin/easystar-0.2.3.min.js',
            'build/vendor/phaser-official/build/phaser.js',
            'build/app.js'
        ]
    })
}