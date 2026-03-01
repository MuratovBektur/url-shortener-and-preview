import { Router, Request, Response } from 'express'
import isUrl from 'is-url'
import urlService from './url.service'
import { apiPrefix } from '../../constants'


const router = Router()

// POST /api/url — создать короткую ссылку
router.post('/', async (req: Request, res: Response) => {
  const { url } = req.body as { url?: string }

  if (!url || typeof url !== 'string' || !url.trim()) {
    res.status(400).json({ error: 'URL is required' })
    return
  }

  const trimmed = url.trim()

  if (!isUrl(trimmed)) {
    res.status(400).json({
      error: 'Invalid URL. Please provide a valid URL.',
    })
    return
  }

  try {
    const record = await urlService.create(trimmed)

    const baseUrl = process.env.BASE_URL
    if (!baseUrl) {
      res.json(500).json({
        message: 'baseUrl not defined'
      })
    }

    res.status(201).json({
      id: record.id,
      shortCode: record.shortCode,
      baseUrl: baseUrl,
      shortUrl: `${baseUrl}/${apiPrefix}/${record.shortCode}`,
      originalUrl: record.originalUrl,
      title: record.title,
      description: record.description,
      imageUrl: record.imageUrl,
      clicks: record.clicks,
      createdAt: record.createdAt,
    })
  } catch (err) {
    console.error('[POST /api/url]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/url — список всех ссылок
router.get('/', async (_req: Request, res: Response) => {
  try {
    const records = await urlService.getAll()
    res.json(records)
  } catch (err) {
    console.error('[GET /api/url]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/url/:code — получить метаданные без редиректа
router.get('/:code', async (req: Request, res: Response) => {
  const { code } = req.params

  if (!code || typeof code !== 'string' || !code.trim()) {
    res.status(400).json({ error: 'URL is required' })
    return
  }

  try {
    const record = await urlService.getByCode(code)
    if (!record) {
      res.status(404).json({ error: 'Short URL not found' })
      return
    }
    res.json(record)
  } catch (err) {
    console.error('[GET /api/url/:code]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router