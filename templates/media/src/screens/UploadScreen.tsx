import { FileUpload, EmptyState, ListItem, Card, Button, ScreenHeader, useDrawerHeader } from 'even-toolkit/web'
import { IcEditUploadToCloud, IcEditTrash } from 'even-toolkit/web/icons/svg-icons'
import { useMedia } from '../contexts/MediaContext'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function UploadScreen() {
  const { uploads, addUpload, removeUpload, clearUploads } = useMedia()

  useDrawerHeader({ title: 'Upload' })

  function handleFiles(files: File[]) {
    files.forEach((file) => {
      addUpload(file.name, formatSize(file.size), file.type || 'unknown')
    })
  }

  return (
    <main className="px-3 pt-4 pb-8 space-y-3">
      <ScreenHeader
        title="Upload"
        subtitle="Add media to your library"
        actions={
          uploads.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={clearUploads}>
              Clear All
            </Button>
          ) : undefined
        }
      />

      <FileUpload
        onFiles={handleFiles}
        accept="image/*,audio/*,video/*"
        multiple
        label="Drop media files or tap to browse"
      />

      {uploads.length === 0 ? (
        <EmptyState
          icon={<IcEditUploadToCloud width={48} height={48} />}
          title="No uploads yet"
          description="Use the drop zone above to add photos, audio, or video files to your media library."
        />
      ) : (
        <div>
          <p className="text-[13px] tracking-[-0.13px] text-text-dim mb-2">
            Recent Uploads ({uploads.length})
          </p>
          <Card className="rounded-[6px] overflow-hidden divide-y divide-border">
            {uploads.map((upload) => (
              <ListItem
                key={upload.id}
                title={upload.name}
                subtitle={`${upload.size} \u00b7 ${upload.type}`}
                trailing={
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] tracking-[-0.11px] text-text-dim">
                      {formatTime(upload.timestamp)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeUpload(upload.id)
                      }}
                      className="text-text-dim hover:text-negative"
                    >
                      <IcEditTrash width={16} height={16} />
                    </Button>
                  </div>
                }
              />
            ))}
          </Card>
        </div>
      )}
    </main>
  )
}
