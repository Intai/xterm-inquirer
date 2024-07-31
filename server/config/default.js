module.exports = {
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
  log: {
    level: 5, // LOG_LEVEL_DEBUG
  },
  port: process.env.PORT || 8081,
}
