import { Routes, Route } from 'react-router'
import { Shell } from './layouts/shell'
import { MediaProvider } from './contexts/MediaContext'
import { GalleryScreen } from './screens/GalleryScreen'
import { AudioScreen } from './screens/AudioScreen'
import { UploadScreen } from './screens/UploadScreen'
import { Settings } from './screens/Settings'
import { AppGlasses } from './glass/AppGlasses'

export function App() {
  return (
    <MediaProvider>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<GalleryScreen />} />
          <Route path="/audio" element={<AudioScreen />} />
          <Route path="/upload" element={<UploadScreen />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
      <AppGlasses />
    </MediaProvider>
  )
}
