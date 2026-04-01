import { useState } from 'react'
import { SettingsGroup, Toggle, ListItem, Card, Button, Divider, useDrawerHeader } from 'even-toolkit/web'
import { useMedia } from '../contexts/MediaContext'

export function Settings() {
  const { gridColumns, setGridColumns, uploads, clearUploads } = useMedia()
  const [confirmClear, setConfirmClear] = useState(false)

  useDrawerHeader({ title: 'Settings', backTo: '/' })

  function handleClearCache() {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    clearUploads()
    setConfirmClear(false)
  }

  return (
    <main className="px-3 pt-4 pb-8 space-y-6">
      <SettingsGroup label="Display">
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] tracking-[-0.15px] text-text">Grid Columns</p>
              <p className="text-[11px] tracking-[-0.11px] text-text-dim mt-0.5">
                Toggle between 2 and 3 column layout
              </p>
            </div>
            <Toggle
              checked={gridColumns === 2}
              onChange={(v) => setGridColumns(v ? 2 : 3)}
            />
          </div>
          <Divider />
          <div>
            <p className="text-[15px] tracking-[-0.15px] text-text">Thumbnail Size</p>
            <p className="text-[11px] tracking-[-0.11px] text-text-dim mt-0.5">
              {gridColumns === 2 ? 'Large thumbnails (2 columns)' : 'Compact thumbnails (3 columns)'}
            </p>
          </div>
        </Card>
      </SettingsGroup>

      <SettingsGroup label="Storage">
        <Card className="divide-y divide-border">
          <div>
            <ListItem
              title={confirmClear ? 'Tap again to confirm' : 'Clear Cache'}
              subtitle={`${uploads.length} uploaded file${uploads.length !== 1 ? 's' : ''} cached`}
              onPress={handleClearCache}
            />
            {confirmClear && (
              <div className="px-4 pb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => setConfirmClear(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          <ListItem
            title="Storage Used"
            subtitle="In-memory only (no persistent storage)"
          />
        </Card>
      </SettingsGroup>

      <SettingsGroup label="About">
        <Card className="p-4 space-y-1.5">
          <p className="text-[15px] tracking-[-0.15px] text-text">{{DISPLAY_NAME}}</p>
          <p className="text-[13px] tracking-[-0.13px] text-text-dim">Version 1.0.0</p>
          <Divider className="my-2" />
          <p className="text-[11px] tracking-[-0.11px] text-text-dim">
            A media gallery app for Even Realities G2 smart glasses. Browse photos, listen to audio, and manage uploads.
          </p>
        </Card>
      </SettingsGroup>
    </main>
  )
}
