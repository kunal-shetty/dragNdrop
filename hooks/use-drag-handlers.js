"use client"

import { useState, useCallback, useRef } from "react"

export function useDragHandlers({
  zoom = 1,
  pan = { x: 0, y: 0 },
  gridSettings = { columns: 12, gap: 16 },
  editorMode = "freeform",
  snapToGrid = true,
  gridSize = 20,
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const startPosRef = useRef({ x: 0, y: 0 })
  const startSizeRef = useRef({ width: 0, height: 0 })

  const snapValue = useCallback(
    (value) => {
      if (!snapToGrid) return value
      return Math.round(value / gridSize) * gridSize
    },
    [snapToGrid, gridSize],
  )

  const handleDragStart = useCallback(
    (e, component) => {
      setIsDragging(true)
      startPosRef.current = {
        x: e.clientX - component.position.x * zoom,
        y: e.clientY - component.position.y * zoom,
      }
    },
    [zoom],
  )

  const handleDrag = useCallback(
    (e) => {
      if (!isDragging) return null

      const x = snapValue((e.clientX - startPosRef.current.x) / zoom)
      const y = snapValue((e.clientY - startPosRef.current.y) / zoom)
      setDragPosition({ x, y })
      return { x, y }
    },
    [isDragging, zoom, snapValue],
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    return dragPosition
  }, [dragPosition])

  const handleResizeStart = useCallback((e, component, handle) => {
    e.stopPropagation()
    setIsResizing(true)
    startPosRef.current = { x: e.clientX, y: e.clientY }
    startSizeRef.current = { ...component.size }
  }, [])

  const calculateResize = useCallback(
    (e, handle, proportional = false) => {
      if (!isResizing) return null

      const dx = (e.clientX - startPosRef.current.x) / zoom
      const dy = (e.clientY - startPosRef.current.y) / zoom

      let newWidth = startSizeRef.current.width
      let newHeight = startSizeRef.current.height
      let newX = null
      let newY = null

      switch (handle) {
        case "e":
          newWidth = snapValue(startSizeRef.current.width + dx)
          break
        case "w":
          newWidth = snapValue(startSizeRef.current.width - dx)
          newX = startSizeRef.current.width - newWidth
          break
        case "s":
          newHeight = snapValue(startSizeRef.current.height + dy)
          break
        case "n":
          newHeight = snapValue(startSizeRef.current.height - dy)
          newY = startSizeRef.current.height - newHeight
          break
        case "se":
          newWidth = snapValue(startSizeRef.current.width + dx)
          newHeight = proportional
            ? (newWidth / startSizeRef.current.width) * startSizeRef.current.height
            : snapValue(startSizeRef.current.height + dy)
          break
        case "sw":
          newWidth = snapValue(startSizeRef.current.width - dx)
          newHeight = proportional
            ? (newWidth / startSizeRef.current.width) * startSizeRef.current.height
            : snapValue(startSizeRef.current.height + dy)
          newX = startSizeRef.current.width - newWidth
          break
        case "ne":
          newWidth = snapValue(startSizeRef.current.width + dx)
          newHeight = proportional
            ? (newWidth / startSizeRef.current.width) * startSizeRef.current.height
            : snapValue(startSizeRef.current.height - dy)
          newY = proportional ? null : startSizeRef.current.height - newHeight
          break
        case "nw":
          newWidth = snapValue(startSizeRef.current.width - dx)
          newHeight = proportional
            ? (newWidth / startSizeRef.current.width) * startSizeRef.current.height
            : snapValue(startSizeRef.current.height - dy)
          newX = startSizeRef.current.width - newWidth
          newY = proportional ? null : startSizeRef.current.height - newHeight
          break
      }

      return {
        width: Math.max(50, newWidth),
        height: Math.max(50, newHeight),
        deltaX: newX,
        deltaY: newY,
      }
    },
    [isResizing, zoom, snapValue],
  )

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
  }, [])

  return {
    isDragging,
    isResizing,
    dragPosition,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleResizeStart,
    calculateResize,
    handleResizeEnd,
    snapValue,
  }
}
