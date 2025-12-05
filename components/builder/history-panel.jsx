"use client"

import { X, Clock, Plus, Trash2, Move, Maximize2, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const ACTION_ICONS = {
  add: Plus,
  delete: Trash2,
  move: Move,
  resize: Maximize2,
  update: Edit3,
  default: Clock,
}

export function HistoryPanel({ history, historyIndex, onGoToIndex, onClose }) {
  return (
    <div className="w-64 bg-card/95 backdrop-blur-sm border-l border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-neon-cyan" />
          <span className="text-sm font-medium">History</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* History list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No history yet</div>
          ) : (
            history.map((entry, index) => {
              const Icon = ACTION_ICONS[entry.action] || ACTION_ICONS.default
              const isCurrent = index === historyIndex
              const isPast = index < historyIndex

              return (
                <button
                  key={entry.id}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                    isCurrent
                      ? "bg-neon-cyan/20 border border-neon-cyan/40"
                      : isPast
                        ? "opacity-50 hover:opacity-70"
                        : "hover:bg-secondary/50"
                  }`}
                  onClick={() => onGoToIndex(index)}
                >
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center ${
                      isCurrent ? "bg-neon-cyan/20" : "bg-secondary"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isCurrent ? "text-neon-cyan" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium truncate ${isCurrent ? "text-neon-cyan" : ""}`}>
                      {entry.label || `Action ${index + 1}`}
                    </div>
                    <div className="text-xs text-muted-foreground">{formatTime(entry.timestamp)}</div>
                  </div>
                  {isCurrent && <div className="w-2 h-2 rounded-full bg-neon-cyan" />}
                </button>
              )
            })
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          {history.length} actions • Position {historyIndex + 1}
        </div>
      </div>
    </div>
  )
}

function formatTime(timestamp) {
  if (!timestamp) return ""
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}
