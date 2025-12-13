"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send, Loader2, Sparkles } from "lucide-react"
import { generateChatResponse, type ChatMessage } from "@/app/actions/chat"

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI assistant for this website builder. Ask me anything about using the editor, components, keyboard shortcuts, or how to create amazing designs!",
    },
  ])
  const quickQuestions = [
  "How does export work?",
  "What are the plan limits?",
  "Why is this not available on mobile?",
  "How do layers and z-index work?",
  "What keyboard shortcuts are available?",
]

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await generateChatResponse(input, messages)

      if (response.success) {
        const fullText = response.content
        let index = 0

        // Add an empty assistant message first
        setMessages((prev) => [...prev, { role: "assistant", content: "" }])

        const interval = setInterval(() => {
          index++

          // Update the LAST message only
          setMessages((prev) => {
            const updated = [...prev]
            updated[updated.length - 1].content = fullText.slice(0, index)
            return updated
          })

          if (index >= fullText.length) clearInterval(interval)
        }, 15) // <-- typing speed (lower = faster)
      }
      else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.error || "Sorry, I encountered an error. Please try again.",
          },
        ])
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again in a moment.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-0 w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-neon-cyan to-neon-purple hover:shadow-neon-cyan/50 transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[32rem] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Ask me anything about the editor</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 hover:bg-background/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${msg.role === "user"
                      ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-white"
                      : "bg-secondary/50 text-foreground"
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Quick Chat Suggestions */}
<div className="px-0 py-2 border-b border-border bg-background/40">
  <div className="flex flex-wrap gap-2">
    {quickQuestions.map((q) => (
      <button
        key={q}
        onClick={() => {
          if (isLoading) return
          setInput(q)
          handleSend(q)
        }}
        className="text-xs px-3 py-1.5 rounded-full
          bg-secondary/60 hover:bg-secondary
          text-muted-foreground hover:text-foreground
          transition-colors"
      >
        {q}
      </button>
    ))}
  </div>
</div>

            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 rounded-2xl px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-neon-cyan" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about features, shortcuts..."
                className="flex-1 bg-background/50"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
