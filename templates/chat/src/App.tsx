import { Routes, Route, useNavigate, useLocation } from 'react-router'
import { AppShell, NavHeader, Button } from 'even-toolkit/web'
import { IcSettings, IcChevronBack } from 'even-toolkit/web/icons/svg-icons'
import { ChatProvider } from './contexts/ChatContext'
import { ChatScreen } from './screens/ChatScreen'
import { Settings } from './screens/Settings'
import { AppGlasses } from './glass/AppGlasses'

function ChatLayout() {
  const navigate = useNavigate()

  return (
    <AppShell
      header={
        <NavHeader
          title="{{DISPLAY_NAME}}"
          right={
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
              <IcSettings className="w-5 h-5" />
            </Button>
          }
        />
      }
    >
      <ChatScreen />
      <AppGlasses />
    </AppShell>
  )
}

function SettingsLayout() {
  const navigate = useNavigate()

  return (
    <AppShell
      header={
        <NavHeader
          title="Settings"
          left={
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <IcChevronBack className="w-5 h-5" />
            </Button>
          }
        />
      }
    >
      <Settings />
    </AppShell>
  )
}

export function App() {
  return (
    <ChatProvider>
      <Routes>
        <Route path="/" element={<ChatLayout />} />
        <Route path="/settings" element={<SettingsLayout />} />
      </Routes>
    </ChatProvider>
  )
}
