import { useCallback, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useGlasses } from 'even-toolkit/useGlasses'
import { useFlashPhase } from 'even-toolkit/useFlashPhase'
import { createScreenMapper, getHomeTiles } from 'even-toolkit/glass-router'
import { appSplash } from './splash'
import { toDisplayData, onGlassAction, type AppSnapshot } from './selectors'
import type { AppActions } from './shared'
import { useChat } from '../contexts/ChatContext'

const deriveScreen = createScreenMapper([
  { pattern: '/', screen: 'home' },
  { pattern: '/settings', screen: 'home' },
], 'home')

const homeTiles = getHomeTiles(appSplash)

export function AppGlasses() {
  const navigate = useNavigate()
  const location = useLocation()
  const { messages } = useChat()
  const flashPhase = useFlashPhase(deriveScreen(location.pathname) === 'home')

  const snapshotRef = useMemo(() => ({
    current: null as AppSnapshot | null,
  }), [])

  // Show recent messages on the glasses display
  const recentItems = messages
    .slice(-6)
    .map((msg) => {
      const prefix = msg.role === 'user' ? 'You' : 'AI'
      const text = msg.content.length > 60 ? msg.content.slice(0, 57) + '...' : msg.content
      return `${prefix}: ${text}`
    })

  if (recentItems.length === 0) {
    recentItems.push('{{DISPLAY_NAME}} ready', 'Send a message to begin')
  }

  const snapshot: AppSnapshot = {
    items: recentItems,
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
