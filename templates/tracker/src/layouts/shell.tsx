import { DrawerShell } from 'even-toolkit/web'
import type { SideDrawerItem } from 'even-toolkit/web'

const MENU_ITEMS: SideDrawerItem[] = [
  { id: '/', label: 'Today', section: 'Tracker' },
  { id: '/history', label: 'History', section: 'Tracker' },
]

const BOTTOM_ITEMS: SideDrawerItem[] = [
  { id: '/settings', label: 'Settings', section: 'App' },
]

function getPageTitle(pathname: string): string {
  if (pathname === '/') return '{{DISPLAY_NAME}}'
  if (pathname === '/history') return 'History'
  if (pathname === '/new') return 'New Entry'
  if (pathname === '/settings') return 'Settings'
  return '{{DISPLAY_NAME}}'
}

function deriveActiveId(pathname: string): string {
  if (pathname === '/settings') return '/settings'
  if (pathname === '/history') return '/history'
  return '/'
}

export function Shell() {
  return (
    <DrawerShell
      items={MENU_ITEMS}
      bottomItems={BOTTOM_ITEMS}
      title="{{DISPLAY_NAME}}"
      getPageTitle={getPageTitle}
      deriveActiveId={deriveActiveId}
    />
  )
}
