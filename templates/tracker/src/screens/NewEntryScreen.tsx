import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Card, Button, StepIndicator, Select, Slider, Input, Textarea, useDrawerHeader } from 'even-toolkit/web'
import { useTracker } from '../contexts/TrackerContext'
import { ACTIVITIES, ACTIVITY_UNITS, type ActivityType } from '../types'

const ACTIVITY_OPTIONS = ACTIVITIES.map((a) => ({ value: a, label: a }))

const ACTIVITY_DEFAULTS: Record<ActivityType, { min: number; max: number; step: number; initial: number }> = {
  Water: { min: 1, max: 12, step: 1, initial: 1 },
  Steps: { min: 500, max: 20000, step: 500, initial: 5000 },
  Focus: { min: 5, max: 120, step: 5, initial: 25 },
}

export function NewEntryScreen() {
  const navigate = useNavigate()
  const { addEntry } = useTracker()

  const [step, setStep] = useState(1)
  const [activity, setActivity] = useState<ActivityType>('Water')
  const [value, setValue] = useState(ACTIVITY_DEFAULTS.Water.initial)
  const [note, setNote] = useState('')

  useDrawerHeader({ title: 'New Entry', backTo: '/' })

  function handleActivityChange(a: string) {
    const act = a as ActivityType
    setActivity(act)
    setValue(ACTIVITY_DEFAULTS[act].initial)
  }

  function handleSave() {
    addEntry(activity, value, note.trim())
    navigate('/')
  }

  const canNext = step < 3
  const canPrev = step > 1

  return (
    <main className="px-3 pt-4 pb-8 space-y-3">
      <StepIndicator
        currentStep={step}
        totalSteps={3}
        onPrev={canPrev ? () => setStep((s) => s - 1) : undefined}
        onNext={
          step === 3
            ? handleSave
            : canNext
              ? () => setStep((s) => s + 1)
              : undefined
        }
        nextLabel={step === 3 ? 'Save' : undefined}
      />

      {/* Step 1: Select Activity */}
      {step === 1 && (
        <Card className="p-4 space-y-3">
          <p className="text-[15px] tracking-[-0.15px] text-text">Select Activity</p>
          <div className="space-y-1.5">
            <label className="text-[11px] tracking-[-0.11px] text-text-dim block">Activity type</label>
            <Select
              options={ACTIVITY_OPTIONS}
              value={activity}
              onValueChange={handleActivityChange}
            />
          </div>
          <p className="text-[13px] tracking-[-0.13px] text-text-dim">
            Track your {activity.toLowerCase()} intake for today.
          </p>
        </Card>
      )}

      {/* Step 2: Set Value */}
      {step === 2 && (
        <Card className="p-4 space-y-3">
          <p className="text-[15px] tracking-[-0.15px] text-text">Set Value</p>
          <div className="space-y-1.5">
            <label className="text-[11px] tracking-[-0.11px] text-text-dim block">
              {activity} ({ACTIVITY_UNITS[activity]})
            </label>
            <Slider
              value={value}
              onChange={setValue}
              min={ACTIVITY_DEFAULTS[activity].min}
              max={ACTIVITY_DEFAULTS[activity].max}
              step={ACTIVITY_DEFAULTS[activity].step}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] tracking-[-0.11px] text-text-dim block">Exact value</label>
            <Input
              type="number"
              value={String(value)}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (!isNaN(v) && v >= 0) setValue(v)
              }}
            />
          </div>
          <p className="text-[13px] tracking-[-0.13px] text-text-dim">
            {value} {ACTIVITY_UNITS[activity]}
          </p>
        </Card>
      )}

      {/* Step 3: Add Note */}
      {step === 3 && (
        <Card className="p-4 space-y-3">
          <p className="text-[15px] tracking-[-0.15px] text-text">Add Note</p>
          <div className="space-y-1.5">
            <label className="text-[11px] tracking-[-0.11px] text-text-dim block">Note (optional)</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this entry..."
              rows={4}
            />
          </div>
          <div className="rounded-[6px] bg-surface p-3 space-y-1">
            <p className="text-[13px] tracking-[-0.13px] text-text">Summary</p>
            <p className="text-[11px] tracking-[-0.11px] text-text-dim">
              {activity}: {value} {ACTIVITY_UNITS[activity]}
            </p>
            {note.trim() && (
              <p className="text-[11px] tracking-[-0.11px] text-text-dim">
                Note: {note.trim()}
              </p>
            )}
          </div>
        </Card>
      )}
    </main>
  )
}
