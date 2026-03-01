import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import * as cheerio from 'cheerio'
import crypto from 'crypto'

const prisma = new PrismaClient()

export interface OgMetadata {
  title: string | null
  description: string | null
  imageUrl: string | null
}

export interface UrlRecord {
  id: string
  shortCode: string
  originalUrl: string
  title: string | null
  description: string | null
  imageUrl: string | null
  clicks: number
  createdAt: Date
}

class UrlService {
  private generateShortCode(length = 7): string {
    return crypto.randomBytes(length).toString('base64url').slice(0, length)
  }

  private async fetchOgMetadata(url: string): Promise<OgMetadata> {
    try {
      const response = await axios.get<string>(url, {
        timeout: 8000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; URLShortenerBot/1.0)',
          Accept: 'text/html,application/xhtml+xml',
        },
        maxRedirects: 5,
      })

      const $ = cheerio.load(response.data)

      const getMeta = (property: string): string | null =>
        $(`meta[property="${property}"]`).attr('content') ||
        $(`meta[name="${property}"]`).attr('content') ||
        null

      const title =
        getMeta('og:title') ||
        getMeta('twitter:title') ||
        $('title').first().text().trim() ||
        null

      const description =
        getMeta('og:description') ||
        getMeta('twitter:description') ||
        getMeta('description') ||
        null

      const imageUrl =
        getMeta('og:image') ||
        getMeta('twitter:image') ||
        getMeta('twitter:image:src') ||
        null

      return { title, description, imageUrl }
    } catch {
      return { title: null, description: null, imageUrl: null }
    }
  }

  async create(originalUrl: string): Promise<UrlRecord> {
    const existing = await prisma.url.findUnique({ where: { originalUrl } })
    if (existing) return existing

    const shortCode = this.generateShortCode()
    const metadata = await this.fetchOgMetadata(originalUrl)

    return prisma.url.create({
      data: {
        shortCode,
        originalUrl,
        title: metadata.title,
        description: metadata.description,
        imageUrl: metadata.imageUrl,
      },
    })
  }

  async getByCode(shortCode: string): Promise<UrlRecord | null> {
    return prisma.url.findUnique({ where: { shortCode } })
  }

  async incrementClicks(shortCode: string): Promise<void> {
    await prisma.url.update({
      where: { shortCode },
      data: { clicks: { increment: 1 } },
    })
  }

  async getAll(): Promise<UrlRecord[]> {
    return prisma.url.findMany({ orderBy: { createdAt: 'desc' } })
  }
}

export default new UrlService()