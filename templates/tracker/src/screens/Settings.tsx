import { useState } from 'react'
import { SettingsGroup, Toggle, ListItem, Card, Button, Divider, Input, useDrawerHeader } from 'even-toolkit/web'
import { useTracker } from '../contexts/TrackerContext'

export function Settings() {
  const { goals, setGoals, entries, showCompletionBadge, setShowCompletionBadge } = useTracker()
  const [confirmClear, setConfirmClear] = useState(false)

  const [waterGoal, setWaterGoal] = useState(String(goals.water))
  const [stepsGoal, setStepsGoal] = useState(String(goals.steps))
  const [focusGoal, setFocusGoal] = useState(String(goals.focus))

  useDrawerHeader({ title: 'Settings', backTo: '/' })

  function handleSaveGoals() {
    const w = parseInt(waterGoal, 10)
    const s = parseInt(stepsGoal, 10)
    const f = parseInt(focusGoal, 10)
    if (!isNaN(w) && !isNaN(s) && !isNaN(f) && w > 0 && s > 0 && f > 0) {
      setGoals({ water: w, steps: s, focus: f })
    }
  }

  function handleExport() {
    const data = JSON.stringify(entries, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tracker-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleClearAll() {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    localStorage.removeItem('{{APP_NAME}}-entries')
    localStorage.removeItem('{{APP_NAME}}-goals')
    localStorage.removeItem('{{APP_NAME}}-settings')
    window.location.reload()
  }

  return (
    <main className="px-3 pt-4 pb-8 space-y-6">
      <SettingsGroup label="Goals">
        <Card className="p-4 space-y-3">
          <div className="space-y-1.5">
            <label className="text-[11px] tracking-[-0.11px] text-text-dim block">Water (glasses per day)</label>
            <Input
              type="number"
              value={waterGoal}
              onChange={(e) => setWaterGoal(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] tracking-[-0.11px] text-text-dim block">Steps (per day)</label>
            <Input
              type="number"
              value={stepsGoal}
              onChange={(e) => setStepsGoal(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] tracking-[-0.11px] text-text-dim block">Focus (minutes per day)</label>
            <Input
              type="number"
              value={focusGoal}
              onChange={(e) => setFocusGoal(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={handleSaveGoals}>
            Save Goals
          </Button>
        </Card>
      </SettingsGroup>

      <SettingsGroup label="Display">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] tracking-[-0.15px] text-text">Completion Badge</p>
              <p className="text-[11px] tracking-[-0.11px] text-text-dim mt-0.5">
                Show daily completion percentage in history
              </p>
            </div>
            <Toggle checked={showCompletionBadge} onChange={setShowCompletionBadge} />
          </div>
        </Card>
      </SettingsGroup>

      <SettingsGroup label="Data">
        <Card className="divide-y divide-border">
          <ListItem
            title="Export Data"
            subtitle={`Export all ${entries.length} entries as JSON`}
            onPress={handleExport}
          />
          <div>
            <ListItem
              title={confirmClear ? 'Tap again to confirm' : 'Clear All Data'}
              subtitle="Permanently delete all entries and reset goals"
              onPress={handleClearAll}
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
        </Card>
      </SettingsGroup>

      <SettingsGroup label="About">
        <Card className="p-4 space-y-1.5">
          <p className="text-[15px] tracking-[-0.15px] text-text">{{DISPLAY_NAME}}</p>
          <p className="text-[13px] tracking-[-0.13px] text-text-dim">Version 1.0.0</p>
          <Divider className="my-2" />
          <p className="text-[11px] tracking-[-0.11px] text-text-dim">
            An activity and habit tracker for Even Realities G2 smart glasses. All data is stored locally in your browser.
          </p>
        </Card>
      </SettingsGroup>
    </main>
  )
}
