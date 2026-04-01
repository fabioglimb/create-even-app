import { DrawerShell } from 'even-toolkit/web'
import type { SideDrawerItem } from 'even-toolkit/web'

const MENU_ITEMS: SideDrawerItem[] = [
  { id: '/', label: 'Gallery', section: 'Media' },
  { id: '/audio', label: 'Audio', section: 'Media' },
]

const BOTTOM_ITEMS: SideDrawerItem[] = [
  { id: '/upload', label: 'Upload', section: 'App' },
  { id: '/settings', label: 'Settings', section: 'App' },
]

function getPageTitle(pathname: string): string {
  if (pathname === '/') return '{{DISPLAY_NAME}}'
  if (pathname === '/audio') return 'Audio'
  if (pathname === '/upload') return 'Upload'
  if (pathname === '/settings') return 'Settings'
  return '{{DISPLAY_NAME}}'
}

function deriveActiveId(pathname: string): string {
  if (pathname === '/audio') return '/audio'
  if (pathname === '/upload') return '/upload'
  if (pathname === '/settings') return '/settings'
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
