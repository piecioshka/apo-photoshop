(function () {
    'use strict';

    var gulp = require('gulp');
    var jshint = require('gulp-jshint');
    var stylish = require('jshint-stylish');

    // node.js modules
    var path = require('path');
    var cjson = require('cjson');

    // configuration for JSHint
    var jshintrc = cjson.load('./.jshintrc');

    // show simple help menu
    require('gulp-help')(gulp);

    var paths = {
        scripts: [path.join(__dirname, 'scripts', 'core', '**', '*js')]
    };

    gulp.task('lint', function () {
        return gulp.src(paths.scripts)
            .pipe(jshint(jshintrc))
            .pipe(jshint.reporter(stylish, { verbose: true }));
    });

    // exports
    module.exports = gulp;
}());
