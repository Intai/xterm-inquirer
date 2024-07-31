var path = require('path')
var webpack = require('webpack')
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var HtmlWebpackPlugin = require('html-webpack-plugin')
var config = require('config')
var timestamp = config.get('timestamp')
var env = (process.env.NODE_ENV === 'production') ? 'prod' : 'dev'

module.exports = {
  mode: 'production',
  context: path.join(__dirname, '../app'),
  entry: [
    './index',
  ],
  performance: {
    hints: 'warning',
    maxAssetSize: 500000,
    maxEntrypointSize: 3000000,
  },
  optimization: {
    // chunkIds: 'named',
    splitChunks: {
      chunks: 'all',
      maxInitialSize: 1500000,
    },
  },
  plugins: [
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    // }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(config),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: '../app/index.ejs',
      minify: {
        collapseWhitespace: true,
      },
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
        loader: 'babel-loader',
        exclude: /node_modules/,
      }, {
        test: /\.css$/i,
        include: /node_modules\/@xterm\/xterm/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: `/static-${timestamp}/`,
    filename: '[name].[contenthash].client.js',
    chunkFilename: '[name].[chunkhash].client.js',
  },
}
