/*global require, __dirname, module */

(function () {
    'use strict';

    // dependencies
    var gulp = require('gulp');
    var jshint = require('gulp-jshint');
    var stylish = require('jshint-stylish');
    var shell = require('gulp-shell');
    var markdownpdf = require('gulp-markdown-pdf');
    var rename = require("gulp-rename");

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

    gulp.task('count', 'Count LOC of each *.js file in `app/scripts/core`.', shell.task([
        'find app/scripts/core -name "*.js" | xargs wc -l | sort -r'
    ]));

    gulp.task('build-help', 'Building help.pdf from README.md.', function () {
        return gulp.src('README.md')
            .pipe(markdownpdf())
            .pipe(rename("docs/help.pdf"))
            .pipe(gulp.dest('./app/'));
    });

    // exports
    module.exports = gulp;
}());
