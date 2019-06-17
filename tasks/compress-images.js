'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import fancyLog from 'fancylog';

const $ = gulpLoadPlugins();

const paths = require('../variables.js');

/**
 * @function imgs
 * @description compresses static images
 * @version v1
 */
gulp.task('imgs', function () {
  fancyLog.info('Compressing Images in: ' + paths.media.imgs);
  gulp.src(paths.media.imgs + '/**/*.{gif,jpg,png,svg,ico}')
    .pipe($.imagemin())
    .pipe($.size({gzip: true, showFiles: true}))
    .pipe(gulp.dest(paths.media.imgsCompressed));
});
