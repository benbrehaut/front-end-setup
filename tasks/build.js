'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import fancyLog from 'fancylog';
import webpack from 'webpack-stream'
import path from 'path'

const $ = gulpLoadPlugins();

const paths = require('../variables.js');

/**
 * Build JS
 * @description Minify and conat JS Files
 */
gulp.task('build:js', function() {
  fancyLog.info('Building JS File..');
  return gulp.src(path.resolve(__dirname, paths.js.entryFile))
    .on('error', function(err) {
      fancyLog.error('Error: ' + err);
      this.emit('end');
    })
    .pipe(webpack( require('./../webpack.config.js') ))
    .pipe(gulp.dest(paths.js.outputJSFileLocation))
    .pipe($.size({gzip: true, showFiles: true}));
});

/**
 * Build CSS
 * @description Minify and conat Scss Files into one CSS File
 */
gulp.task('build:css', function() {
  fancyLog.info('Building: ' + paths.css.mainSassFile);
  return gulp.src(paths.css.mainSassFile)
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: ['scss'],
      outputStyle: 'expanded',
    }).on('error', $.sass.logError))
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.autoprefixer())
    .pipe($.plumber())
    .pipe($.cleanCss())
    .pipe($.concat(paths.css.outputCSSFileCompressed)) // output main CSS file without cleanCSS
    .pipe(gulp.dest(paths.css.outputCSSFileLocation))
    .pipe($.size({gzip: true, showFiles: true}))
})
