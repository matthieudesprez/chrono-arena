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
            'build/app.js'
        ],
        proxies: {
            '/assets/maps/arena.json': 'http://localhost:8000/assets/maps/arena.json',
            '/assets/json/gridtiles.json': 'http://localhost:8000/assets/json/gridtiles.json',
            '/assets/images/fireball.json': 'http://localhost:8000/assets/images/fireball.json',
            '/assets/images/fireball.png': 'http://localhost:8000/assets/images/fireball.png',
            '/assets/images/characters/skeleton/spritesheet.json': 'http://localhost:8000/assets/images/characters/skeleton/spritesheet.json',
            '/assets/images/characters/skeleton/spritesheet.png': 'http://localhost:8000/assets/images/characters/skeleton/spritesheet.png',
            '/assets/images/maptiles.png': 'http://localhost:8000/assets/images/maptiles.png'
        }
    })
}