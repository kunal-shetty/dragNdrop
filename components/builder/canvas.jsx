"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { useDroppable } from "@dnd-kit/core"
import { ResizableBlock } from "./resizable-block"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Canvas({
  components,
  selectedId,
  zoom,
  pan,
  snappingEnabled,
  snapGuides,
  physicsEnabled,
  onSelect,
  onMove,
  onResize,
  onContentChange,
  onZoomChange,
  onPanChange,
  onSnapGuidesChange,
}) {
  const canvasRef = useRef(null)
  const [isPanning, setIsPanning] = useState(false)
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 })

  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
  })

  const calculateSnapGuides = useCallback(
    (movingId, position, size) => {
      if (!snappingEnabled) {
        onSnapGuidesChange({ horizontal: [], vertical: [] })
        return position
      }

      const SNAP_THRESHOLD = 8
      const horizontal = []
      const vertical = []
      let snappedX = position.x
      let snappedY = position.y

      const movingEdges = {
        left: position.x,
        right: position.x + size.width,
        centerX: position.x + size.width / 2,
        top: position.y,
        bottom: position.y + size.height,
        centerY: position.y + size.height / 2,
      }

      components.forEach((comp) => {
        if (comp.id === movingId) return

        const edges = {
          left: comp.position.x,
          right: comp.position.x + comp.size.width,
          centerX: comp.position.x + comp.size.width / 2,
          top: comp.position.y,
          bottom: comp.position.y + comp.size.height,
          centerY: comp.position.y + comp.size.height / 2,
        }

        const xSnaps = [
          { moving: "left", target: "left" },
          { moving: "left", target: "right" },
          { moving: "right", target: "left" },
          { moving: "right", target: "right" },
          { moving: "centerX", target: "centerX" },
        ]

        xSnaps.forEach(({ moving, target }) => {
          const diff = Math.abs(movingEdges[moving] - edges[target])
          if (diff < SNAP_THRESHOLD) {
            vertical.push(edges[target])
            if (moving === "left") snappedX = edges[target]
            else if (moving === "right") snappedX = edges[target] - size.width
            else snappedX = edges[target] - size.width / 2
          }
        })

        const ySnaps = [
          { moving: "top", target: "top" },
          { moving: "top", target: "bottom" },
          { moving: "bottom", target: "top" },
          { moving: "bottom", target: "bottom" },
          { moving: "centerY", target: "centerY" },
        ]

        ySnaps.forEach(({ moving, target }) => {
          const diff = Math.abs(movingEdges[moving] - edges[target])
          if (diff < SNAP_THRESHOLD) {
            horizontal.push(edges[target])
            if (moving === "top") snappedY = edges[target]
            else if (moving === "bottom") snappedY = edges[target] - size.height
            else snappedY = edges[target] - size.height / 2
          }
        })
      })

      onSnapGuidesChange({ horizontal: [...new Set(horizontal)], vertical: [...new Set(vertical)] })
      return { x: snappedX, y: snappedY }
    },
    [components, snappingEnabled, onSnapGuidesChange],
  )

  const handleWheel = useCallback(
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        onZoomChange(Math.max(0.25, Math.min(2, zoom + delta)))
      }
    },
    [zoom, onZoomChange],
  )

  const handleMouseDown = useCallback(
    (e) => {
      if (e.target === canvasRef.current || e.target.dataset.canvasBg) {
        onSelect(null)
        if (e.button === 1 || (e.button === 0 && e.altKey)) {
          setIsPanning(true)
          panStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
        }
      }
    },
    [onSelect, pan],
  )

  const handleMouseMove = useCallback(
    (e) => {
      if (isPanning) {
        const dx = e.clientX - panStartRef.current.x
        const dy = e.clientY - panStartRef.current.y
        onPanChange({ x: panStartRef.current.panX + dx, y: panStartRef.current.panY + dy })
      }
    },
    [isPanning, onPanChange],
  )

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
    onSnapGuidesChange({ horizontal: [], vertical: [] })
  }, [onSnapGuidesChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false })
      return () => canvas.removeEventListener("wheel", handleWheel)
    }
  }, [handleWheel])

  useEffect(() => {
    if (isPanning) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isPanning, handleMouseMove, handleMouseUp])

  const resetView = () => {
    onZoomChange(1)
    onPanChange({ x: 0, y: 0 })
  }

  const sortedComponents = [...components].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Zoom Controls */}
      <div className="flex items-center justify-between p-2 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomChange(Math.max(0.25, zoom - 0.1))}
            className="hover:bg-neon-cyan/10 hover:text-neon-cyan h-8"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-mono w-14 text-center text-neon-cyan">{Math.round(zoom * 100)}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
            className="hover:bg-neon-cyan/10 hover:text-neon-cyan h-8"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetView}
            className="hover:bg-neon-cyan/10 hover:text-neon-cyan h-8"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {physicsEnabled && (
            <span className="text-xs text-neon-magenta px-2 py-0.5 rounded bg-neon-magenta/10 border border-neon-magenta/30">
              Physics ON
            </span>
          )}
          <span className="text-xs text-neon-cyan font-medium">FREE MODE</span>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className={`flex-1 overflow-auto relative ${isPanning ? "cursor-grabbing" : "cursor-default"}`}
        onMouseDown={handleMouseDown}
      >
        <div
          ref={setNodeRef}
          data-canvas-bg="true"
          className={`relative min-h-full ${isOver ? "bg-neon-cyan/5" : ""} transition-colors`}
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "top left",
            minWidth: 1200,
            minHeight: 800,
          }}
        >
          {/* Grid lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, oklch(0.75 0.2 195 / 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, oklch(0.75 0.2 195 / 0.08) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Snap Guides */}
          {snapGuides.horizontal.map((y, i) => (
            <div key={`h-${i}`} className="snap-guide snap-guide-h" style={{ top: y }} />
          ))}
          {snapGuides.vertical.map((x, i) => (
            <div key={`v-${i}`} className="snap-guide snap-guide-v" style={{ left: x }} />
          ))}

          <div className="relative p-6 min-h-full">
            {sortedComponents.map((component) => (
              <ResizableBlock
                key={component.id}
                component={component}
                isSelected={selectedId === component.id}
                zIndex={component.zIndex || 1}
                physicsEnabled={physicsEnabled}
                onSelect={onSelect}
                onMove={(id, pos) => {
                  const snappedPos = calculateSnapGuides(id, pos, component.size)
                  onMove(id, snappedPos)
                }}
                onResize={onResize}
                onContentChange={onContentChange}
                zoom={zoom}
              />
            ))}

            {components.length === 0 && (
              <div className="absolute inset-0 top-50 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg font-medium text-neon-cyan neon-text-cyan">Drop components here</p>
                  <p className="text-sm mt-1 text-muted-foreground">Drag from the sidebar to start building</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
