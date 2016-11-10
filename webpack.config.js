'use strict'

const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
  entry: './src',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  target: 'web',
  // devtool: 'eval',
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.glsl$/,
      loaders: ['raw', 'glslify'],
      exclude: /node_modules/
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'WhitestormJS Scene',
      template: './src/index.html'
    }),
    new webpack.NormalModuleReplacementPlugin(/inline\-worker/, 'webworkify-webpack'),
    new CopyWebpackPlugin([{
      from: './public',
      to: '.'
    }])
  ],
  externals: {
    '../physics/index.js': 'var false',
    './physics/index.js': 'var false'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true,
    inline: true,
    progress: true
  }
}

if (process.env.NODE_ENV === 'production') {
  config.plugins = config.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        hoist_funs: false, // Turn this off to prevent errors with Ammo.js
        warnings: false
      },
      minimize: true
    }),
    new webpack.optimize.DedupePlugin()
  ])
}

module.exports = config
