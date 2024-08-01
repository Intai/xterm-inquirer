import path from 'path'
import pty from 'node-pty'
import http from 'node:http'
import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import WebSocket, { WebSocketServer } from 'ws'
import xterm from '@xterm/headless'
import {
  getCursorLineString,
  getShell,
  isEndOfLine,
  isValidCommandLine,
  setupAliases,
} from './common/utils/shell.mjs'
import { logDebug, logError, logInfo } from './common/utils/logger.mjs'
import { setupExpressApp } from '../../commands/app.mjs'

export async function startServer({ port }) {
  const app = express()
  const server = http.createServer(app)
  const wss = new WebSocketServer({ noServer: true })
  const shell = getShell()

  // setup rest endpoints.
  setupExpressApp(app)
  // listen to websocket connections.
  wss.on('connection', ws => {
    const id = uuidv4()
    logInfo('Connected', id)
    const term = new xterm.Terminal({ allowProposedApi: true })
    let line = ''

    // initialise a shell process.
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cwd: path.resolve('../commands'),
      env: process.env,
      cols: 160,
    })
    // setup shell aliases.
    setupAliases(ptyProcess)
    // print help message.
    ptyProcess.write('help\r')

    // receive key strokes through websocket.
    ws.on('message', async buffer => {
      const message = buffer.toString()
      logDebug('Received message', message)

      // reach the end of a line.
      if (isEndOfLine(message)) {
        // if the line is valid.
        if (isValidCommandLine(line)) {
          // carriage return to execute the line.
          ptyProcess.write(message)
        } else {
          ws.send('\r\nCommand not found')
          // cancel the invalid command.
          ptyProcess.write('\x03')
        }
        line = ''
      } else {
        ptyProcess.write(message)
      }
    })
    // send pty data back to browser to print.
    const listener = ptyProcess.onData(data => {
      if (ws.readyState === WebSocket.OPEN && !data.startsWith('alias ')) {
        logDebug('Send message', data)
        ws.send(data)

        // write to headless xterm.
        term.write(data, () => {
          // to keep track of the current command line at the cursor.
          line = getCursorLineString(term)
        })
      }
    })
    ws.on('close', () => {
      logInfo('Disconnected', id)
      listener.dispose()
      ptyProcess.kill()
    })
    ws.on('error', error => {
      logError('Exception', error)
    })
  })

  server.on('upgrade', (request, socket, head) => {
    // socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
    // socket.destroy()
    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request)
    })
  })

  server.listen(port, () => {
    logInfo(`API ready at http://localhost:${port}`)
    logInfo(`WebSocket ready at ws://localhost:${port}`)
  })
  return wss
}
