/**
 * the main gulp file
 * @version v2
 */
'use strict';

import { 
  src, 
  dest, 
  task, 
  watch, 
  series, 
  parallel 
} from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import browserSync from 'browser-sync'
import log from 'fancy-log'
import webpack from 'webpack-stream'
import path from 'path'
import autoprefixer from 'autoprefixer'

const paths = require('./variables');
const $ = gulpLoadPlugins();
const webpackConfig = require('./webpack.config');
const sass = $.sass;
sass.compiler = require('node-sass')

/**
 * generates the source JavaScript files into one JavaScript file
 * @param {*} done 
 * @version 2
 */
function scripts(done) {
  log.info(`Compiling JS file from: ${paths.js.entryFile}`);

  webpackConfig.mode = 'development'

  src(path.resolve(__dirname, paths.js.entryFile))
    .on('error', function(err) {
      log.error(`Error: ${err}`);
      this.emit('end');
    })
    .pipe(webpack({
      config: webpackConfig
    }))
    .pipe(dest(paths.js.outputJSFileLocation));
  done();

  log.info(`Finished compiling: ${paths.js.entryFile}`);
}

/**
 * compiles the source Scss files into one CSS file
 * @param {*} done 
 * @version 2
 */
function styles(done) {
  log.info(`Compiling Scss file from: ${paths.css.mainSassFile}`);

  src(paths.css.mainSassFile)
    .pipe($.sourcemaps.init())
    .pipe(sass({
      includePaths: ['scss'],
      outputStyle: 'expanded',
      onError: browserSync.notify
    }).on('error', sass.logError))
    .pipe($.postcss([ autoprefixer() ]))
    .pipe($.plumber())
    .pipe($.concat(paths.css.outputCSSFile)) // output main CSS file without cleanCSS
    .pipe($.sourcemaps.write('./maps'))
    .pipe(dest(paths.css.outputCSSFileLocation));
  done();

  log.info(`Finished compiling: ${paths.css.mainSassFile}`);
}

/**
 * generates and creates svg icons using #symbol so that we can easily include svg icons into the webpage
 * @param {*} done 
 * @version 2
 */
function svgs(done) {
  log.info(`Generating icons.svg from: ${paths.media.icons}`);

  src(paths.media.icons + '/*.svg')
    .pipe($.svgmin())
    .pipe($.svgstore())
    .pipe($.size({gzip: true, showFiles: true}))
    .pipe(dest(paths.media.iconsCompressed));
  done();  

  log.info(`Icons generated at: ${paths.media.iconsCompressed}`)
}

/**
 * compresses images
 * @param {*} done 
 * @version 2
 */
function imgs(done) {
  log.info(`Compressing Images in: ${paths.media.imgs}`);

  src(paths.media.imgs + '/**/*.{gif,jpg,png,svg,ico}')
    .pipe($.imagemin())
    .pipe($.size({gzip: true, showFiles: true}))
    .pipe(dest(paths.media.imgsCompressed));
  done();

  log.info(`Images compressed at: ${paths.media.imgsCompressed}`);
}

/**
 * generates the source JavaScript files into one JavaScript file ready for production
 * @param {*} done 
 * @version 2
 */
function buildJS(done) {
  log.info(`Building JavaScript File from: ${paths.js.entryFile}`);

  webpackConfig.mode = 'production'

  src(path.resolve(__dirname, paths.js.entryFile))
    .on('error', function(err) {
      log.error(`Error: ${err}`);
      this.emit('end');
    })
    .pipe(webpack({
      config: webpackConfig
    }))
    .pipe(dest(paths.js.outputJSFileLocation))
    .pipe($.size({gzip: true, showFiles: true}));
  done();

  log.info(`JavaScript file built at: ${paths.js.outputJSFileLocation}`);
}

/**
 * compiles the source Scss files into one CSS file ready for production. Also runs SassLint
 * @param {*} done 
 * @version 2
 */
function buildCSS(done) {
  log.info(`Building Stylesheet file from: ${paths.css.mainSassFile}`);

  src(paths.css.mainSassFile)
    .pipe($.sourcemaps.init())
    .pipe(sass({
      includePaths: ['scss'],
      outputStyle: 'expanded',
    }).on('error', sass.logError))
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.postcss([ autoprefixer() ]))
    .pipe($.plumber())
    .pipe($.cleanCss())
    .pipe($.concat(paths.css.outputCSSFileCompressed)) // output main CSS file without cleanCSS
    .pipe(dest(paths.css.outputCSSFileLocation))
    .pipe($.size({gzip: true, showFiles: true}))
  done();

  log.info(`Stylesheet file built at: ${paths.css.outputCSSFileLocation}`);
}

/**
 * watches the .js and .scss files for changes
 * @version 2
 */
function watchFiles() {
  log.info('Watching CSS and JS files for changes. Enjoy!');

  watch(paths.css.sassFiles, series(styles, reloadBrowserSync));
  watch(paths.js.jsFiles, series(scripts, reloadBrowserSync));
}

/**
 * generates BrowserSync session for watching and refreshing page
 * @param {*} done
 * @version 2 
 */
function runBrowserSync(done) {
  log.info(`Starting BrowserSync server at: ${paths.siteURL}`);

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

/**
 * reloads the browser sync session
 * @param {*} done 
 * @version 2
 */
function reloadBrowserSync(done) {
  log.info(`Reloading BrowserSync server at: ${paths.siteURL}`);

  browserSync.reload();
	done();
}

/**
 * list of gulp tasks that are available to run
 * @version v2
 */
task('scripts', scripts);
task('styles', styles);
task('imgs', imgs);
task('svgs', svgs);

task('build:css', buildCSS);
task('build:js', buildJS);
task('build', parallel(buildJS, buildCSS));

task('watch', series(watchFiles, runBrowserSync));
task('default', parallel(scripts, styles));