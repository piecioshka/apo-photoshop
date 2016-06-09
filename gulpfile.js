/*global require, __dirname, module */

'use strict';

// dependencies
var gulp = require('gulp');
var markdownpdf = require('gulp-markdown-pdf');
var rename = require("gulp-rename");
var NwBuilder = require('node-webkit-builder');

// node.js modules
var path = require('path');
var del = require('del');
var cjson = require('cjson');

// show simple help menu
require('gulp-help')(gulp);

var paths = {
    scripts: [path.join(__dirname, 'app', 'scripts', 'core', '**', '*js')]
};

// -----------------------------------------------------------------------------------------------------------------

gulp.task('build', 'Building application for distribution.', function (cb) {
    var nw = new NwBuilder({
        files: [
            'app/**/**',
            'package.json'
        ],
        platforms: ['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64'],
        buildDir: './dist'
    });

    // nw.on('log', console.log);

    nw.build().then(function () {
        cb();
    }).catch(function (error) {
        console.error(error);
    });
});

gulp.task('build:help', 'Building help.pdf from README.md.', function () {
    return gulp.src('README.md')
        .pipe(markdownpdf())
        .pipe(rename('docs/help.pdf'))
        .pipe(gulp.dest('./app/'));
});

