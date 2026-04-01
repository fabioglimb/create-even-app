export type ActivityType = 'Water' | 'Steps' | 'Focus'

export interface TrackerEntry {
  id: string
  activity: ActivityType
  value: number
  note: string
  timestamp: number
}

export interface DayRecord {
  date: string // YYYY-MM-DD
  entries: TrackerEntry[]
}

export interface GoalTargets {
  water: number   // glasses
  steps: number   // steps
  focus: number   // minutes
}

export const ACTIVITIES: ActivityType[] = ['Water', 'Steps', 'Focus']

export const DEFAULT_GOALS: GoalTargets = {
  water: 8,
  steps: 10000,
  focus: 60,
}

export const ACTIVITY_UNITS: Record<ActivityType, string> = {
  Water: 'glasses',
  Steps: 'steps',
  Focus: 'min',
}
