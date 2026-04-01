import { Card, ListItem, ScreenHeader, Button, useDrawerHeader } from 'even-toolkit/web'
import { IcEditPlay, IcEditPause } from 'even-toolkit/web/icons/svg-icons'
import { useMedia } from '../contexts/MediaContext'

export function AudioScreen() {
  const { audioTracks, selectedTrackId, setSelectedTrackId } = useMedia()

  useDrawerHeader({ title: 'Audio' })

  const selectedTrack = audioTracks.find((t) => t.id === selectedTrackId)

  return (
    <main className="px-3 pt-4 pb-8 space-y-3">
      <ScreenHeader
        title="Audio"
        subtitle={`${audioTracks.length} track${audioTracks.length !== 1 ? 's' : ''}`}
      />

      <div className="rounded-[6px] overflow-hidden divide-y divide-border">
        {audioTracks.map((track) => (
          <ListItem
            key={track.id}
            title={track.title}
            subtitle={track.artist}
            trailing={
              <div className="flex items-center gap-3">
                <span className="text-[11px] tracking-[-0.11px] text-text-dim tabular-nums">
                  {track.duration}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedTrackId(selectedTrackId === track.id ? null : track.id)
                  }}
                  className="w-8 h-8 rounded-full bg-accent text-text-highlight"
                >
                  {selectedTrackId === track.id ? (
                    <IcEditPause width={14} height={14} />
                  ) : (
                    <IcEditPlay width={14} height={14} />
                  )}
                </Button>
              </div>
            }
            onPress={() => setSelectedTrackId(track.id)}
          />
        ))}
      </div>

      {selectedTrack && (
        <Card className="p-3 mt-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedTrackId(null)}
              className="shrink-0 w-10 h-10 rounded-full bg-accent text-text-highlight"
            >
              <IcEditPause width={16} height={16} />
            </Button>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] tracking-[-0.15px] text-text truncate">{selectedTrack.title}</p>
              <p className="text-[11px] tracking-[-0.11px] text-text-dim">{selectedTrack.artist}</p>
            </div>
            <span className="text-[13px] tracking-[-0.13px] text-text-dim tabular-nums shrink-0">
              {selectedTrack.duration}
            </span>
          </div>
          <div className="mt-2 h-1 bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full w-1/3" />
          </div>
        </Card>
      )}
    </main>
  )
}
