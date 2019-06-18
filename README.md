# Gulp starter
<a href="https://github.com/benbrehaut/front-end-setup/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
</a>
<a href="https://twitter.com/BenBrehaut">
    <img alt="Twitter: BenBrehaut" src="https://img.shields.io/twitter/follow/BenBrehaut.svg?style=social" target="_blank" />
</a>

> Gulp file starter that can be used on any sort of project. It comes built with Scss, Babel, SVG icon creation, Image minification and BrowserSync.

## Prerequisites
- npm >= 5.0.0
- node >= 8.0.0
- gulp-cli >= 2.2.0

## Install
````bash
npm install
````

## Usage
A list of variables can be found in the ``variables.js`` file where you can adjust to what you need.

### To start developing
````bash
npm run develop
````
This will start to watch the Scss and JavaScript files for changes. It will also kick off BrowserSync, where you can watch for changes.

### To create a build of your Assets
````bash
npm run build
````
This will create a CSS file and a JavaScript file ready for production. 

### To create a SVG icons
````bash
npm run svgs
````
This will generate a svg file for you to include on your page.

### To minify and compress static images
````bash
npm run imgs
````
This will minify and compress images.

## Author
**Ben Brehaut**
- Twitter: [@benbrehaut](https://www.twitter.com/benbrehaut)
- GitHub: [@benbrehaut](https://github.com/benbrehaut/)

## Contributing
Contributions, issues and feature requests are welcome!

## License
Copyright @ 2019 Ben Brehaut

This project is [MIT](https://github.com/benbrehaut/front-end-setup/blob/master/LICENSE) licensed.