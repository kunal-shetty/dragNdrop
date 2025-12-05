"use client"

import { useState } from "react"
import { Layers, Lock, Trash2, GripVertical, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LayerPanel({ components, selectedId, onSelect, onRename, onReorder, onToggleLock, onDelete }) {
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState("")
  const [collapsed, setCollapsed] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleStartEdit = (comp) => {
    setEditingId(comp.id)
    setEditName(comp.layerName || comp.type)
  }

  const handleSaveEdit = (id) => {
    if (editName.trim()) {
      onRename(id, editName.trim())
    }
    setEditingId(null)
  }

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
  }

  const handleDrop = (e, toIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === toIndex) return
    onReorder(draggedIndex, toIndex)
    setDraggedIndex(null)
  }

  // Reverse to show top layers first
  const reversedComponents = [...components].reverse()

  return (
    <div className="w-56 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      <div
        className="p-3 border-b border-sidebar-border flex items-center justify-between cursor-pointer hover:bg-secondary/30"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-neon-cyan" />
          <span className="text-sm font-medium">Layers</span>
        </div>
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {reversedComponents.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No layers yet</p>
          ) : (
            reversedComponents.map((comp, index) => {
              const actualIndex = components.length - 1 - index
              const isSelected = comp.id === selectedId
              const isLocked = comp.locked?.position || comp.locked?.size || comp.locked?.editing

              return (
                <div
                  key={comp.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, actualIndex)}
                  onDragOver={(e) => handleDragOver(e, actualIndex)}
                  onDrop={(e) => handleDrop(e, actualIndex)}
                  onClick={() => onSelect(comp.id)}
                  className={`
                    group flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors
                    ${isSelected ? "bg-neon-cyan/20 border border-neon-cyan/40" : "hover:bg-secondary/50 border border-transparent"}
                  `}
                >
                  <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />

                  <div className="flex-1 min-w-0">
                    {editingId === comp.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => handleSaveEdit(comp.id)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(comp.id)}
                        className="h-6 text-xs bg-secondary/50"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        className="text-xs truncate block"
                        onDoubleClick={(e) => {
                          e.stopPropagation()
                          handleStartEdit(comp)
                        }}
                      >
                        {comp.layerName || comp.type}
                      </span>
                    )}
                  </div>

                  {isLocked && <Lock className="w-3 h-3 text-neon-magenta" />}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-5 h-5 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(comp.id)
                    }}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
