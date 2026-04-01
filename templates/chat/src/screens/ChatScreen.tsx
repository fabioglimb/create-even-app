import { useState } from 'react'
import { ChatContainer, ChatInput, ChatThinking, VoiceInput } from 'even-toolkit/web'
import type { ChatMessage } from 'even-toolkit/web'
import { useChat } from '../contexts/ChatContext'

export function ChatScreen() {
  const { messages, isLoading, settings, sendMessage } = useChat()
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    sendMessage(trimmed)
    setInputValue('')
  }

  const handleVoiceTranscript = (text: string) => {
    if (text.trim()) {
      sendMessage(text.trim())
    }
  }

  // Map app messages to toolkit ChatMessage format
  const chatMessages: ChatMessage[] = messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp,
  }))

  // Add thinking indicator when loading
  if (isLoading) {
    chatMessages.push({
      id: 'thinking',
      role: 'assistant',
      content: '',
      thinking: 'Composing a response...',
    })
  }

  return (
    <div className="h-full flex flex-col">
      <ChatContainer
        messages={chatMessages}
        className="flex-1 min-h-0"
        input={
          <div className="flex items-end gap-2 p-3 bg-bg border-t border-border/30">
            {settings.voiceEnabled && (
              <VoiceInput
                onTranscript={handleVoiceTranscript}
                className="shrink-0"
              />
            )}
            <div className="flex-1 flex items-end gap-2">
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSend}
                placeholder="Ask anything..."
                disabled={isLoading}
                className="flex-1 !p-0 !bg-transparent"
              />
            </div>
          </div>
        }
      />
    </div>
  )
}
