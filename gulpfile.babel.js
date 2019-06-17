/**
 * gulp
 * @description the main gulp file
 * @version v1
 */
'use strict';

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import browserSync from 'browser-sync'
import log from 'fancylog'
import requireDir from 'require-dir'
import webpack from 'webpack-stream'
import path from 'path'

const $ = gulpLoadPlugins();

const paths = require('./variables')

/**
 * scripts
 * @description pipes our vendor JS files, main JS file out and minifies it
 * @version v1
 */
function scripts(done) {
  // log.info('Building JS File..');
  gulp.src(path.resolve(__dirname, paths.js.entryFile))
    .on('error', function(err) {
      // log.error('Error: ' + err);
      this.emit('end');
    })
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest(paths.js.outputJSFileLocation));

  done();
}

/**
 * sass
 * @description compiles our static .scss files into one main .css file
 * @version v1
 */
function styles(done) {
  // log.info('Compiling: ' + paths.css.mainSassFile);
  gulp.src(paths.css.mainSassFile)
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
    .pipe(gulp.dest(paths.css.outputCSSFileLocation));

  done();
}

/**
 * svgs
 * @description generates and creates svg icons using #symbol
 * @version v1
 */
function svgs(done) {
  // log.info('Generating icons.svg at: ' + paths.media.icons);
  gulp.src(paths.media.icons + '/*.svg')
    .pipe($.svgmin())
    .pipe($.svgstore())
    .pipe($.size({gzip: true, showFiles: true}))
    .pipe(gulp.dest(paths.media.iconsCompressed));

  done();  
}

/**
 * @function imgs
 * @description compresses static images
 * @version v1
 */
function imgs(done) {
  // log.info('Compressing Images in: ' + paths.media.imgs);
  gulp.src(paths.media.imgs + '/**/*.{gif,jpg,png,svg,ico}')
    .pipe($.imagemin())
    .pipe($.size({gzip: true, showFiles: true}))
    .pipe(gulp.dest(paths.media.imgsCompressed));

  done();
}

/**
 * Build JS
 * @description Minify and conat JS Files
 */
function buildJS() {
  // log.info('Building JS File..');
  gulp.src(path.resolve(__dirname, paths.js.entryFile))
    .on('error', function(err) {
      // log.error('Error: ' + err);
      this.emit('end');
    })
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest(paths.js.outputJSFileLocation))
    .pipe($.size({gzip: true, showFiles: true}));
}

/**
 * Build CSS
 * @description Minify and conat Scss Files into one CSS File
 */
function buildCSS(done) {
  // log.info('Building: ' + paths.css.mainSassFile);
  gulp.src(paths.css.mainSassFile)
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
  
  done();
}

/**
 * watch
 * @description watchs the .js and .scss files for changes
 * @version v1
 */
function watchFiles() {
  //   // log.info('Watching Scss and JS files');
  gulp.watch(paths.css.sassFiles, gulp.series(styles, reloadBrowserSync));
  gulp.watch(paths.js.jsFiles, gulp.series(scripts, reloadBrowserSync));
}

/**
 * browser-sync
 * @description generates BrowserSync for watching and refreshing page
 * @version v1
 */
function runBrowserSync(done) {
  // log.info('Starting Browser Sync Server at: ' + paths.siteURL);
  browserSync.init({
    proxy: paths.siteURL,
    files: [
      '../templates/*.twig',
      '../templates/**/*.twig',
      paths.js.outputJSFileLocation + '/*.js',
      paths.css.outputCSSFileLocation + '/*.css'
    ]
  });

  done();
}

function reloadBrowserSync(done) {
	browserSync.reload();
	done();
}

/**
 * build
 * @description minifies assets
 * @version v1
 */

/**
 * default
 * @description runs the default task, which is browser sync and watch tasks
 * @version v1
 */
gulp.task('scripts', scripts);
gulp.task('styles', styles);
gulp.task('imgs', imgs);
gulp.task('svgs', svgs);

gulp.task('watch', gulp.series(watchFiles, runBrowserSync));

gulp.task('build', gulp.parallel(buildJS, buildCSS));

gulp.task('default', gulp.parallel(scripts, styles, runBrowserSync));