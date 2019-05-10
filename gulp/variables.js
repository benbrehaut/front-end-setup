/**
 * variables
 * @description variables which contain things used throughout this file
 */

// Dirctories
const dir = {
  src: './../assets/src',
  dist: './../assets/dist'
};

module.exports = {
// Site URL for Browser Sync
siteURL: 'www.your-url.com',

// Main JS Variables
js: { 
  jsFiles: `${dir.src}/js/**/*.js`,
  entryFile: `${dir.src}/js/main.js`,
  outputJSFileCompressed: `main.js`,
  outputJSFileLocation: `${dir.dist}/js`,
},

// Main CSS Variables
css: {
  sassFiles: `${dir.src}/scss/**/*.scss`,
  mainSassFile: `${dir.src}/scss/style.scss`,
  outputCSSFile: `main.css`,
  outputCSSFileCompressed: `main.css`,
  outputCSSFileLocation: `${dir.dist}/css`
},

// Media Variables
media: {
  imgs: `${dir.src}/img`,
  imgsCompressed: `${dir.dist}/img`,
  icons: `${dir.src}/icons`,
  iconsCompressed: `${dir.dist}/icons`
}
}
