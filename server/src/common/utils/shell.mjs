import os from 'os'
import config from 'config'
import { all, any, complement, flip, forEachObjIndexed, identity, startsWith, test, useWith } from 'ramda'
import { logInfo } from './logger.mjs'

export const getShell = () => {
  const platform = os.platform()
  const release = os.release()
  logInfo(`OS ${platform} ${release}`)

  switch (platform) {
  case 'win32':
    return 'powershell.exe'
  case 'linux':
    return 'sh'
  default:
    return 'bash'
  }
}

export const isEndOfLine = startsWith('\r')

const getRuleRegex = rule => typeof rule === 'string' ? new RegExp(`^${rule}`) : rule

const powershellRegex = /^PS.*> /

const bashRegex = /^bash.*\$ /

const shRegex = /^.*# /

const isCommandAfterPrompt = line => {
  switch (os.platform()) {
  case 'win32':
    return powershellRegex.test(line)
  case 'linux':
    return shRegex.test(line)
  default:
    return bashRegex.test(line)
  }
}

const extractCommandAfterPrompt = line => {
  switch (os.platform()) {
  case 'win32':
    return line.replace(powershellRegex, '')
  case 'linux':
    return line.replace(shRegex, '')
  default:
    return line.replace(bashRegex, '')
  }
}

const isMatchCommand = useWith(
  flip(test), [
    identity,
    getRuleRegex,
  ],
)

export const isValidCommandLine = line => {
  // if there is command after the prompt.
  if (isCommandAfterPrompt(line)) {
    const command = extractCommandAfterPrompt(line).trim()
    if (!command) {
      return true
    }
    // check if the command is valid.
    const includeCommands = config.get('includeCommands')
    const excludeCommands = config.get('excludeCommands')
    return any(isMatchCommand(command), includeCommands)
      && all(complement(isMatchCommand(command)), excludeCommands)
  }
  return true
}

// setup aliases in the shell process.
export const setupAliases = ptyProcess => {
  const aliases = config.get('aliases')
  forEachObjIndexed(
    (command, alias) => ptyProcess.write(
      os.platform() === 'win32'
        ? `Set-Alias -Name ${alias} -Value "${command}"\r`
        : `alias ${alias}='${command}'\r`),
    aliases,
  )
}

// get the current command line at the cursor.
export const getCursorLineString = term => term.buffer.active
  .getLine(term.buffer.active.cursorY)
  .translateToString(true)
