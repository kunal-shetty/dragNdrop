"use client"

import { useState, useCallback, useEffect } from "react"
import { generateId } from "@/lib/generate-id"
import { componentDefaults } from "@/lib/default-components"

const STORAGE_KEY = "website-builder-state"
const CUSTOM_COMPONENTS_KEY = "custom-components"

export function useEditorState() {
  const [components, setComponents] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [selectedIds, setSelectedIds] = useState([]) // Multi-select support
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [snappingEnabled, setSnappingEnabled] = useState(true)
  const [clipboard, setClipboard] = useState(null)
  const [customComponents, setCustomComponents] = useState([])
  const [snapGuides, setSnapGuides] = useState({ horizontal: [], vertical: [] })

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setComponents(parsed.components || [])
        setSnappingEnabled(parsed.snappingEnabled !== false)
      } catch (e) {
        console.error("Failed to load saved state:", e)
      }
    }
    // Load custom components
    const savedCustom = localStorage.getItem(CUSTOM_COMPONENTS_KEY)
    if (savedCustom) {
      try {
        setCustomComponents(JSON.parse(savedCustom))
      } catch (e) {
        console.error("Failed to load custom components:", e)
      }
    }
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    const state = { components, snappingEnabled }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [components, snappingEnabled])

  // Save custom components
  useEffect(() => {
    localStorage.setItem(CUSTOM_COMPONENTS_KEY, JSON.stringify(customComponents))
  }, [customComponents])

  const saveToHistory = useCallback(
    (newComponents, action = "update", label = "") => {
      const entry = {
        id: generateId(),
        state: JSON.stringify(newComponents),
        action,
        label: label || getActionLabel(action),
        timestamp: Date.now(),
      }

      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1)
        newHistory.push(entry)
        return newHistory.slice(-50)
      })
      setHistoryIndex((prev) => Math.min(prev + 1, 49))
    },
    [historyIndex],
  )

  const addComponent = useCallback(
    (type, position = { x: 100, y: 100 }, customProps = null) => {
      const defaults = customProps || componentDefaults[type] || {}
      const newComponent = {
        id: generateId(),
        type,
        props: { ...defaults },
        position,
        size: {
          width: type === "container" ? 400 : type === "footer" ? 600 : type === "pricing" ? 280 : 200,
          height: type === "container" ? 200 : type === "footer" ? 150 : type === "pricing" ? 400 : 100,
        },
        transform: { rotate: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0 },
        locked: { position: false, size: false, editing: false },
        layerName: `${type}-${Date.now().toString(36)}`,
        children: [],
        states: {
          default: {},
          hover: {},
          active: {},
          disabled: {},
        },
        currentState: "default",
      }
      setComponents((prev) => {
        const next = [...prev, newComponent]
        saveToHistory(next, "add", `Added ${type}`)
        return next
      })
      setSelectedId(newComponent.id)
      setSelectedIds([newComponent.id])
      return newComponent.id
    },
    [saveToHistory],
  )

  const saveCustomComponent = useCallback((component, name) => {
    const customComp = {
      id: generateId(),
      name,
      baseType: component.type,
      defaultProps: { ...component.props },
      defaultSize: { ...component.size },
      createdAt: Date.now(),
    }
    setCustomComponents((prev) => [...prev, customComp])
    return customComp.id
  }, [])

  const deleteCustomComponent = useCallback((id) => {
    setCustomComponents((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const addCustomComponent = useCallback(
    (customComp, position = { x: 100, y: 100 }) => {
      const newComponent = {
        id: generateId(),
        type: customComp.baseType,
        props: { ...customComp.defaultProps },
        position,
        size: { ...customComp.defaultSize },
        transform: { rotate: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0 },
        locked: { position: false, size: false, editing: false },
        layerName: customComp.name,
        children: [],
        states: { default: {}, hover: {}, active: {}, disabled: {} },
        currentState: "default",
      }
      setComponents((prev) => {
        const next = [...prev, newComponent]
        saveToHistory(next, "add", `Added ${customComp.name}`)
        return next
      })
      setSelectedId(newComponent.id)
      setSelectedIds([newComponent.id])
      return newComponent.id
    },
    [saveToHistory],
  )

  const updateComponent = useCallback(
    (id, updates) => {
      setComponents((prev) => {
        const next = prev.map((comp) => (comp.id === id ? { ...comp, ...updates } : comp))
        saveToHistory(next, "update", "Updated component")
        return next
      })
    },
    [saveToHistory],
  )

  const updateComponentProps = useCallback(
    (id, propUpdates) => {
      setComponents((prev) => {
        const next = prev.map((comp) => (comp.id === id ? { ...comp, props: { ...comp.props, ...propUpdates } } : comp))
        saveToHistory(next, "update", "Updated properties")
        return next
      })
    },
    [saveToHistory],
  )

  const updateComponentFromJSON = useCallback(
    (id, jsonString) => {
      try {
        const parsed = JSON.parse(jsonString)
        setComponents((prev) => {
          const next = prev.map((comp) => {
            if (comp.id !== id) return comp
            return {
              ...comp,
              position: parsed.position || comp.position,
              size: parsed.size || comp.size,
              props: { ...comp.props, ...parsed.props },
              transform: { ...comp.transform, ...parsed.transform },
            }
          })
          saveToHistory(next, "update", "Updated from JSON")
          return next
        })
        return { success: true }
      } catch (e) {
        return { success: false, error: e.message }
      }
    },
    [saveToHistory],
  )

  const toggleLock = useCallback((id, lockType) => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, locked: { ...comp.locked, [lockType]: !comp.locked[lockType] } } : comp,
      ),
    )
  }, [])

  const renameLayer = useCallback((id, newName) => {
    setComponents((prev) => prev.map((comp) => (comp.id === id ? { ...comp, layerName: newName } : comp)))
  }, [])

  const reorderLayers = useCallback(
    (fromIndex, toIndex) => {
      setComponents((prev) => {
        const next = [...prev]
        const [removed] = next.splice(fromIndex, 1)
        next.splice(toIndex, 0, removed)
        saveToHistory(next, "update", "Reordered layers")
        return next
      })
    },
    [saveToHistory],
  )

  const deleteComponent = useCallback(
    (id) => {
      setComponents((prev) => {
        const next = prev.filter((comp) => comp.id !== id)
        saveToHistory(next, "delete", "Deleted component")
        return next
      })
      if (selectedId === id) setSelectedId(null)
      setSelectedIds((prev) => prev.filter((sid) => sid !== id))
    },
    [selectedId, saveToHistory],
  )

  const duplicateComponent = useCallback(
    (id) => {
      const original = components.find((comp) => comp.id === id)
      if (!original) return

      const duplicate = {
        ...original,
        id: generateId(),
        props: { ...original.props },
        position: {
          x: original.position.x + 20,
          y: original.position.y + 20,
        },
        transform: { ...original.transform },
        locked: { position: false, size: false, editing: false },
        layerName: `${original.layerName}-copy`,
        states: JSON.parse(JSON.stringify(original.states || {})),
      }
      setComponents((prev) => {
        const next = [...prev, duplicate]
        saveToHistory(next, "add", "Duplicated component")
        return next
      })
      setSelectedId(duplicate.id)
      setSelectedIds([duplicate.id])
    },
    [components, saveToHistory],
  )

  const copyComponent = useCallback(
    (id) => {
      const component = components.find((comp) => comp.id === id)
      if (component) {
        setClipboard({
          ...component,
          props: { ...component.props },
          transform: { ...component.transform },
          states: JSON.parse(JSON.stringify(component.states || {})),
        })
      }
    },
    [components],
  )

  const pasteComponent = useCallback(() => {
    if (!clipboard) return

    const pasted = {
      ...clipboard,
      id: generateId(),
      props: { ...clipboard.props },
      position: {
        x: clipboard.position.x + 40,
        y: clipboard.position.y + 40,
      },
      transform: { ...clipboard.transform },
      locked: { position: false, size: false, editing: false },
      states: JSON.parse(JSON.stringify(clipboard.states || {})),
    }
    setComponents((prev) => {
      const next = [...prev, pasted]
      saveToHistory(next, "add", "Pasted component")
      return next
    })
    setSelectedId(pasted.id)
    setSelectedIds([pasted.id])
  }, [clipboard, saveToHistory])

  const moveComponent = useCallback((id, position) => {
    setComponents((prev) => prev.map((comp) => (comp.id === id ? { ...comp, position } : comp)))
  }, [])

  const resizeComponent = useCallback((id, size) => {
    setComponents((prev) => prev.map((comp) => (comp.id === id ? { ...comp, size } : comp)))
  }, [])

  const groupComponents = useCallback(
    (ids) => {
      if (ids.length < 2) return

      const componentsToGroup = components.filter((c) => ids.includes(c.id))
      if (componentsToGroup.length < 2) return

      // Calculate bounding box
      const minX = Math.min(...componentsToGroup.map((c) => c.position.x))
      const minY = Math.min(...componentsToGroup.map((c) => c.position.y))
      const maxX = Math.max(...componentsToGroup.map((c) => c.position.x + c.size.width))
      const maxY = Math.max(...componentsToGroup.map((c) => c.position.y + c.size.height))

      const groupComponent = {
        id: generateId(),
        type: "group",
        props: {},
        position: { x: minX, y: minY },
        size: { width: maxX - minX, height: maxY - minY },
        transform: { rotate: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0 },
        locked: { position: false, size: false, editing: false },
        layerName: `Group-${Date.now().toString(36)}`,
        children: componentsToGroup.map((c) => ({
          ...c,
          position: {
            x: c.position.x - minX,
            y: c.position.y - minY,
          },
        })),
        states: { default: {}, hover: {}, active: {}, disabled: {} },
        currentState: "default",
      }

      setComponents((prev) => {
        const next = prev.filter((c) => !ids.includes(c.id))
        next.push(groupComponent)
        saveToHistory(next, "update", "Grouped components")
        return next
      })

      setSelectedId(groupComponent.id)
      setSelectedIds([groupComponent.id])
    },
    [components, saveToHistory],
  )

  const ungroupComponents = useCallback(
    (groupId) => {
      const group = components.find((c) => c.id === groupId && c.type === "group")
      if (!group || !group.children?.length) return

      const ungroupedComponents = group.children.map((child) => ({
        ...child,
        id: generateId(),
        position: {
          x: child.position.x + group.position.x,
          y: child.position.y + group.position.y,
        },
      }))

      setComponents((prev) => {
        const next = prev.filter((c) => c.id !== groupId)
        next.push(...ungroupedComponents)
        saveToHistory(next, "update", "Ungrouped components")
        return next
      })

      setSelectedId(null)
      setSelectedIds(ungroupedComponents.map((c) => c.id))
    },
    [components, saveToHistory],
  )

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setComponents(JSON.parse(history[newIndex].state))
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setComponents(JSON.parse(history[newIndex].state))
    }
  }, [history, historyIndex])

  const goToHistoryIndex = useCallback(
    (index) => {
      if (index >= 0 && index < history.length) {
        setHistoryIndex(index)
        setComponents(JSON.parse(history[index].state))
      }
    },
    [history],
  )

  const clearCanvas = useCallback(() => {
    setComponents([])
    setSelectedId(null)
    setSelectedIds([])
    saveToHistory([], "delete", "Cleared canvas")
  }, [saveToHistory])

  const selectedComponent = components.find((c) => c.id === selectedId)

  return {
    components,
    selectedId,
    selectedIds,
    selectedComponent,
    zoom,
    pan,
    snappingEnabled,
    clipboard,
    customComponents,
    snapGuides,
    history,
    historyIndex,
    setSelectedId,
    setSelectedIds,
    setZoom,
    setPan,
    setSnappingEnabled,
    setSnapGuides,
    addComponent,
    addCustomComponent,
    saveCustomComponent,
    deleteCustomComponent,
    updateComponent,
    updateComponentProps,
    updateComponentFromJSON,
    toggleLock,
    renameLayer,
    reorderLayers,
    deleteComponent,
    duplicateComponent,
    copyComponent,
    pasteComponent,
    moveComponent,
    resizeComponent,
    groupComponents,
    ungroupComponents,
    undo,
    redo,
    goToHistoryIndex,
    clearCanvas,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  }
}

function getActionLabel(action) {
  switch (action) {
    case "add":
      return "Added component"
    case "delete":
      return "Deleted component"
    case "move":
      return "Moved component"
    case "resize":
      return "Resized component"
    case "update":
      return "Updated component"
    default:
      return "Changed"
  }
}
