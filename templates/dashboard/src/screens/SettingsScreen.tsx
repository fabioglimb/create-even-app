import { useState } from 'react'
import { ScreenHeader, SettingsGroup, Toggle, ListItem } from 'even-toolkit/web'
import { IcGuideChevronSmallDrillIn } from 'even-toolkit/web/icons/svg-icons'

export function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title="Settings" />

      {/* Display settings */}
      <SettingsGroup label="Display">
        <ListItem
          title="Dark Mode"
          subtitle="Use dark color scheme"
          trailing={<Toggle checked={darkMode} onChange={setDarkMode} />}
        />
        <ListItem
          title="Auto-refresh"
          subtitle="Update data every 30 seconds"
          trailing={<Toggle checked={autoRefresh} onChange={setAutoRefresh} />}
        />
        <ListItem
          title="Notifications"
          subtitle="Alert on threshold breaches"
          trailing={<Toggle checked={notifications} onChange={setNotifications} />}
        />
      </SettingsGroup>

      {/* Data settings */}
      <SettingsGroup label="Data">
        <ListItem
          title="Refresh Interval"
          subtitle="30 seconds"
          trailing={<IcGuideChevronSmallDrillIn width={20} height={20} className="text-text-dim" />}
        />
        <ListItem
          title="Data Source"
          subtitle="Production API"
          trailing={<IcGuideChevronSmallDrillIn width={20} height={20} className="text-text-dim" />}
        />
      </SettingsGroup>

      {/* About */}
      <SettingsGroup label="About">
        <ListItem
          title="{{DISPLAY_NAME}}"
          subtitle="Version 1.0.0"
        />
        <ListItem
          title="Even Toolkit"
          subtitle="v1.5.0"
        />
      </SettingsGroup>
    </div>
  )
}
