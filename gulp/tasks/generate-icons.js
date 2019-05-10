'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import fancyLog from 'fancylog';

const $ = gulpLoadPlugins();

const paths = require('../variables.js');

/**
 * svgs
 * @description generates and creates svg icons using #symbol
 * @version v1
 */
gulp.task('svgs', function () {
  fancyLog.info('Generating icons.svg at: ' + paths.media.icons);
  return gulp.src(paths.media.icons + '/*.svg')
    .pipe($.svgmin())
    .pipe($.svgstore())
    .pipe($.size({gzip: true, showFiles: true}))
    .pipe(gulp.dest(paths.media.iconsCompressed));
});
