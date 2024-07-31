import path from 'path'
import gulp from 'gulp'
import { deleteAsync } from 'del'
import log from 'fancy-log'
import PluginError from 'plugin-error'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import WebpackDevServer from 'webpack-dev-server'
import devConfig from './webpack/dev.config.js'

function clean() {
  return deleteAsync('dist')
}

function devServer() {
  const port = process.env.PORT || 8080
  const compiler = webpack(devConfig)
  const watch = process.env.DISABLE_WATCH !== 'true'

  new WebpackDevServer({
    server: process.env.HTTPS ? 'https' : 'http',
    host: '0.0.0.0',
    allowedHosts: [
      '.xterm-inquirer.dev',
      '.docker.internal',
      'web',
    ],
    port,
    historyApiFallback: true,
    static: {
      directory: path.resolve('static'),
      publicPath: '/static/',
    },
    ...!watch && {
      hot: false,
      liveReload: false,
      webSocketServer: false,
      watchFiles: [],
    },
  }, compiler)
    .startCallback(err => {
      if (err) throw new PluginError('webpack-dev-server', err)
      log('[webpack-dev-server]', 'http://localhost:' + port)
    })
}

function buildClient() {
  return gulp.src('app/index.jsx')
    .pipe(webpackStream(require('./webpack/client.config.js'), webpack))
    .pipe(gulp.dest('dist'))
}

function copyStatic() {
  return gulp.src('static/**/*', { encoding: false })
    .pipe(gulp.dest('dist'))
}

const dev = gulp.series(
  clean,
  devServer,
)

gulp.task('build', gulp.series(
  clean,
  buildClient,
  copyStatic,
))

gulp.task('dev', dev)

gulp.task('default', dev)
