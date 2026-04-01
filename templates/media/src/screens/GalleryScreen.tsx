import { useState } from 'react'
import { CategoryFilter, BottomSheet, Card, ScreenHeader, Button, useDrawerHeader } from 'even-toolkit/web'
import { IcGuideChevronSmallBack, IcGuideChevronSmallDrillIn } from 'even-toolkit/web/icons/svg-icons'
import { useMedia } from '../contexts/MediaContext'
import { ALL_FILTER, CATEGORIES, type CategoryFilter as CategoryFilterType } from '../types'

const FILTER_OPTIONS = [ALL_FILTER, ...CATEGORIES]

export function GalleryScreen() {
  const { filteredGallery, selectedCategory, setSelectedCategory, gridColumns } = useMedia()
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  useDrawerHeader({})

  const selectedItem = viewerIndex !== null ? filteredGallery[viewerIndex] : null

  return (
    <main className="px-3 pt-4 pb-8 space-y-3">
      <ScreenHeader
        title="Gallery"
        subtitle={`${filteredGallery.length} item${filteredGallery.length !== 1 ? 's' : ''}`}
      />

      <CategoryFilter
        categories={FILTER_OPTIONS}
        selected={selectedCategory}
        onSelect={(c) => setSelectedCategory(c as CategoryFilterType)}
      />

      <div className={`grid gap-3 ${gridColumns === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {filteredGallery.map((item, index) => (
          <Card
            key={item.id}
            className="overflow-hidden cursor-pointer"
            onClick={() => setViewerIndex(index)}
          >
            <div
              className="w-full aspect-square rounded-[6px]"
              style={{ background: item.gradient }}
            />
            <div className="p-2">
              <p className="text-[13px] tracking-[-0.13px] text-text truncate">{item.title}</p>
              <p className="text-[11px] tracking-[-0.11px] text-text-dim">{item.date}</p>
            </div>
          </Card>
        ))}
      </div>

      <BottomSheet open={viewerIndex !== null} onClose={() => setViewerIndex(null)}>
        {selectedItem && (
          <div className="px-4 pb-2">
            <div
              className="w-full aspect-video rounded-[6px] mb-3"
              style={{ background: selectedItem.gradient }}
            />
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[17px] tracking-[-0.17px] text-text">{selectedItem.title}</p>
                <p className="text-[13px] tracking-[-0.13px] text-text-dim">
                  {selectedItem.category} &middot; {selectedItem.date}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (viewerIndex !== null && viewerIndex > 0) setViewerIndex(viewerIndex - 1)
                }}
                disabled={viewerIndex === 0}
                className="flex items-center gap-1 text-[13px] tracking-[-0.13px] text-text-dim"
              >
                <IcGuideChevronSmallBack width={16} height={16} />
                Previous
              </Button>
              <span className="text-[11px] tracking-[-0.11px] text-text-dim tabular-nums">
                {viewerIndex !== null ? viewerIndex + 1 : 0} / {filteredGallery.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (viewerIndex !== null && viewerIndex < filteredGallery.length - 1) setViewerIndex(viewerIndex + 1)
                }}
                disabled={viewerIndex === filteredGallery.length - 1}
                className="flex items-center gap-1 text-[13px] tracking-[-0.13px] text-text-dim"
              >
                Next
                <IcGuideChevronSmallDrillIn width={16} height={16} />
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>
    </main>
  )
}
