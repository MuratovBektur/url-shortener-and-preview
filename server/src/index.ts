import express, { Request, Response } from 'express'
import cors from 'cors'
import urlRoutes from './modules/url/url.controller'
import urlService from './modules/url/url.service'
import { apiPrefix } from './constants'

const app = express()
const PORT = process.env.PORT ?? 5000

app.use(cors())
app.use(express.json())

app.use(`/${apiPrefix}/url`, urlRoutes)

// GET /:code — редирект на оригинальный URL
app.get(`/${apiPrefix}/:code`, async (req: Request, res: Response) => {
  const { code } = req.params

  if (code === 'favicon.ico') {
    res.status(204).end()
    return
  }

  if (typeof code !== 'string') {
    res.status(404).json({ error: 'code is not string' })
    return
  }

  try {
    const record = await urlService.getByCode(code)
    if (!record) {
      res.status(404).json({ error: 'Short URL not found' })
      return
    }

    await urlService.incrementClicks(code)
    res.redirect(301, record.originalUrl)
  } catch (err) {
    console.error('[GET /:code]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})