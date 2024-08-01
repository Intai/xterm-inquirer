import { once } from 'ramda'
import path from 'path'
import { fileURLToPath } from 'url'
import { Level } from 'level'

export const getDatabase = once(() => {
  const __filename = fileURLToPath(import.meta.url)
  return new Level(
    path.join(path.dirname(__filename), 'database'), {
      valueEncoding: 'json',
      passive: true,
    },
  )
})

export const setupExpressApp = app => {
  app.get('/quiz', async (req, res) => {
    const db = getDatabase()
    await db.open()
    const values = await db.values().all()
    await db.close()
    res.send(values)
  })
}
