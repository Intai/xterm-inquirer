import config from 'config'
import { startServer } from './src/server.mjs'

startServer({ port: config.get('port') })
