import { Routes, Route } from 'react-router'
import { Shell } from './layouts/shell'
import { TrackerProvider } from './contexts/TrackerContext'
import { TodayScreen } from './screens/TodayScreen'
import { HistoryScreen } from './screens/HistoryScreen'
import { NewEntryScreen } from './screens/NewEntryScreen'
import { Settings } from './screens/Settings'
import { AppGlasses } from './glass/AppGlasses'

export function App() {
  return (
    <TrackerProvider>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<TodayScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/new" element={<NewEntryScreen />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
      <AppGlasses />
    </TrackerProvider>
  )
}
