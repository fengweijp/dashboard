const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const cssnano = require('cssnano')
const path = require('path')

module.exports = {
  entry: './src/main.js',
  output: {
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
      loader: 'style!css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap',
      exclude: /node_modules/
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
      __BACKEND_ADDR__: '"http://localhost:60000"'
    }),
    new HtmlWebpackPlugin({
      favicon: 'static/favicon.png',
      template: 'src/index.html'
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
      sourcemap: true
    })
  ],
  resolve: {
    root: [path.resolve('./src'), path.resolve('node_modules')],
    extensions: ['', '.js']
  }
}
