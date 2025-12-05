"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createCollaborationManager } from "@/lib/collaboration"

export function useCollaboration(documentId, enabled = true) {
  const [users, setUsers] = useState([])
  const [cursors, setCursors] = useState([])
  const [pings, setPings] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [remoteUpdates, setRemoteUpdates] = useState([])

  const managerRef = useRef(null)

  useEffect(() => {
    if (!enabled || !documentId) return

    const manager = createCollaborationManager(documentId, {
      onUsersChange: (newUsers) => setUsers(newUsers),
      onCursorsChange: (newCursors) => setCursors(newCursors),
      onPing: (ping) => {
        setPings((prev) => [...prev, ping])
        setTimeout(() => {
          setPings((prev) => prev.filter((p) => p.id !== ping.id))
        }, 1000)
      },
      onTypingChange: (typing) => setTypingUsers(typing),
      onRemoteUpdate: (update) => {
        setRemoteUpdates((prev) => [...prev, update])
      },
    })

    manager.init()
    managerRef.current = manager

    // Set initial user
    setUsers([
      {
        id: manager.userId,
        name: manager.userName,
        color: manager.userColor,
      },
    ])

    return () => {
      manager.destroy()
      managerRef.current = null
    }
  }, [documentId, enabled])

  const updateCursor = useCallback((x, y) => {
    managerRef.current?.updateCursor(x, y)
  }, [])

  const updateSelection = useCallback((selectedId) => {
    managerRef.current?.updateSelection(selectedId)
  }, [])

  const sendComponentUpdate = useCallback((update) => {
    managerRef.current?.sendComponentUpdate(update)
  }, [])

  const sendPing = useCallback((x, y) => {
    managerRef.current?.sendPing(x, y)
  }, [])

  const startTyping = useCallback(() => {
    managerRef.current?.startTyping()
  }, [])

  const endTyping = useCallback(() => {
    managerRef.current?.endTyping()
  }, [])

  const consumeRemoteUpdate = useCallback(() => {
    if (remoteUpdates.length > 0) {
      const update = remoteUpdates[0]
      setRemoteUpdates((prev) => prev.slice(1))
      return update
    }
    return null
  }, [remoteUpdates])

  return {
    users,
    cursors,
    pings,
    typingUsers,
    userId: managerRef.current?.userId,
    userName: managerRef.current?.userName,
    userColor: managerRef.current?.userColor,
    updateCursor,
    updateSelection,
    sendComponentUpdate,
    sendPing,
    startTyping,
    endTyping,
    consumeRemoteUpdate,
    hasRemoteUpdates: remoteUpdates.length > 0,
  }
}
