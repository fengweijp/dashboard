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
      test: /\.svg$/,
      loader: 'svg-sprite!svgo?' + JSON.stringify({
        plugins: [{
          removeStyleElement: true,
          removeAttrs: { attrs: ['fill', 'style'] }
        }]
      })
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new HtmlWebpackPlugin({
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
