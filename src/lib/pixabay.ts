import type { Photo } from '@/types'

const API_KEY = process.env.NEXT_PUBLIC_PIXABAY_API_KEY || ''
const BASE = 'https://pixabay.com/api/'

const CATEGORY_MAP: Record<string, string> = {
  people: 'People',
  nature: 'Nature',
  buildings: 'Urban',
  food: 'Art',
  travel: 'Nature',
  animals: 'Nature',
  music: 'Art',
  sports: 'People',
  fashion: 'People',
  science: 'Art',
  education: 'People',
  health: 'People',
  computer: 'Urban',
  fashion_beauty: 'People',
  places: 'Urban',
  computer_electronics: 'Urban',
  industry: 'Urban',
  spirituality: 'Art',
  feelings: 'People',
  health_medical: 'People',
  people_relaxing: 'People',
  background: 'Art',
  experimental: 'Art',
  love: 'People',
  flower: 'Nature',
  textures: 'Art',
  wallpapers: 'Nature',
}

function pickCategory(tags: string): string {
  const parts = tags.toLowerCase().split(',').map(t => t.trim())
  for (const part of parts) {
    if (CATEGORY_MAP[part]) return CATEGORY_MAP[part]
  }
  // fallback heuristics
  const tagStr = tags.toLowerCase()
  if (tagStr.includes('person') || tagStr.includes('people') || tagStr.includes('portrait') || tagStr.includes('face') || tagStr.includes('child') || tagStr.includes('woman') || tagStr.includes('man')) return 'People'
  if (tagStr.includes('city') || tagStr.includes('building') || tagStr.includes('street') || tagStr.includes('urban') || tagStr.includes('architecture') || tagStr.includes('skyline')) return 'Urban'
  if (tagStr.includes('tree') || tagStr.includes('mountain') || tagStr.includes('ocean') || tagStr.includes('lake') || tagStr.includes('sunset') || tagStr.includes('forest') || tagStr.includes('animal') || tagStr.includes('flower') || tagStr.includes('landscape')) return 'Nature'
  return 'Art'
}

function randomDate(): string {
  const year = 2024
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
  return `${year}-${month}`
}

interface PixabayHit {
  id: number
  pageURL: string
  tags: string
  previewURL: string
  webformatURL: string
  largeImageURL: string
  imageWidth: number
  imageHeight: number
  user: string
  userImageURL: string
  likes: number
  views: number
  downloads: number
  comments: number
}

interface PixabayResponse {
  total: number
  totalHits: number
  hits: PixabayHit[]
}

export async function fetchPixabayImages(query = 'photography', perPage = 50): Promise<Photo[]> {
  if (!API_KEY || API_KEY === 'YOUR_PIXABAY_API_KEY_HERE') {
    console.warn('Pixabay API key not configured. Using fallback images.')
    return []
  }

  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    per_page: String(perPage),
    safesearch: 'true',
    editors_choice: 'true',
    orientation: 'all',
  })

  try {
    const res = await fetch(`${BASE}?${params}`)
    if (!res.ok) {
      console.error('Pixabay API error:', res.status, res.statusText)
      return []
    }
    const data: PixabayResponse = await res.json()
    return data.hits.map((hit): Photo => ({
      id: `pixabay-${hit.id}`,
      name: hit.tags.split(',')[0].trim(),
      preview: hit.webformatURL,
      category: pickCategory(hit.tags),
      date: randomDate(),
      width: hit.imageWidth,
      height: hit.imageHeight,
    }))
  } catch (err) {
    console.error('Failed to fetch from Pixabay:', err)
    return []
  }
}

export async function fetchMultipleQueries(count = 50): Promise<Photo[]> {
  const queries = ['nature landscape', 'portrait people', 'urban city', 'art photography', 'wildlife']
  const perQuery = Math.ceil(count / queries.length)
  const results = await Promise.all(
    queries.map(q => fetchPixabayImages(q, perQuery))
  )
  const merged = results.flat()
  // deduplicate by id
  const seen = new Set<string>()
  const unique: Photo[] = []
  for (const p of merged) {
    if (!seen.has(p.id)) { seen.add(p.id); unique.push(p) }
  }
  return unique.slice(0, count)
}
