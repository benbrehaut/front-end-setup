/**
 * gulp
 * @description the main gulp file
 * @version v1
 */
'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();
import browserSync from 'browser-sync';
import fancyLog from 'fancylog';

/**
 * variables
 * @description variables which contain things used throughout this file
 */

// Site URL for Browser Sync
const siteURL = 'www.test-theme.uk';

// Dirctories
const dir = {
  src: 'assets/src',
  dist: 'assets/dist'
}

// Main JS Variables
const js = { 
  jsFiles: `${dir.src}/js/**/*.js`,
  vendorFiles: `${dir.src}/js/vendor/**/*.js`,
  outputJSFile: `./main.js`,
  outputJSFileCompressed: `./main.js`,
  outputJSFileLocation: `${dir.dist}/js`,
};

// Main CSS Variables
const css = {
  sassFiles: `${dir.src}/scss/**/*.scss`,
  mainSassFile: `${dir.src}/scss/style.scss`,
  outputCSSFile: `main.css`,
  outputCSSFileCompressed: `main.css`,
  outputCSSFileLocation: `${dir.dist}/css`
};

// Media Variables
const media = {
  imgs: `${dir.src}/img`,
  imgsCompressed: `${dir.dist}/img`,
  icons: `${dir.src}/icons`,
  iconsCompressed: `${dir.dist}/icons`
}

/**
 * scripts
 * @description pipes our vendor JS files, main JS file out and minifies it
 * @version v1
 */
gulp.task('scripts', function () {
  fancyLog.info('Merging JS Files..');
  return gulp.src([js.vendorFiles, js.jsFiles])
    .pipe($.babel())
    .on('error', function(err) {
      fancyLog.error('Error: ' + err);
      this.emit('end');
    })
    .pipe($.plumber())
    .pipe($.concat(js.outputJSFile))  // output main JavaScript file without uglify
    .pipe(gulp.dest(js.outputJSFileLocation))
    .pipe(browserSync.reload({ stream: true }))
});

/**
 * sass
 * @description compiles our static .scss files into one main .css file
 * @version v1
 */
gulp.task('styles', function () {
  fancyLog.info('Compiling: ' + css.mainSassFile);
  return gulp.src(css.mainSassFile)
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: ['scss'],
      outputStyle: 'expanded',
      onError: browserSync.notify
    }).on('error', $.sass.logError))
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.autoprefixer())
    .pipe($.plumber())
    .pipe($.concat(css.outputCSSFile)) // output main CSS file without cleanCSS
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(css.outputCSSFileLocation))
    .pipe(browserSync.reload({ stream: true }));
});

/**
 * browser-sync
 * @description generates BrowserSync for watching and refreshing page
 * @version v1
 */
gulp.task('browser-sync', ['scripts', 'styles'], function () {
  fancyLog.info('Starting Browser Sync Server at: ' + siteURL);
  browserSync.init({
    proxy: siteURL,
    files: [
      "*.php",
      '**/*.php',
      '*.twig',
      '**/*.twig',
      js.outputJSFileLocation + '/*.js',
      css.outputCSSFileLocation + '/*.css'
    ]
  });
});

/**
 * @function imgs
 * @description compresses static images
 * @version v1
 */
gulp.task('imgs', function () {
  fancyLog.info('Compressing Images in: ' + media.imgs);
  gulp.src(media.imgs + '/**/*.{gif,jpg,png,svg,ico}')
    .pipe($.imagemin())
    .pipe($.size({gzip: true, showFiles: true}))
    .pipe(gulp.dest(media.imgsCompressed));
});

/**
 * svgs
 * @description generates and creates svg icons using #symbol
 * @version v1
 */
gulp.task('svgs', function () {
  fancyLog.info('Generating icons.svg at: ' + media.icons);
  return gulp.src(media.icons + '/*.svg')
    .pipe($.svgmin())
    .pipe($.svgstore())
    .pipe($.size({gzip: true, showFiles: true}))
    .pipe(gulp.dest(media.iconsCompressed));
});

/**
 * watch
 * @description watchs the .js and .scss files for changes
 * @version v1
 */
gulp.task('watch', function () {
  fancyLog.info('Watching Scss and JS files');
  gulp.watch(js.jsFiles, ['scripts']);
  gulp.watch(css.sassFiles, ['styles']);
});

/**
 * Build JS
 * @description Minify and conat JS Files
 */
gulp.task('build:js', function() {
  fancyLog.info('Building JS File..');
  return gulp.src([js.vendorFiles, js.jsFiles])
    .pipe($.babel())
    .on('error', function(err) {
      fancyLog.error('Error: ' + err);
      this.emit('end');
    })
    .pipe($.plumber())
    .pipe($.uglify())
    .pipe($.concat(js.outputJSFileCompressed)) // output main JavaScript file w/ uglify
    .pipe($.size({gzip: true, showFiles: true}))
    .pipe(gulp.dest(js.outputJSFileLocation))
})

/**
 * Build CSS
 * @description Minify and conat Scss Files into one CSS File
 */
gulp.task('build:css', function() {
  fancyLog.info('Building: ' + css.mainSassFile);
  return gulp.src(css.mainSassFile)
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: ['scss'],
      outputStyle: 'expanded',
      onError: browserSync.notify
    }).on('error', $.sass.logError))
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.autoprefixer())
    .pipe($.plumber())
    .pipe($.cleanCss())
    .pipe($.concat(css.outputCSSFileCompressed)) // output main CSS file without cleanCSS
    .pipe(gulp.dest(css.outputCSSFileLocation))
    .pipe($.size({gzip: true, showFiles: true}))
})

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