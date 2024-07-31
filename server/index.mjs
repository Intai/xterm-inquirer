import config from 'config'
import { startWebSocketServer } from './src/server.mjs'

startWebSocketServer({ port: config.get('port') })
