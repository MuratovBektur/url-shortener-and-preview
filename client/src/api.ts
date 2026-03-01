import axios from 'axios'

const api = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface UrlResult {
  id: string
  shortCode: string
  shortUrl: string
  originalUrl: string
  title: string | null
  description: string | null
  imageUrl: string | null
  clicks: number
  createdAt: string
}

export interface ShortenPayload {
  url: string
}

export const urlApi = {
  shorten: (payload: ShortenPayload) =>
    api.post<UrlResult>('url', payload),

  getAll: () =>
    api.get<UrlResult[]>('url'),
}

export default api