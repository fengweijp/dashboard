const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const cssnano = require('cssnano')
const path = require('path')

module.exports = {
  entry: './src/main',
  output: {
    path: './dist',
    filename: 'bundle.[hash].js',
    publicPath: '/',
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'eslint',
      exclude: /node_modules/,
    }, {
      test: /\.ts(x?)$/,
      loader: 'tslint',
      exclude: /node_modules/,
    }],
    loaders: [{
      test: /\.json/, // TODO check if still needed
      loader: 'json',
    }, {
      test: /\.css/,
      loader: 'style!css',
    }, {
      test: /\.scss/,
      loader: 'style!css?modules&importLoaders=1!postcss!sass?sourceMap',
    }, {
      test: /\.ts(x?)$/,
      loader: 'babel!ts',
      exclude: /node_modules/,
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
    }, {
      test: /\.mp3$/,
      loader: 'file',
    }, {
      test: /icons\/.*\.svg$/,
      loader: 'raw!svgo?{"plugins":[{"removeStyleElement":true}]}',
    }, {
      test: /graphics\/.*\.svg$/,
      loader: 'file',
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      __BACKEND_ADDR__: JSON.stringify(process.env.BACKEND_ADDR.toString()),
      __SEGMENT_TOKEN__: '"M96lXuD90ZxkbQEQG716aySwBLllabOn"',
      __ENABLE_SEGMENT__: true,
      __SMOOCH_TOKEN__: '"505tvtkv5udrd4kc5dbpppa6x"',
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      },
    }),
    new HtmlWebpackPlugin({
      favicon: 'static/favicon.png',
      template: 'src/index.html',
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
      }
    }),
  ],
  postcss: [
    cssnano({
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 2 versions'],
      },
      discardComments: {
        removeAll: true,
      },
      safe: true,
    })
  ],
  resolve: {
    root: [path.resolve('./src'), path.resolve('node_modules')],
    extensions: ['', '.js', '.ts', '.tsx'],
  }
}
