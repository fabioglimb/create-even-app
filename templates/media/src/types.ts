export type MediaCategory = 'Photos' | 'Artwork' | 'Screenshots'

export interface GalleryItem {
  id: string
  title: string
  category: MediaCategory
  date: string
  gradient: string
}

export interface AudioTrack {
  id: string
  title: string
  artist: string
  duration: string
  durationSeconds: number
}

export interface UploadItem {
  id: string
  name: string
  size: string
  type: string
  timestamp: number
}

export const CATEGORIES: MediaCategory[] = ['Photos', 'Artwork', 'Screenshots']
export const ALL_FILTER = 'All'
export type CategoryFilter = typeof ALL_FILTER | MediaCategory
