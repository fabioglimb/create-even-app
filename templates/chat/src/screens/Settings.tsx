import { SettingsGroup, ListItem, Toggle, Select, Input } from 'even-toolkit/web'
import { useChat } from '../contexts/ChatContext'

const PROVIDER_OPTIONS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'local', label: 'Local Model' },
]

export function Settings() {
  const { settings, setSettings, clearMessages } = useChat()

  return (
    <main className="px-3 pt-4 pb-8 space-y-6">
      {/* AI Provider */}
      <SettingsGroup label="AI Provider">
        <ListItem
          title="Provider"
          trailing={
            <Select
              options={PROVIDER_OPTIONS}
              value={settings.provider}
              onValueChange={(v) => setSettings({ ...settings, provider: v as 'openai' | 'anthropic' | 'local' })}
            />
          }
        />
        <div className="px-4 py-3 space-y-1.5">
          <span className="text-[13px] tracking-[-0.13px] text-text-dim">API Key</span>
          <Input
            value={settings.apiKey}
            onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
            type="password"
            placeholder="Enter your API key"
          />
          <p className="text-[11px] tracking-[-0.11px] text-text-dim">
            {settings.provider === 'local' ? 'No API key needed for local models.' : 'Your key is stored locally and never shared.'}
          </p>
        </div>
      </SettingsGroup>

      {/* Voice */}
      <SettingsGroup label="Voice">
        <ListItem
          title="Enable voice input"
          subtitle="Use microphone to send messages"
          trailing={
            <Toggle
              checked={settings.voiceEnabled}
              onChange={(v) => setSettings({ ...settings, voiceEnabled: v })}
            />
          }
        />
      </SettingsGroup>

      {/* Display */}
      <SettingsGroup label="Display">
        <ListItem
          title="Dark mode"
          subtitle="Use dark color scheme"
          trailing={
            <Toggle
              checked={settings.darkMode}
              onChange={(v) => setSettings({ ...settings, darkMode: v })}
            />
          }
        />
      </SettingsGroup>

      {/* Data */}
      <SettingsGroup label="Data">
        <div onClick={clearMessages}>
          <ListItem
            title="Clear conversation"
            subtitle="Remove all messages from the current session"
          />
        </div>
      </SettingsGroup>

      {/* About */}
      <SettingsGroup label="About">
        <ListItem
          title="{{DISPLAY_NAME}} v1.0.0"
          subtitle="AI chat for G2 smart glasses"
        />
      </SettingsGroup>
    </main>
  )
}
