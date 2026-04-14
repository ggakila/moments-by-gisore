export interface Photo {
  id: string
  name: string
  preview: string
  category: string
  date: string
  tags?: string[]
  liked?: boolean
  folder?: string | null
  width?: number
  height?: number
}

export interface Folder {
  id: string
  name: string
  cover?: string | null
}

export type Category = 'All' | 'People' | 'Nature' | 'Urban' | 'Art' | 'Uploads'

export type ViewMode = 'grid' | 'list' | 'horizontal'
