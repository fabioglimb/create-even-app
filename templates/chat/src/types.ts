export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export interface ChatSettings {
  provider: 'openai' | 'anthropic' | 'local'
  apiKey: string
  voiceEnabled: boolean
  darkMode: boolean
}
