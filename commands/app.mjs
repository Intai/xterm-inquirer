import { juxt, pluck } from 'ramda'
import * as QuizApp from './quiz/app.mjs'

export const setupExpressApp = juxt(
  pluck('setupExpressApp', [
    QuizApp,
  ]),
)
