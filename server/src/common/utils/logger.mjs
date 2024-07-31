/* eslint-disable no-console */

import util from 'util'
import config from 'config'

export const LOG_LEVEL_NONE = 0
export const LOG_LEVEL_FATAL = 1
export const LOG_LEVEL_ERROR = 2
export const LOG_LEVEL_WARN = 3
export const LOG_LEVEL_INFO = 4
export const LOG_LEVEL_DEBUG = 5
export const LOG_LEVEL_TRACE = 6

export const inspect = data => util.inspect(data, {
  showHidden: false,
  depth: null,
  colors: true,
})

export const logTrace = (msg, data = '') => {
  if (config.get('log').level >= LOG_LEVEL_TRACE) {
    const inspected = data && inspect(data)
    if (console.debug) {
      console.debug(msg, inspected)
    } else {
      console.log(`TRACE: ${msg}`, inspected)
    }
  }
}

export const logDebug = (msg, data = '') => {
  if (config.get('log').level >= LOG_LEVEL_DEBUG) {
    const inspected = data && inspect(data)
    if (console.debug) {
      console.debug(msg, inspected)
    } else {
      console.log(`DEBUG: ${msg}`, inspected)
    }
  }
}

export const logInfo = (msg, data = '') => {
  if (config.get('log').level >= LOG_LEVEL_INFO) {
    const inspected = data && inspect(data)
    if (console.info) {
      console.info(msg, inspected)
    } else {
      console.log(`INFO: ${msg}`, inspected)
    }
  }
}

export const logWarn = (msg, data = '') => {
  if (config.get('log').level >= LOG_LEVEL_WARN) {
    const inspected = data && inspect(data)
    if (console.warn) {
      console.warn(msg, inspected)
    } else {
      console.log(`WARNING: ${msg}`, inspected)
    }
  }
}

export const logError = (msg, data = '') => {
  if (config.get('log').level >= LOG_LEVEL_ERROR) {
    const inspected = data && inspect(data)
    if (console.error) {
      console.error(msg, inspected)
    } else {
      console.log(`ERROR: ${msg}`, inspected)
    }
  }
}

export const logFatal = (msg, data = '') => {
  if (config.get('log').level >= LOG_LEVEL_FATAL) {
    const inspected = data && inspect(data)
    if (console.error) {
      console.error(`\x1b[31mFATAL: ${msg}\x1b[0m`, inspected)
    } else {
      console.log(`FATAL: ${msg}`, inspected)
    }
  }
}
