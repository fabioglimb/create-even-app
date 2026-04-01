import { useState } from 'react'
import { AppShell, NavBar } from 'even-toolkit/web'
import { OverviewScreen } from './screens/OverviewScreen'
import { ChartsScreen } from './screens/ChartsScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { AppGlasses } from './glass/AppGlasses'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'charts', label: 'Charts' },
  { id: 'settings', label: 'Settings' },
]

export function App() {
  const [tab, setTab] = useState('overview')

  return (
    <AppShell header={<NavBar items={tabs} activeId={tab} onNavigate={setTab} />}>
      <AppGlasses />
      <div className="px-3 pt-4 pb-8">
        {tab === 'overview' && <OverviewScreen />}
        {tab === 'charts' && <ChartsScreen />}
        {tab === 'settings' && <SettingsScreen />}
      </div>
    </AppShell>
  )
}
