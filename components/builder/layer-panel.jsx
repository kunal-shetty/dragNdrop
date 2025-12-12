"use client"

import { useState } from "react"
import {
  Layers,
  Lock,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Group,
  Ungroup,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LayerPanel({
  components,
  selectedId,
  selectedIds = [],
  onSelect,
  onMultiSelect,
  onRename,
  onReorder,
  onToggleLock,
  onDelete,
  onGroup,
  onUngroup,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  collaboratingUsers = [],
}) {
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

  const handleClick = (e, comp) => {
    if (e.shiftKey && onMultiSelect) {
      // Multi-select with shift
      if (selectedIds.includes(comp.id)) {
        onMultiSelect(selectedIds.filter((id) => id !== comp.id))
      } else {
        onMultiSelect([...selectedIds, comp.id])
      }
    } else {
      onSelect(comp.id)
      if (onMultiSelect) onMultiSelect([comp.id])
    }
  }

  // Sort by z-index descending (highest z-index at top)
  const sortedComponents = [...components].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))

  return (
    <div className="w-56 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      <div
        className="p-3 border-b border-sidebar-border flex items-center justify-between cursor-pointer hover:bg-secondary/30"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-neon-cyan" />
          <span className="text-sm font-medium">Layers</span>
          <span className="text-xs text-muted-foreground">({components.length})</span>
        </div>
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {!collapsed && (
        <>
          {/* Z-Index Controls */}
          {selectedId && (
            <div className="p-2 border-b border-sidebar-border flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 hover:bg-neon-cyan/10 hover:text-neon-cyan"
                onClick={() => onBringToFront?.(selectedId)}
                title="Bring to front (Ctrl+Shift+])"
              >
                <ChevronsUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 hover:bg-neon-cyan/10 hover:text-neon-cyan"
                onClick={() => onBringForward?.(selectedId)}
                title="Bring forward (Ctrl+])"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 hover:bg-neon-cyan/10 hover:text-neon-cyan"
                onClick={() => onSendBackward?.(selectedId)}
                title="Send backward (Ctrl+[)"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 hover:bg-neon-cyan/10 hover:text-neon-cyan"
                onClick={() => onSendToBack?.(selectedId)}
                title="Send to back (Ctrl+Shift+[)"
              >
                <ChevronsDown className="w-3.5 h-3.5" />
              </Button>
              <div className="flex-1" />
              {selectedIds.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 hover:bg-neon-purple/10 hover:text-neon-purple"
                  onClick={() => onGroup?.(selectedIds)}
                  title="Group (Ctrl+G)"
                >
                  <Group className="w-3.5 h-3.5" />
                </Button>
              )}
              {components.find((c) => c.id === selectedId)?.type === "group" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 hover:bg-neon-purple/10 hover:text-neon-purple"
                  onClick={() => onUngroup?.(selectedId)}
                  title="Ungroup (Ctrl+Shift+G)"
                >
                  <Ungroup className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sortedComponents.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No layers yet</p>
            ) : (
              sortedComponents.map((comp, visualIndex) => {
                const actualIndex = components.findIndex((c) => c.id === comp.id)
                const isSelected = comp.id === selectedId || selectedIds.includes(comp.id)
                const isLocked = comp.locked?.position || comp.locked?.size || comp.locked?.editing

                // Check if another user is editing this component
                const editingUser = collaboratingUsers.find((u) => u.selection === comp.id && u.id !== "self")

                return (
                  <div
                    key={comp.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, actualIndex)}
                    onDragOver={(e) => handleDragOver(e, actualIndex)}
                    onDrop={(e) => handleDrop(e, actualIndex)}
                    onClick={(e) => handleClick(e, comp)}
                    className={`
                      group flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors
                      ${isSelected ? "bg-neon-cyan/20 border border-neon-cyan/40" : "hover:bg-secondary/50 border border-transparent"}
                      ${editingUser ? "ring-2 ring-offset-1 ring-offset-background" : ""}
                    `}
                    style={editingUser ? { "--tw-ring-color": editingUser.color } : undefined}
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
                        <div className="flex items-center gap-1">
                          <span
                            className="text-xs truncate block"
                            onDoubleClick={(e) => {
                              e.stopPropagation()
                              handleStartEdit(comp)
                            }}
                          >
                            {comp.layerName || comp.type}
                          </span>
                          <span className="text-[10px] text-muted-foreground opacity-60">z:{comp.zIndex || 0}</span>
                        </div>
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

          {/* Selection info */}
          {selectedIds.length > 1 && (
            <div className="p-2 border-t border-sidebar-border">
              <p className="text-xs text-muted-foreground text-center">
                {selectedIds.length} layers selected (Shift+click to multi-select)
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
