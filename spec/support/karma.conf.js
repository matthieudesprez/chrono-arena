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
            'node_modules/promise-polyfill/promise.min.js',
            'build/vendor/easystarjs/bin/easystar-0.2.3.min.js',
            'build/vendor/phaser-official/build/phaser.js',
            {pattern: 'build/app.js', watched: true, included: true, served: true, nocache: false},
            {pattern: 'build/assets/**/*.png', watched: false, included: false, served: true, nocache: false},
            {pattern: 'build/assets/**/*.jpg', watched: false, included: false, served: true, nocache: false},
            {pattern: 'build/assets/**/*.json', watched: false, included: false, served: true, nocache: false}
        ],
        proxies: {
            '/assets/maps/arena.json': 'http://localhost:9876/base/build/assets/maps/arena.json',
            '/assets/json/gridtiles.json': 'http://localhost:9876/base/build/assets/json/gridtiles.json',
            '/assets/images/fireball.json': 'http://localhost:9876/base/build/assets/images/fireball.json',
            '/assets/images/fireball.png': 'http://localhost:9876/base/build/assets/images/fireball.png',
            '/assets/images/characters/skeleton/spritesheet.json': 'http://localhost:9876/base/build/assets/images/characters/skeleton/spritesheet.json',
            '/assets/images/characters/skeleton/spritesheet.png': 'http://localhost:9876/base/build/assets/images/characters/skeleton/spritesheet.png',
            '/assets/images/maptiles.png': 'http://localhost:9876/base/build/assets/images/maptiles.png'
        }
    })
}