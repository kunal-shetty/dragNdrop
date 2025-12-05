"use client"

import { Users, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function CollaborationBar({ users, documentId, currentUserId }) {
  const [copied, setCopied] = useState(false)

  const otherUsers = users.filter((u) => u.id !== currentUserId)

  const handleShare = async () => {
    const url = `${window.location.origin}/editor/${documentId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error("Failed to copy:", e)
    }
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-lg">
      {/* User avatars */}
      <div className="flex items-center -space-x-2">
        {users.slice(0, 5).map((user, index) => (
          <div
            key={user.id}
            className="relative w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 border-card cursor-appear"
            style={{
              backgroundColor: user.color,
              zIndex: users.length - index,
            }}
            title={user.name + (user.id === currentUserId ? " (You)" : "")}
          >
            {user.name.charAt(0)}
          </div>
        ))}
        {users.length > 5 && (
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-medium border-2 border-card">
            +{users.length - 5}
          </div>
        )}
      </div>

      {/* Separator */}
      <div className="w-px h-5 bg-border" />

      {/* User count */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users className="w-3.5 h-3.5" />
        <span>{users.length} online</span>
      </div>

      {/* Share button */}
      <Button
        size="sm"
        variant="ghost"
        className="h-7 px-2 text-xs gap-1.5 text-neon-cyan hover:text-neon-cyan hover:bg-neon-cyan/10"
        onClick={handleShare}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Copied!
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            Share
          </>
        )}
      </Button>

      {/* Typing indicator */}
      {otherUsers.some((u) => u.isTyping) && (
        <>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-neon-magenta typing-dot" />
              <span className="w-1 h-1 rounded-full bg-neon-magenta typing-dot" />
              <span className="w-1 h-1 rounded-full bg-neon-magenta typing-dot" />
            </div>
            <span>typing...</span>
          </div>
        </>
      )}
    </div>
  )
}
