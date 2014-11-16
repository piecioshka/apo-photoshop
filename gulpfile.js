/*global require, __dirname, module */

(function () {
    'use strict';

    var gulp = require('gulp');
    var jshint = require('gulp-jshint');
    var stylish = require('jshint-stylish');
    var shell = require('gulp-shell');

    // node.js modules
    var path = require('path');
    var cjson = require('cjson');

    // configuration for JSHint
    var jshintrc = cjson.load('./.jshintrc');

    // show simple help menu
    require('gulp-help')(gulp);

    var paths = {
        scripts: [path.join(__dirname, 'app', 'scripts', 'core', '**', '*js')]
    };

    gulp.task('lint', 'Validate each *.js file with JSHint.', function () {
        return gulp.src(paths.scripts)
            .pipe(jshint(jshintrc))
            .pipe(jshint.reporter(stylish, { verbose: true }));
    });

    gulp.task('count', 'Count line of code in *.js files', shell.task([
        'find app/scripts -name "*.js" | xargs wc -l | sort -r'
    ]));

    // exports
    module.exports = gulp;
}());
