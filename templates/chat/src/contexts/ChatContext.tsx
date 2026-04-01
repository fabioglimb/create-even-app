import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Message, ChatSettings } from '../types'

interface ChatContextValue {
  messages: Message[]
  isLoading: boolean
  settings: ChatSettings
  setSettings: (settings: ChatSettings) => void
  sendMessage: (content: string) => void
  clearMessages: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'What can you help me with?',
    timestamp: Date.now() - 120000,
  },
  {
    id: '2',
    role: 'assistant',
    content: 'I can help you with a wide range of tasks — answering questions, writing, analysis, coding, brainstorming, and more. I can also display key information on your G2 glasses for quick, hands-free reference. What would you like to work on?',
    timestamp: Date.now() - 110000,
  },
  {
    id: '3',
    role: 'user',
    content: 'Show me the weather forecast for today.',
    timestamp: Date.now() - 60000,
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Here is today\'s forecast:\n\nMostly sunny, high of 22C / 72F with light winds from the northwest. UV index is moderate — sunglasses recommended (you\'re already wearing them). No rain expected until Thursday.',
    timestamp: Date.now() - 50000,
  },
]

const SIMULATED_RESPONSES = [
  'That\'s a great question. Let me think about it for a moment.\n\nBased on what I know, the answer involves a few key considerations. Would you like me to go deeper into any particular aspect?',
  'I\'ve processed your request. Here is what I found:\n\nThe information you\'re looking for can be broken down into three main areas. I\'ll summarize the key points and push them to your glasses display for quick reference.',
  'Interesting thought. Here\'s my perspective on it:\n\nThere are multiple angles to consider here. The most important factor is understanding the context and constraints involved. Let me know if you\'d like more detail on any specific part.',
]

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES)
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<ChatSettings>({
    provider: 'openai',
    apiKey: '',
    voiceEnabled: true,
    darkMode: false,
  })

  const sendMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response
    const delay = 1200 + Math.random() * 1800
    setTimeout(() => {
      const response = SIMULATED_RESPONSES[Math.floor(Math.random() * SIMULATED_RESPONSES.length)]
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, delay)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return (
    <ChatContext.Provider value={{ messages, isLoading, settings, setSettings, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}
