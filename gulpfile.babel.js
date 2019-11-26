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
import customProperties from 'postcss-custom-properties'

const paths = require('./variables');
const $ = gulpLoadPlugins();
const webpackConfig = require('./webpack.config');
const sass = $.sass;
sass.compiler = require('node-sass')

/**
 * scripts
 * generates the source JavaScript files into one JavaScript file
 * @param {*} done 
 * @version 2
 */
function scripts(done) {
  log.info(`Compiling JS file from: ${paths.js.entryFile}`);

  webpackConfig.mode = 'development'

  return src(path.resolve(__dirname, paths.js.entryFile))
    .on('error', function(err) {
      log.error(`Error: ${err}`);
      this.emit('end');
    })
    .pipe(webpack({
      config: webpackConfig
    }))
    .pipe(dest(paths.js.outputJSFileLocation))
    .on('end', () => {
      log.info(`Finished compiling JS Files`);
      done();
    });
}

/**
 * styles
 * compiles the source Scss files into CSS files
 * @param {*} done 
 * @version 2
 */
function styles(done) {
  log.info(`Compiling Scss`);

  return src([paths.css.mainSassFile, paths.css.criticalSassFile])
    .pipe($.sourcemaps.init())
    .pipe(sass({
      includePaths: ['scss'],
      outputStyle: 'expanded',
      onError: browserSync.notify
    }).on('error', sass.logError))
    .pipe($.postcss([ autoprefixer(), customProperties() ]))
    .pipe($.plumber())
    .pipe($.sourcemaps.write('./maps'))
    .pipe(dest(paths.css.outputCSSFileLocation))
    .on('end', () => {
      log.info(`Finished compiling Scss`);
      done();
    });
}

/**
 * svgs
 * generates and creates svg icons using #symbol so that we can easily include svg icons into the webpage
 * @param {*} done 
 * @version 2
 */
function svgs(done) {
  log.info(`Generating icons.svg from: ${paths.media.icons}`);

  return src(paths.media.icons + '/*.svg')
    .pipe($.svgmin())
    .pipe($.svgstore())
    .pipe($.size({gzip: true, showFiles: true}))
    .pipe(dest(paths.media.iconsCompressed))
    .on('end', () => {
      log.info(`Icons generated at: ${paths.media.iconsCompressed}`)
      done();  
    })
}

/**
 * imgs
 * compresses images
 * @param {*} done 
 * @version 2
 */
function imgs(done) {
  log.info(`Compressing Images in: ${paths.media.imgs}`);

  return src(paths.media.imgs + '/**/*.{gif,jpg,png,svg,ico}')
    .pipe($.imagemin())
    .pipe($.size({gzip: true, showFiles: true}))
    .pipe(dest(paths.media.imgsCompressed))
    .on('end', () => {
      log.info(`Images compressed at: ${paths.media.imgsCompressed}`);
      done();
    });
}

/**
 * buildJS
 * generates the source JavaScript files into one JavaScript file ready for production
 * @param {*} done 
 * @version 2
 */
function buildJS(done) {
  log.info(`Building JavaScript File from: ${paths.js.entryFile}`);

  webpackConfig.mode = 'production'

  return src(path.resolve(__dirname, paths.js.entryFile))
    .on('error', function(err) {
      log.error(`Error: ${err}`);
      this.emit('end');
    })
    .pipe(webpack({
      config: webpackConfig
    }))
    .pipe(dest(paths.js.outputJSFileLocation))
    .pipe($.size({gzip: true, showFiles: true}))
    .on('end', () => {
      log.info(`JavaScript file built at: ${paths.js.outputJSFileLocation}`);
      done();
    })
}

/**
 * buildCSS
 * compiles the source Scss files into CSS files ready for production. Also runs SassLint
 * @param {*} done 
 * @version 2
 */
function buildCSS(done) {
  log.info(`Building Stylesheet files`);

  return src([paths.css.mainSassFile, paths.css.criticalSassFile])
    .pipe($.sourcemaps.init())
    .pipe(sass({
      includePaths: ['scss'],
      outputStyle: 'expanded',
    }).on('error', sass.logError))
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.postcss([ autoprefixer(), customProperties() ]))
    .pipe($.plumber())
    .pipe($.cleanCss())
    .pipe(dest(paths.css.outputCSSFileLocation))
    .pipe($.size({gzip: true, showFiles: true}))
    .on('end', () => {
      log.info(`Stylesheets file built at: ${paths.css.outputCSSFileLocation}`);
      done();
    })
}

/**
 * criticalCSS
 * Takes the critical css file and injects it into a template file
 * @param {*} done 
 * @version 2
 */
function criticalCSS(done) {
  log.info(`Moving stylesheet from: ${paths.css.outputCSSFileLocation}/${paths.css.outputCriticalCSSFile}`);

  return src(paths.css.criticalTemplateFile)
    .pipe($.inject(src(`${paths.css.outputCSSFileLocation}/${paths.css.outputCriticalCSSFile}`), {
      starttag: '/* inject:critical:css */',
      endtag: '/* endinject */',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(dest('./templates/'))
    .on('end', () => {
      log.info(`Critical CSS added to template file at ${paths.css.criticalTemplateFile}`);
      done();
    });
}

/**
 * watches the .js and .scss files for changes
 * @version 2
 */
function watchFiles() {
  log.info('Watching CSS and JS files for changes. Enjoy!');

  watch(paths.css.sassFiles, series(styles, criticalCSS, reloadBrowserSync));
  watch(paths.js.jsFiles, series(scripts, reloadBrowserSync));
}

/**
 * generates BrowserSync session for watching and refreshing page
 * @param {*} done
 * @version 2 
 */
function runBrowserSync(done) {
  log.info(`Starting BrowserSync...`);

  // if proxy mode
  if (paths.browserSync.hasProxy) {
    browserSync.init({
      proxy: paths.browserSync.siteURL,
      files: paths.browserSync.files,
    });
  }
  // else if local server
  else if (paths.browserSync.localServer) {
    browserSync.init({
      server: {
          baseDir: paths.browserSync.baseDir
      },
      files: paths.browserSync.files
    });
  }
  else {
    throw Error('Please enter a proxy or a point to local files.');
    done();
  }
  done();
}

/**
 * reloads the browser sync session
 * @param {*} done 
 * @version 2
 */
function reloadBrowserSync(done) {
  log.info(`Reloading BrowserSync...`);

  browserSync.reload({ stream: true });
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

task('build:css', series(buildCSS, criticalCSS));
task('build:js', buildJS);
task('build', parallel(buildJS, series(buildCSS, criticalCSS)));

task('watch', series(runBrowserSync, watchFiles));
task('default', parallel(scripts, styles));