/**
 * @function gulp
 * @description the main gulp file for the task runner
 * @version v1
 */
var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var prefix = require('gulp-autoprefixer');
var svgstore = require('gulp-svgstore');

/**
 * @function variables
 * @description variables which contain things used throughout this file
 */
var siteURL       = 'test-gulp.uk',
    jsFiles       = 'assets/js/vendor/**/*.js',
    mainJSFile    = 'assets/js/main.js',
    sassFiles     = 'assets/scss/**/*.scss',
    mainSassFile  = 'assets/scss/main.scss';


/**
 * @function scripts
 * @description pipes our vendor JS files, main JS file out and minifies it
 * @version v1
 */
gulp.task('scripts', function () {
  return gulp.src([jsFiles, mainJSFile])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('assets/js'))
    .pipe(browserSync.reload({ stream: true }))
});

/**
 * @function sass
 * @description compiles our static .scss files into one main .css file
 * @version v1
 */
gulp.task('sass', function () {
  return gulp.src(mainSassFile)
    .pipe(sass({
      includePaths: ['scss'],
      outputStyle: 'expanded',
      onError: browserSync.notify
    }).on('error', sass.logError))
    .pipe(prefix(['last 2 versions'], { cascade: true }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.reload({ stream: true }));
});

/**
 * @function browser-sync
 * @description generates BrowserSync for watching and refreshing page
 * @version v1
 */
gulp.task('browser-sync', ['scripts', 'sass'], function () {
  browserSync.init({
    proxy: siteURL,
    files: [
      "*.php",
      '**/*.php',
      'gulpfile.js',
      'assets/js/*.js',
      'assets/css/*.css'
    ]
  });
});

/**
 * @function imgs
 * @description compresses static images
 * @version v1
 */
gulp.task('imgs', function () {
  gulp.src('assets/imgs/*')
    .pipe(imagemin())
    .pipe(gulp.dest('assets/imgs'));
});

/**
 * @function watch
 * @description watchs the .js and .scss files for changes
 * @version v1
 */
gulp.task('watch', function () {
  gulp.watch(mainJSFile, ['scripts']);
  gulp.watch(sassFiles, ['sass']);
});

/**
 * @function svgstore
 * @description generates and creates svg icons using #symbol
 * @version v1
 */
gulp.task('svgstore', function () {
  return gulp.src('assets/icons/*.svg')
    .pipe(svgstore())
    .pipe(gulp.dest('assets/icons'));
});

/**
 * @function default
 * @description runs the default task, which is browser sync and watch tasks
 * @version v1
 */
gulp.task('default', ['browser-sync', 'watch']);