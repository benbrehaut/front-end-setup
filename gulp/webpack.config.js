const path = require('path');
const webpack = require('webpack');
const paths = require('./variables');

module.exports = {
    entry: [
      path.resolve(__dirname + paths.js.entryFile)
    ],
    output: { 
        path: path.resolve(__dirname + paths.js.outputJSFileLocation),
        filename: paths.js.outputJSFileCompressed 
    },
    devtool: "sourcemap",
    externals: {
        
    },    
    module: {   
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          }
        }
      ]
    },
    mode: 'production'
}