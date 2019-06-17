'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import fancyLog from 'fancylog';
import webpack from 'webpack-stream'
import path from 'path'

const $ = gulpLoadPlugins();

const paths = require('../variables.js');

/**
 * scripts
 * @description pipes our vendor JS files, main JS file out and minifies it
 * @version v1
 */
gulp.task('scripts', function () {
  fancyLog.info('Building JS File..');
  return gulp.src(path.resolve(__dirname, paths.js.entryFile))
    .on('error', function(err) {
      fancyLog.error('Error: ' + err);
      this.emit('end');
    })
    .pipe(webpack( require('./../webpack.config.js') ))
    .pipe(gulp.dest(paths.js.outputJSFileLocation))
    .pipe(browserSync.reload({ stream: true }));
});