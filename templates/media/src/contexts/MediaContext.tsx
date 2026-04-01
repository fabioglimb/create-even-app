import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { GalleryItem, AudioTrack, UploadItem, CategoryFilter } from '../types'
import { ALL_FILTER } from '../types'

interface MediaContextValue {
  galleryItems: GalleryItem[]
  audioTracks: AudioTrack[]
  uploads: UploadItem[]
  addUpload: (name: string, size: string, type: string) => void
  removeUpload: (id: string) => void
  clearUploads: () => void
  selectedCategory: CategoryFilter
  setSelectedCategory: (c: CategoryFilter) => void
  filteredGallery: GalleryItem[]
  selectedTrackId: string | null
  setSelectedTrackId: (id: string | null) => void
  gridColumns: 2 | 3
  setGridColumns: (cols: 2 | 3) => void
}

const MediaContext = createContext<MediaContextValue | null>(null)

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
]

const SAMPLE_GALLERY: GalleryItem[] = [
  { id: 'g1', title: 'Mountain Sunrise', category: 'Photos', date: '2026-03-28', gradient: GRADIENTS[0] },
  { id: 'g2', title: 'City Skyline', category: 'Photos', date: '2026-03-27', gradient: GRADIENTS[1] },
  { id: 'g3', title: 'Abstract Waves', category: 'Artwork', date: '2026-03-26', gradient: GRADIENTS[2] },
  { id: 'g4', title: 'Digital Garden', category: 'Artwork', date: '2026-03-25', gradient: GRADIENTS[3] },
  { id: 'g5', title: 'App Dashboard', category: 'Screenshots', date: '2026-03-24', gradient: GRADIENTS[4] },
  { id: 'g6', title: 'Ocean Breeze', category: 'Photos', date: '2026-03-23', gradient: GRADIENTS[5] },
  { id: 'g7', title: 'Neon Portrait', category: 'Artwork', date: '2026-03-22', gradient: GRADIENTS[0] },
  { id: 'g8', title: 'Settings Panel', category: 'Screenshots', date: '2026-03-21', gradient: GRADIENTS[1] },
  { id: 'g9', title: 'Forest Trail', category: 'Photos', date: '2026-03-20', gradient: GRADIENTS[3] },
  { id: 'g10', title: 'Pixel Mosaic', category: 'Artwork', date: '2026-03-19', gradient: GRADIENTS[4] },
]

const SAMPLE_TRACKS: AudioTrack[] = [
  { id: 't1', title: 'Morning Light', artist: 'Ambient Waves', duration: '3:42', durationSeconds: 222 },
  { id: 't2', title: 'Deep Focus', artist: 'Lo-Fi Beats', duration: '4:15', durationSeconds: 255 },
  { id: 't3', title: 'Evening Calm', artist: 'Nature Sounds', duration: '5:08', durationSeconds: 308 },
  { id: 't4', title: 'City Rain', artist: 'White Noise Co', duration: '2:56', durationSeconds: 176 },
]

export function MediaProvider({ children }: { children: ReactNode }) {
  const [galleryItems] = useState<GalleryItem[]>(SAMPLE_GALLERY)
  const [audioTracks] = useState<AudioTrack[]>(SAMPLE_TRACKS)
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(ALL_FILTER)
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  const [gridColumns, setGridColumns] = useState<2 | 3>(3)

  const addUpload = useCallback((name: string, size: string, type: string) => {
    const item: UploadItem = { id: generateId(), name, size, type, timestamp: Date.now() }
    setUploads((prev) => [item, ...prev])
  }, [])

  const removeUpload = useCallback((id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const clearUploads = useCallback(() => {
    setUploads([])
  }, [])

  const filteredGallery = galleryItems.filter((item) => {
    return selectedCategory === ALL_FILTER || item.category === selectedCategory
  })

  return (
    <MediaContext.Provider
      value={{
        galleryItems,
        audioTracks,
        uploads,
        addUpload,
        removeUpload,
        clearUploads,
        selectedCategory,
        setSelectedCategory,
        filteredGallery,
        selectedTrackId,
        setSelectedTrackId,
        gridColumns,
        setGridColumns,
      }}
    >
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia() {
  const ctx = useContext(MediaContext)
  if (!ctx) throw new Error('useMedia must be used within MediaProvider')
  return ctx
}
