import { useCallback, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useGlasses } from 'even-toolkit/useGlasses'
import { useFlashPhase } from 'even-toolkit/useFlashPhase'
import { createScreenMapper, getHomeTiles } from 'even-toolkit/glass-router'
import { appSplash } from './splash'
import { toDisplayData, onGlassAction, type AppSnapshot } from './selectors'
import type { AppActions } from './shared'
import { useTracker } from '../contexts/TrackerContext'

const deriveScreen = createScreenMapper([
  { pattern: '/', screen: 'home' },
], 'home')

const homeTiles = getHomeTiles(appSplash)

export function AppGlasses() {
  const navigate = useNavigate()
  const location = useLocation()
  const { goals, getTodayTotal } = useTracker()
  const flashPhase = useFlashPhase(deriveScreen(location.pathname) === 'home')

  const snapshotRef = useMemo(() => ({
    current: null as AppSnapshot | null,
  }), [])

  const waterTotal = getTodayTotal('Water')
  const stepsTotal = getTodayTotal('Steps')
  const focusTotal = getTodayTotal('Focus')

  const snapshot: AppSnapshot = {
    items: [
      `Water: ${waterTotal}/${goals.water}`,
      `Steps: ${stepsTotal.toLocaleString()}/${goals.steps.toLocaleString()}`,
      `Focus: ${focusTotal}/${goals.focus} min`,
    ],
    flashPhase,
  }
  snapshotRef.current = snapshot

  const getSnapshot = useCallback(() => snapshotRef.current!, [snapshotRef])

  const ctxRef = useRef<AppActions>({ navigate })
  ctxRef.current = { navigate }

  const handleGlassAction = useCallback(
    (action: Parameters<typeof onGlassAction>[0], nav: Parameters<typeof onGlassAction>[1], snap: AppSnapshot) =>
      onGlassAction(action, nav, snap, ctxRef.current),
    [],
  )

  useGlasses({
    getSnapshot,
    toDisplayData,
    onGlassAction: handleGlassAction,
    deriveScreen,
    appName: '{{DISPLAY_NAME_UPPER}}',
    splash: appSplash,
    getPageMode: (screen) => screen === 'home' ? 'home' : 'text',
    homeImageTiles: homeTiles,
  })

  return null
}
