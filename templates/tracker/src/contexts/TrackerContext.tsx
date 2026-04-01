import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { TrackerEntry, ActivityType, GoalTargets, DayRecord } from '../types'
import { DEFAULT_GOALS } from '../types'

interface TrackerContextValue {
  entries: TrackerEntry[]
  goals: GoalTargets
  setGoals: (g: GoalTargets) => void
  addEntry: (activity: ActivityType, value: number, note: string) => TrackerEntry
  deleteEntry: (id: string) => void
  getTodayEntries: () => TrackerEntry[]
  getTodayTotal: (activity: ActivityType) => number
  getDayRecords: () => DayRecord[]
  showCompletionBadge: boolean
  setShowCompletionBadge: (v: boolean) => void
}

const TrackerContext = createContext<TrackerContextValue | null>(null)

const ENTRIES_KEY = '{{APP_NAME}}-entries'
const GOALS_KEY = '{{APP_NAME}}-goals'
const SETTINGS_KEY = '{{APP_NAME}}-settings'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function toDateKey(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function todayKey(): string {
  return toDateKey(Date.now())
}

function generateSampleData(): TrackerEntry[] {
  const now = Date.now()
  const DAY = 86400000
  const entries: TrackerEntry[] = []

  for (let d = 6; d >= 0; d--) {
    const dayBase = now - d * DAY
    const dateStart = new Date(dayBase)
    dateStart.setHours(8, 0, 0, 0)
    const base = dateStart.getTime()

    // Water entries
    const waterCount = d === 0 ? 6 : Math.floor(Math.random() * 4) + 5
    for (let i = 0; i < waterCount; i++) {
      entries.push({
        id: generateId() + `-w${d}-${i}`,
        activity: 'Water',
        value: 1,
        note: '',
        timestamp: base + i * 3600000,
      })
    }

    // Steps entry
    const steps = d === 0 ? 7500 : Math.floor(Math.random() * 5000) + 6000
    entries.push({
      id: generateId() + `-s${d}`,
      activity: 'Steps',
      value: steps,
      note: d === 0 ? '' : 'Daily walk',
      timestamp: base + 10 * 3600000,
    })

    // Focus entry
    const focus = d === 0 ? 45 : Math.floor(Math.random() * 30) + 30
    entries.push({
      id: generateId() + `-f${d}`,
      activity: 'Focus',
      value: focus,
      note: d === 0 ? '' : 'Deep work session',
      timestamp: base + 14 * 3600000,
    })
  }

  return entries
}

function loadEntries(): TrackerEntry[] {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  return generateSampleData()
}

function loadGoals(): GoalTargets {
  try {
    const raw = localStorage.getItem(GOALS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return DEFAULT_GOALS
}

function loadSettings(): { showCompletionBadge: boolean } {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { showCompletionBadge: true }
}

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<TrackerEntry[]>(loadEntries)
  const [goals, setGoals] = useState<GoalTargets>(loadGoals)
  const [showCompletionBadge, setShowCompletionBadge] = useState(() => loadSettings().showCompletionBadge)

  useEffect(() => {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
  }, [entries])

  useEffect(() => {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
  }, [goals])

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ showCompletionBadge }))
  }, [showCompletionBadge])

  const addEntry = useCallback((activity: ActivityType, value: number, note: string): TrackerEntry => {
    const entry: TrackerEntry = {
      id: generateId(),
      activity,
      value,
      note,
      timestamp: Date.now(),
    }
    setEntries((prev) => [entry, ...prev])
    return entry
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const getTodayEntries = useCallback(() => {
    const key = todayKey()
    return entries.filter((e) => toDateKey(e.timestamp) === key)
  }, [entries])

  const getTodayTotal = useCallback((activity: ActivityType) => {
    const key = todayKey()
    return entries
      .filter((e) => toDateKey(e.timestamp) === key && e.activity === activity)
      .reduce((sum, e) => sum + e.value, 0)
  }, [entries])

  const getDayRecords = useCallback((): DayRecord[] => {
    const map = new Map<string, TrackerEntry[]>()
    for (const entry of entries) {
      const key = toDateKey(entry.timestamp)
      const existing = map.get(key) ?? []
      existing.push(entry)
      map.set(key, existing)
    }
    return Array.from(map.entries())
      .map(([date, dayEntries]) => ({ date, entries: dayEntries }))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [entries])

  return (
    <TrackerContext.Provider
      value={{
        entries,
        goals,
        setGoals,
        addEntry,
        deleteEntry,
        getTodayEntries,
        getTodayTotal,
        getDayRecords,
        showCompletionBadge,
        setShowCompletionBadge,
      }}
    >
      {children}
    </TrackerContext.Provider>
  )
}

export function useTracker() {
  const ctx = useContext(TrackerContext)
  if (!ctx) throw new Error('useTracker must be used within TrackerProvider')
  return ctx
}
