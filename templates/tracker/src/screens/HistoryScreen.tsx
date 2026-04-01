import { useMemo } from 'react'
import { Card, Calendar, Timeline, Badge, ScreenHeader } from 'even-toolkit/web'
import type { CalendarEvent } from 'even-toolkit/web'
import { useTracker } from '../contexts/TrackerContext'
import type { DayRecord } from '../types'

const ACTIVITY_COLORS: Record<string, string> = {
  Water: 'var(--color-accent)',
  Steps: 'var(--color-positive)',
  Focus: 'var(--color-negative)',
}

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function getDayCompletion(record: DayRecord, goals: { water: number; steps: number; focus: number }): number {
  const waterTotal = record.entries.filter((e) => e.activity === 'Water').reduce((s, e) => s + e.value, 0)
  const stepsTotal = record.entries.filter((e) => e.activity === 'Steps').reduce((s, e) => s + e.value, 0)
  const focusTotal = record.entries.filter((e) => e.activity === 'Focus').reduce((s, e) => s + e.value, 0)

  const waterPct = Math.min(waterTotal / goals.water, 1)
  const stepsPct = Math.min(stepsTotal / goals.steps, 1)
  const focusPct = Math.min(focusTotal / goals.focus, 1)

  return Math.round(((waterPct + stepsPct + focusPct) / 3) * 100)
}

export function HistoryScreen() {
  const { getDayRecords, goals, showCompletionBadge } = useTracker()
  const dayRecords = getDayRecords()

  // Calendar events from entries
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = []
    for (const record of dayRecords) {
      const activities = new Set(record.entries.map((e) => e.activity))
      for (const activity of activities) {
        const d = new Date(record.date + 'T12:00:00')
        events.push({
          id: `${record.date}-${activity}`,
          title: activity,
          start: d,
          end: d,
          color: ACTIVITY_COLORS[activity],
        })
      }
    }
    return events
  }, [dayRecords])

  // Recent 7 days for timeline
  const recentDays = dayRecords.slice(0, 7)

  const timelineEvents = useMemo(() => {
    return recentDays.map((record) => {
      const completion = getDayCompletion(record, goals)
      const entryCount = record.entries.length
      return {
        id: record.date,
        title: formatDayLabel(record.date),
        subtitle: `${entryCount} ${entryCount === 1 ? 'entry' : 'entries'}`,
        timestamp: `${completion}%`,
        color: completion >= 80 ? 'var(--color-positive)' : completion >= 50 ? 'var(--color-accent)' : 'var(--color-negative)',
      }
    })
  }, [recentDays, goals])

  return (
    <main className="px-3 pt-4 pb-8 space-y-3">
      <ScreenHeader
        title="History"
        subtitle={`${dayRecords.length} days tracked`}
      />

      {/* Calendar */}
      <Card className="p-4">
        <Calendar events={calendarEvents} />
      </Card>

      {/* Recent Activity Timeline */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[15px] tracking-[-0.15px] text-text">Recent Activity</p>
          {showCompletionBadge && recentDays.length > 0 && (
            <Badge variant={getDayCompletion(recentDays[0], goals) >= 80 ? 'positive' : 'neutral'}>
              {getDayCompletion(recentDays[0], goals)}% today
            </Badge>
          )}
        </div>
        {timelineEvents.length > 0 ? (
          <Timeline events={timelineEvents} />
        ) : (
          <p className="text-[13px] tracking-[-0.13px] text-text-dim">No activity recorded yet.</p>
        )}
      </Card>
    </main>
  )
}
