var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ESLintPlugin = require('eslint-webpack-plugin')
var config = require('config')
var env = (process.env.NODE_ENV === 'production') ? 'prod' : 'dev'
var watch = process.env.DISABLE_WATCH !== 'true'

module.exports = {
  mode: 'development',
  context: path.join(__dirname, '../app'),
  entry: [
    './index',
  ],
  cache: watch
    ? {
      type: 'filesystem',
      name: `${config.util.getEnv('NODE_ENV')}-development`,
      cacheDirectory: path.join(__dirname, '../.cache/webpack'),
    }
    : {
      type: 'memory',
    },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      CONFIG: webpack.DefinePlugin.runtimeValue(() => JSON.stringify(config.util.loadFileConfigs()), {
        contextDependencies: [
          path.join(__dirname, '../../.env'),
          path.join(__dirname, '../config'),
        ],
      }),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: '../app/index.ejs',
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      exclude: 'node_modules',
      emitWarning: false,
      lintDirtyModulesOnly: true,
    }),
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', `.${env}.js`, `.${env}.jsx`],
    symlinks: false,
    alias: {
      app: path.join(__dirname, '../app'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }, {
        test: /\.css$/i,
        include: /node_modules\/@xterm\/xterm/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/',
    filename: 'dev.js',
  },
}
