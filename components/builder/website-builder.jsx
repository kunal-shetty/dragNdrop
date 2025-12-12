"use client"

import { useCallback, useState, useEffect } from "react"
import { DndContext, pointerWithin, useSensor, useSensors, PointerSensor } from "@dnd-kit/core"
import { useEditorState } from "@/hooks/use-editor-state"
import { useCollaboration } from "@/hooks/use-collaboration"
import { Sidebar } from "./sidebar"
import { Canvas } from "./canvas"
import { InspectorPanel } from "./inspector-panel"
import { LayerPanel } from "./layer-panel"
import { CollaborationBar } from "./collaboration-bar"
import { RemoteCursor, PingEffect } from "./remote-cursor"
import { HistoryPanel } from "./history-panel"
import { exportToHTML, downloadHTML } from "@/lib/export-html"
import { Save, Check } from "lucide-react"
import { generateId } from "@/lib/generate-id"

export function WebsiteBuilder({ documentId, collaborationEnabled = false }) {
  // Generate document ID if not provided
  const [docId] = useState(() => documentId || generateId())

  const {
    components,
    selectedId,
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
    undo,
    redo,
    goToHistoryIndex,
    clearCanvas,
    canUndo,
    canRedo,
    groupComponents,
    ungroupComponents,
    selectedIds,
    setSelectedIds,
  } = useEditorState()

  const {
    users,
    cursors,
    pings,
    userId,
    updateCursor,
    updateSelection,
    sendComponentUpdate,
    sendPing,
    startTyping,
    endTyping,
    consumeRemoteUpdate,
    hasRemoteUpdates,
  } = useCollaboration(docId, collaborationEnabled)

  const [saveStatus, setSaveStatus] = useState("saved")
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false)
  const [showLayerPanel, setShowLayerPanel] = useState(true)
  const [showHistoryPanel, setShowHistoryPanel] = useState(false)
  const [responsiveMode, setResponsiveMode] = useState("desktop") // desktop, tablet, mobile

  useEffect(() => {
    if (hasRemoteUpdates) {
      const update = consumeRemoteUpdate()
      if (update) {
        // Apply remote update without adding to history
        if (update.type === "move") {
          moveComponent(update.id, update.position)
        } else if (update.type === "resize") {
          resizeComponent(update.id, update.size)
        } else if (update.type === "props") {
          updateComponentProps(update.id, update.props)
        }
      }
    }
  }, [hasRemoteUpdates, consumeRemoteUpdate, moveComponent, resizeComponent, updateComponentProps])

  useEffect(() => {
    if (collaborationEnabled) {
      updateSelection(selectedId)
    }
  }, [selectedId, collaborationEnabled, updateSelection])

  useEffect(() => {
    setSaveStatus("saving")
    const timer = setTimeout(() => setSaveStatus("saved"), 500)
    return () => clearTimeout(timer)
  }, [components])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragEnd = useCallback(
    (event) => {
      const { active } = event

      if (!active) return

      if (active.data.current?.fromSidebar) {
        const type = active.data.current.type
        const dropX = event.activatorEvent?.clientX ? (event.activatorEvent.clientX - 256) / zoom : 100
        const dropY = event.activatorEvent?.clientY ? (event.activatorEvent.clientY - 48) / zoom : 100

        if (active.data.current.isCustom) {
          const customComp = customComponents.find((c) => c.id === active.data.current.customId)
          if (customComp) {
            addCustomComponent(customComp, { x: Math.max(20, dropX), y: Math.max(20, dropY) })
          }
        } else {
          addComponent(type, { x: Math.max(20, dropX), y: Math.max(20, dropY) })
        }
        return
      }
    },
    [addComponent, addCustomComponent, customComponents, zoom],
  )

  const handleExport = useCallback(() => {
    const html = exportToHTML(components)
    downloadHTML(html)
  }, [components])

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault()
        if (e.shiftKey) {
          redo()
        } else {
          undo()
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedId) {
        e.preventDefault()
        duplicateComponent(selectedId)
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "c" && selectedId) {
        e.preventDefault()
        copyComponent(selectedId)
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "v" && clipboard) {
        e.preventDefault()
        pasteComponent()
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "g" && selectedIds?.length > 1) {
        e.preventDefault()
        groupComponents(selectedIds)
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "G" && selectedId) {
        e.preventDefault()
        ungroupComponents(selectedId)
      }

      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        const activeElement = document.activeElement
        if (activeElement?.tagName !== "INPUT" && activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault()
          deleteComponent(selectedId)
        }
      }
    },
    [
      selectedId,
      selectedIds,
      clipboard,
      undo,
      redo,
      duplicateComponent,
      copyComponent,
      pasteComponent,
      deleteComponent,
      groupComponents,
      ungroupComponents,
    ],
  )

  const handleMouseMove = useCallback(
    (e) => {
      if (collaborationEnabled) {
        updateCursor(e.clientX, e.clientY)
      }
    },
    [collaborationEnabled, updateCursor],
  )

  const handleDoubleClick = useCallback(
    (e) => {
      if (collaborationEnabled) {
        sendPing(e.clientX, e.clientY)
      }
    },
    [collaborationEnabled, sendPing],
  )

  const getCanvasWidth = () => {
    switch (responsiveMode) {
      case "mobile":
        return 375
      case "tablet":
        return 768
      default:
        return "100%"
    }
  }

  return (
    <div
      className="flex h-screen w-full overflow-hidden bg-background"
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onDoubleClick={handleDoubleClick}
      tabIndex={0}
    >
      {collaborationEnabled && users.length > 0 && (
        <CollaborationBar users={users} documentId={docId} currentUserId={userId} />
      )}

      {collaborationEnabled &&
        cursors.map(([cursorUserId, cursor]) => (
          <RemoteCursor key={cursorUserId} x={cursor.x} y={cursor.y} color={cursor.color} name={cursor.name} />
        ))}

      {pings.map((ping) => (
        <PingEffect key={ping.id} x={ping.x} y={ping.y} color={ping.color} />
      ))}

      <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
        <Sidebar
          onUndo={undo}
          onRedo={redo}
          onClear={clearCanvas}
          onExport={handleExport}
          canUndo={canUndo}
          canRedo={canRedo}
          snappingEnabled={snappingEnabled}
          onToggleSnapping={() => setSnappingEnabled(!snappingEnabled)}
          customComponents={customComponents}
          onDeleteCustomComponent={deleteCustomComponent}
          showLayerPanel={showLayerPanel}
          onToggleLayerPanel={() => setShowLayerPanel(!showLayerPanel)}
          showHistoryPanel={showHistoryPanel}
          onToggleHistoryPanel={() => setShowHistoryPanel(!showHistoryPanel)}
          responsiveMode={responsiveMode}
          onResponsiveModeChange={setResponsiveMode}
        />

        {showLayerPanel && (
          <LayerPanel
            components={components}
            selectedId={selectedId}
            selectedIds={selectedIds}
            onSelect={setSelectedId}
            onMultiSelect={setSelectedIds}
            onRename={renameLayer}
            onReorder={reorderLayers}
            onToggleLock={toggleLock}
            onDelete={deleteComponent}
            onGroup={groupComponents}
            onUngroup={ungroupComponents}
            collaboratingUsers={users}
          />
        )}

        <div
          className="flex-1 flex flex-col"
          style={{
            maxWidth: responsiveMode !== "desktop" ? getCanvasWidth() : undefined,
            margin: responsiveMode !== "desktop" ? "0 auto" : undefined,
          }}
        >
          <Canvas
            components={components}
            selectedId={selectedId}
            selectedIds={selectedIds}
            zoom={zoom}
            pan={pan}
            snappingEnabled={snappingEnabled}
            snapGuides={snapGuides}
            onSelect={setSelectedId}
            onMultiSelect={setSelectedIds}
            onMove={(id, pos) => {
              moveComponent(id, pos)
              if (collaborationEnabled) {
                sendComponentUpdate({ type: "move", id, position: pos })
              }
            }}
            onResize={(id, size) => {
              resizeComponent(id, size)
              if (collaborationEnabled) {
                sendComponentUpdate({ type: "resize", id, size })
              }
            }}
            onContentChange={(id, props) => {
              updateComponentProps(id, props)
              if (collaborationEnabled) {
                sendComponentUpdate({ type: "props", id, props })
              }
            }}
            onZoomChange={setZoom}
            onPanChange={setPan}
            onSnapGuidesChange={setSnapGuides}
            collaboratingUsers={users}
            currentUserId={userId}
            responsiveMode={responsiveMode}
          />
        </div>

        {showHistoryPanel && (
          <HistoryPanel
            history={history}
            historyIndex={historyIndex}
            onGoToIndex={goToHistoryIndex}
            onClose={() => setShowHistoryPanel(false)}
          />
        )}

        <InspectorPanel
          component={selectedComponent}
          collapsed={inspectorCollapsed}
          onToggleCollapse={() => setInspectorCollapsed(!inspectorCollapsed)}
          onUpdateProps={(props) => {
            if (selectedId) {
              updateComponentProps(selectedId, props)
              if (collaborationEnabled) {
                sendComponentUpdate({ type: "props", id: selectedId, props })
              }
            }
          }}
          onUpdateComponent={(updates) => selectedId && updateComponent(selectedId, updates)}
          onUpdateFromJSON={(json) => selectedId && updateComponentFromJSON(selectedId, json)}
          onToggleLock={(lockType) => selectedId && toggleLock(selectedId, lockType)}
          onDuplicate={duplicateComponent}
          onDelete={deleteComponent}
          onSaveAsCustom={(name) => selectedComponent && saveCustomComponent(selectedComponent, name)}
          snappingEnabled={snappingEnabled}
          onToggleSnapping={() => setSnappingEnabled(!snappingEnabled)}
          onTypingStart={collaborationEnabled ? startTyping : undefined}
          onTypingEnd={collaborationEnabled ? endTyping : undefined}
        />
      </DndContext>
    </div>
  )
}
