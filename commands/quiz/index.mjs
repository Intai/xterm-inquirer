import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { select } from '@inquirer/prompts'
import chalk from 'chalk'
import { v4 as uuidv4 } from 'uuid'
import { Level } from 'level'
import { decode } from 'html-entities'

const db = new Level('./quiz/database', { valueEncoding: 'json' })

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const toChoice = value => ({
  name: value,
  value,
})

yargs(hideBin(process.argv))
  .scriptName('quiz')
  .version('1.0.0')

  // store random quiz questions into database.
  .command('load', 'Load random quiz questions',
    yargs => yargs
      .version(false)
      .option('number', {
        alias: 'n',
        type: 'number',
        description: 'Number of quiz questions',
      }),
    async argv => {
      const { number = 10 } = argv
      // load random quiz questions from an open api.
      const response = await fetch(`https://opentdb.com/api.php?amount=${number}`)
      const json = await response.json()
      await db.open()
      await db.clear()
      await Promise.all(json.results.map(result => db.put(`quiz.question.${uuidv4()}`, result)))
      await db.close()
      console.log(`Loaded ${json.results.length} questions`)
      console.log(`Run ${chalk.cyan('quiz play')} to start`)
    },
  )

  // ask quiz questions stored in database.
  .command('play', 'Ask quiz questions',
    yargs => yargs.version(false),
    async () => {
      await db.open()
      const values = await db.values().all()

      for (const quiz of values) {
        const answer = await select({
          message: decode(quiz.question.trim()),
          // shuffle correct and incorrect answers.
          choices: shuffleArray([
            toChoice(quiz.correct_answer),
            ...quiz.incorrect_answers.map(toChoice),
          ]),
        })
        // if the selected answer is incorrect.
        if (answer !== quiz.correct_answer) {
          // print the correct answer.
          console.log('Correct answer is', chalk.red(quiz.correct_answer))
        }
      }
      if (values.length <= 0) {
        console.log(`Run ${chalk.cyan('quiz load')} to load quiz questions first`)
      }
      await db.close()
    })
  .demandCommand()
  .parse()
