# Introduction

Command line interface to a server through browser by using [xterm.js](https://www.npmjs.com/package/@xterm/xterm) and [node-pty](https://www.npmjs.com/package/node-pty).

# Getting Started

`docker compose up` to start http://localhost:8080

The repository includes two sample commands `help` and `quiz`. e.g.

They are implemented in `./commands` folder and included in `./server/config/default.js`
```
{
  includeCommands: [
    /^help/,
    'quiz',
  ],
  excludeCommands: [
    /[&|()>\\]/,
  ],
  aliases: {
    help: 'node help/index.mjs',
    quiz: 'node quiz/index.mjs',
  },
}
```