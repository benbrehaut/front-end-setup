/**
 * variables
 * variables which are used in gulp and webpack
 */

/**
 * directory paths
 * this should only be used within this file
 * @private
 */
const dir = {
  src: './assets/src',
  dist: './assets/dist',
  views: './templates'
};

module.exports = {
  /**
   * browserSync
   * All variables and configuration that are used for browserSync
   * browserSync.proxy - if you have a server set up on your machine (MAMP, Vagrant etc.)
   * browserSync.siteURL - if you have proxy enabled, add your site URL
   * browserSync.files - list of files to watch for changes and refresh session
   * browserSync.localServer - if you are working with static HTML and do not have a server
   * browserSync.baseDir - location of where static HTML is stored
   */
  browserSync: {
    proxy: false,
    siteURL: 'www.your-url.com',
    files: [
      `${dir.views}/*.html`,
      `${dir.views}/**/*.html`,
      `${dir.dist}/js`,
      `${dir.dist}/css`
    ],
    localServer: true, // if you want to use the in-built browserSync server
    baseDir: [
      dir.views,
      dir.dist
    ]
  },

  /**
   * js
   * JavaScript variables that are used in gulp and webpack
   * js.jsFiles - files that should be watched for changes
   * js.entryFile - the entry file that webpack will use to bundle JavaScript files
   * js.outputJSFileCompressed - the name of the JS file that has been merged and bunblded together
   * js.outputJSFileLocation - the location of where outputJSFileCompressed will go 
   */
  js: { 
    jsFiles: `${dir.src}/js/**/*.js`,
    entryFile: `${dir.src}/js/main.js`,
    outputJSFileCompressed: `main.js`,
    outputJSFileLocation: `${dir.dist}/js`,
  },

  /**
   * css
   * CSS variables that are used in gulp and webpack
   * css.sassFiles - files that should be watched for changes
   * css.mainSassFile - the main Sass file that will be compiled into CSS
   * css.criticalSassFile - the main Sass file that will generate a critical CSS file
   * css.outputCriticalCSSFile - the compiled CSS file from criticalSassFile
   * css.outputCSSFileLocation - the location of where compiled CSS files will go
   * css.criticalTemplateFile - the file that will include the contents if critical.css in a <style> tag, this file can then be included through a server side programming language
   */
  css: {
    sassFiles: `${dir.src}/scss/**/*.scss`,
    mainSassFile: `${dir.src}/scss/style.scss`,
    criticalSassFile: `${dir.src}/scss/critical.scss`,
    outputCriticalCSSFile: `critical.css`,
    outputCSSFileLocation: `${dir.dist}/css`,
    criticalTemplateFile: `critical.html`
  },

  /**
   * media
   * Variables used in the SVG and Image tasks
   * media.imgs - source image files that you want to compress
   * media.imgsCompressed - the location of where the compressed files will go
   * media.icons - source SVG files that you want to merge into a SVG sprite
   * media.iconsCompressed - the area where the SVG sprite will be placed
   */
  media: {
    imgs: `${dir.src}/img`,
    imgsCompressed: `${dir.dist}/img`,
    icons: `${dir.src}/icons`,
    iconsCompressed: `${dir.dist}/icons`
  }
}
