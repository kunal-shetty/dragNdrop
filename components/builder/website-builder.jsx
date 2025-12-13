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
import { MobileWarning } from "./mobile-warning"
import { PremiumModal } from "./premium-modal"
import { exportToHTML, downloadHTML } from "@/lib/export-html"
import { Save, Check, Eye, EyeOff } from "lucide-react"
import { generateId } from "@/lib/generate-id"
import { AIChatbot } from "./ai-chatbot"
import { OnboardingTour } from "./onboarding-tour"
import { Button } from "@/components/ui/button"
import { trackUsage, usageCount, limit } from "@/lib/usage-tracking"

export function WebsiteBuilder({ documentId, collaborationEnabled = false }) {
  const [docId] = useState(() => documentId || generateId())
  const [isPremiumOpen, setIsPremiumOpen] = useState(false)

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
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
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
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [showHistoryPanel, setShowHistoryPanel] = useState(false)
  const [responsiveMode, setResponsiveMode] = useState("desktop")
  const [physicsEnabled, setPhysicsEnabled] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const savedState = localStorage.getItem("inspector-collapsed")
    if (savedState !== null) {
      setInspectorCollapsed(JSON.parse(savedState))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("inspector-collapsed", JSON.stringify(inspectorCollapsed))
  }, [inspectorCollapsed])

  useEffect(() => {
    if (hasRemoteUpdates) {
      const update = consumeRemoteUpdate()
      if (update) {
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

  useEffect(() => {
    if (selectedId && inspectorCollapsed) {
      setInspectorCollapsed(false)
    }
  }, [selectedId])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
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
    if (!trackUsage()) {
      setIsPremiumOpen(true)
      return
    }
    const html = exportToHTML(components)
    downloadHTML(html)
  }, [components, trackUsage, setIsPremiumOpen])

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

      if ((e.ctrlKey || e.metaKey) && e.key === "]" && selectedId) {
        e.preventDefault()
        bringForward(selectedId)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "[" && selectedId) {
        e.preventDefault()
        sendBackward(selectedId)
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "]" && selectedId) {
        e.preventDefault()
        bringToFront(selectedId)
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "[" && selectedId) {
        e.preventDefault()
        sendToBack(selectedId)
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
      bringToFront,
      sendToBack,
      bringForward,
      sendBackward,
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

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode)
    if (!previewMode) {
      setSidebarCollapsed(true)
      setInspectorCollapsed(true)
      setShowLayerPanel(false)
      setShowHistoryPanel(false)
    } else {
      setSidebarCollapsed(false)
      setInspectorCollapsed(false)
    }
  }

  return (
    <MobileWarning>
      <OnboardingTour />

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

        <Button
          variant="outline"
          size="sm"
          onClick={togglePreviewMode}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-card/90 backdrop-blur-sm border-border gap-2"
        >
          {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {previewMode ? "Exit Preview" : "Preview Mode"}
        </Button>

        <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
          {!previewMode && (
            <Sidebar
              collapsed={sidebarCollapsed}
              onCollapse={() => setSidebarCollapsed(true)}
              onExpand={() => setSidebarCollapsed(false)}
              onUndo={undo}
              onRedo={redo}
              onClear={clearCanvas}
              onExport={handleExport}
              canUndo={canUndo}
              canRedo={canRedo}
              canExport={true}
              snappingEnabled={snappingEnabled}
              onToggleSnapping={() => setSnappingEnabled(!snappingEnabled)}
              physicsEnabled={physicsEnabled}
              onTogglePhysics={() => setPhysicsEnabled(!physicsEnabled)}
              customComponents={customComponents}
              onDeleteCustomComponent={deleteCustomComponent}
              showLayerPanel={showLayerPanel}
              onToggleLayerPanel={() => setShowLayerPanel(!showLayerPanel)}
              showHistoryPanel={showHistoryPanel}
              onToggleHistoryPanel={() => setShowHistoryPanel(!showHistoryPanel)}
              responsiveMode={responsiveMode}
              onResponsiveModeChange={setResponsiveMode}
            />
          )}

          {!previewMode && showLayerPanel && (
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
              onBringForward={bringForward}
              onSendBackward={sendBackward}
              onBringToFront={bringToFront}
              onSendToBack={sendToBack}
              collaboratingUsers={users}
            />
          )}

          <div
            className="flex-1 flex flex-col min-w-0"
            style={{
              maxWidth: responsiveMode !== "desktop" ? getCanvasWidth() : undefined,
              margin: responsiveMode !== "desktop" ? "0 auto" : undefined,
            }}
          >
            <Canvas
              components={components}
              selectedId={previewMode ? null : selectedId}
              selectedIds={previewMode ? [] : selectedIds}
              zoom={zoom}
              pan={pan}
              snappingEnabled={snappingEnabled}
              snapGuides={snapGuides}
              physicsEnabled={physicsEnabled}
              onSelect={previewMode ? () => {} : setSelectedId}
              onMultiSelect={previewMode ? () => {} : setSelectedIds}
              onMove={(id, pos) => {
                if (previewMode) return
                moveComponent(id, pos)
                if (collaborationEnabled) {
                  sendComponentUpdate({ type: "move", id, position: pos })
                }
              }}
              onResize={(id, size) => {
                if (previewMode) return
                resizeComponent(id, size)
                if (collaborationEnabled) {
                  sendComponentUpdate({ type: "resize", id, size })
                }
              }}
              onContentChange={(id, props) => {
                if (previewMode) return
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

          {!previewMode && showHistoryPanel && (
            <HistoryPanel
              history={history}
              historyIndex={historyIndex}
              onGoToIndex={goToHistoryIndex}
              onClose={() => setShowHistoryPanel(false)}
            />
          )}

          {!previewMode && (
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
              onBringToFront={() => selectedId && bringToFront(selectedId)}
              onSendToBack={() => selectedId && sendToBack(selectedId)}
              onBringForward={() => selectedId && bringForward(selectedId)}
              onSendBackward={() => selectedId && sendBackward(selectedId)}
              snappingEnabled={snappingEnabled}
              onToggleSnapping={() => setSnappingEnabled(!snappingEnabled)}
              onTypingStart={collaborationEnabled ? startTyping : undefined}
              onTypingEnd={collaborationEnabled ? endTyping : undefined}
            />
          )}
        </DndContext>

        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border text-xs">
          {saveStatus === "saving" ? (
            <>
              <Save className="w-3 h-3 text-neon-cyan animate-pulse" />
              <span className="text-muted-foreground">Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-3 h-3 text-neon-cyan" />
              <span className="text-muted-foreground">Saved</span>
            </>
          )}
          <span className="ml-2 text-muted-foreground border-l border-border pl-2">
            {usageCount > 5 ? 5 : usageCount}/{limit} exports
          </span>
        </div>

        <PremiumModal isOpen={isPremiumOpen} onClose={() => setIsPremiumOpen(false)} />

        <AIChatbot />
      </div>
    </MobileWarning>
  )
}
