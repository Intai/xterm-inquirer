module.exports = {
  websocket: {
    uri: process.env.WEBSOCKET_URI || 'ws://localhost:8081',
  },
  log: {
    level: 5, // LOG_LEVEL_DEBUG
  },
  staticUri: '/static',
  timestamp: '',
}
