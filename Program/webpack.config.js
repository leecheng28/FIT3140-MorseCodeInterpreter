/**
<<<<<<< HEAD
 * FIT3140 - Assignment 5. Team 29. Matthew Ready and Li Cheng.
 *
 * webpack.config.js - Defines how webpack takes modules with dependencies and
 * generate static assets representing those modules.
 */

// Import libraries
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevServer = process.argv.find(v => v.indexOf('webpack-dev-server') !== -1);

// Definition of any plugins.
var plugins = []

if (!isDevServer) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  plugins.push(new webpack.optimize.OccurenceOrderPlugin());
}

module.exports = {

  // Here the application starts executing, webpack starts building
  entry: {
    client: './client.js'
  },

  // how webpack emits the results
  output: {
    path: './public',
    publicPath: '/',
    filename: '[name].entry.js',
    chunkFilename: "[id].chunk.js"
  },

  // supply connection port number
  devServer: {
    inline: true,
    port: 3333
  },

  // configuration regarding modules
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.css$/,
        loaders: ["style", "css"]
      },
      // Needed for the custom font.
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,  loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=image/svg+xml" }
    ]
  },
  sassLoader: {
    includePaths: ["./sass"]
  },
  plugins: plugins
}
