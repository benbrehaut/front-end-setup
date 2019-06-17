'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import fancyLog from 'fancylog';

const $ = gulpLoadPlugins();

const paths = require('../variables.js');

/**
 * sass
 * @description compiles our static .scss files into one main .css file
 * @version v1
 */
gulp.task('styles', function () {
  fancyLog.info('Compiling: ' + paths.css.mainSassFile);
  return gulp.src(paths.css.mainSassFile)
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: ['scss'],
      outputStyle: 'expanded',
      onError: browserSync.notify
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe($.plumber())
    .pipe($.concat(paths.css.outputCSSFile)) // output main CSS file without cleanCSS
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.css.outputCSSFileLocation))
    .pipe(browserSync.reload({ stream: true }));
});