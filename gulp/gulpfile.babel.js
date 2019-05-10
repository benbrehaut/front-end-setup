/**
 * gulp
 * @description the main gulp file
 * @version v1
 */
'use strict';

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import browserSync from 'browser-sync'
import fancyLog from 'fancylog'
import requireDir from 'require-dir'
import webpack from 'webpack-stream'
import path from 'path'

const $ = gulpLoadPlugins();

const paths = require('./variables')

requireDir('./tasks');

/**
 * browser-sync
 * @description generates BrowserSync for watching and refreshing page
 * @version v1
 */
gulp.task('browser-sync', ['scripts', 'styles'], function () {
  fancyLog.info('Starting Browser Sync Server at: ' + paths.siteURL);
  browserSync.init({
    proxy: paths.siteURL,
    files: [
      '../templates/*.twig',
      '../templates/**/*.twig',
      paths.js.outputJSFileLocation + '/*.js',
      paths.css.outputCSSFileLocation + '/*.css'
    ]
  });
});


/**
 * watch
 * @description watchs the .js and .scss files for changes
 * @version v1
 */
gulp.task('watch', function () {
  fancyLog.info('Watching Scss and JS files');
  gulp.watch(paths.js.jsFiles, ['scripts']);
  gulp.watch(paths.css.sassFiles, ['styles']);
});

/**
 * build
 * @description minifies assets
 * @version v1
 */
gulp.task('build', ['build:js', 'build:css']);

/**
 * default
 * @description runs the default task, which is browser sync and watch tasks
 * @version v1
 */
gulp.task('default', ['browser-sync', 'watch']);