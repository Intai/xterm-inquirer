import '@xterm/xterm/css/xterm.css'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { ClipboardAddon } from '@xterm/addon-clipboard'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { AttachAddon } from '@xterm/addon-attach'

const ws = new WebSocket(CONFIG.websocket.uri)
const term = new Terminal({ cursorBlink: true })
const fitAddon = new FitAddon()

term.loadAddon(fitAddon)
term.loadAddon(new ClipboardAddon())
term.loadAddon(new WebLinksAddon())
term.loadAddon(new AttachAddon(ws))
term.open(document.getElementById('app'))
fitAddon.fit()
