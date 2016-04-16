const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const cssnano = require('cssnano')
const path = require('path')

module.exports = {
  entry: './src/main.js',
  output: {
    path: './dist',
    filename: 'bundle.[hash].js',
    publicPath: '/'
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'eslint',
      exclude: /node_modules/
    }],
    loaders: [{
      test: /\.css/,
      loader: 'style!css'
    }, {
      test: /\.scss/,
      loader: 'style!css?modules&importLoaders=1!postcss!sass?sourceMap'
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /icons\/.*\.svg$/,
      loader: 'svg-inline?removeTags=true'
    }, {
      test: /graphics\/.*\.svg$/,
      loader: 'file'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      __BACKEND_ADDR__: JSON.stringify(process.env.BACKEND_ADDR || '')
    }),
    new HtmlWebpackPlugin({
      favicon: 'static/favicon.png',
      template: 'src/index.html'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    })
  ],
  postcss: [
    cssnano({
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 2 versions']
      },
      discardComments: {
        removeAll: true
      },
      safe: true,
    })
  ],
  resolve: {
    root: [path.resolve('./src'), path.resolve('node_modules')],
    extensions: ['', '.js']
  }
}
