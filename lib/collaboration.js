// Collaboration state management for real-time multiplayer editing
// Uses BroadcastChannel API for same-origin tab sync (demo mode)
// Can be extended with WebSocket/Liveblocks for real multiplayer

import { generateId } from "./generate-id"

const COLORS = [
  "#00d9ff", // cyan
  "#ff00d9", // magenta
  "#9d00ff", // purple
  "#00ff9d", // teal
  "#ff9d00", // orange
  "#ff0066", // pink
  "#66ff00", // lime
  "#0066ff", // blue
]

const ANIMALS = ["Fox", "Wolf", "Bear", "Eagle", "Hawk", "Lion", "Tiger", "Panther", "Dragon", "Phoenix"]

function generateUserName() {
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  const num = Math.floor(Math.random() * 100)
  return `${animal}${num}`
}

function generateUserColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

export function createCollaborationManager(documentId, callbacks) {
  const userId = generateId()
  const userName = generateUserName()
  const userColor = generateUserColor()

  let channel = null
  const users = new Map()
  const cursors = new Map()
  let pings = []
  const typingUsers = new Set()

  const self = {
    id: userId,
    name: userName,
    color: userColor,
    cursor: { x: 0, y: 0 },
    selectedId: null,
  }

  users.set(userId, self)

  // Initialize BroadcastChannel for same-origin communication
  function init() {
    if (typeof window === "undefined") return

    try {
      channel = new BroadcastChannel(`BuildIT-${documentId}`)

      channel.onmessage = (event) => {
        handleMessage(event.data)
      }

      // Announce presence
      broadcast({
        type: "join",
        user: self,
      })

      // Request current state from other tabs
      broadcast({
        type: "state-request",
        userId,
      })
    } catch (e) {
      console.warn("BroadcastChannel not supported, collaboration disabled")
    }
  }

  function handleMessage(message) {
    switch (message.type) {
      case "join":
        if (message.user.id !== userId) {
          users.set(message.user.id, message.user)
          // Send current state to new user
          broadcast({
            type: "state-sync",
            targetUserId: message.user.id,
            users: Array.from(users.values()),
          })
          callbacks.onUsersChange?.(Array.from(users.values()))
        }
        break

      case "leave":
        users.delete(message.userId)
        cursors.delete(message.userId)
        typingUsers.delete(message.userId)
        callbacks.onUsersChange?.(Array.from(users.values()))
        callbacks.onCursorsChange?.(Array.from(cursors.entries()))
        break

      case "cursor-move":
        if (message.userId !== userId) {
          cursors.set(message.userId, {
            x: message.x,
            y: message.y,
            color: message.color,
            name: message.name,
          })
          callbacks.onCursorsChange?.(Array.from(cursors.entries()))
        }
        break

      case "selection-change":
        if (message.userId !== userId) {
          const user = users.get(message.userId)
          if (user) {
            user.selectedId = message.selectedId
            users.set(message.userId, user)
            callbacks.onUsersChange?.(Array.from(users.values()))
          }
        }
        break

      case "component-update":
        if (message.userId !== userId) {
          callbacks.onRemoteUpdate?.(message.update)
        }
        break

      case "ping":
        if (message.userId !== userId) {
          const newPing = {
            id: generateId(),
            x: message.x,
            y: message.y,
            color: message.color,
          }
          pings.push(newPing)
          callbacks.onPing?.(newPing)
          setTimeout(() => {
            pings = pings.filter((p) => p.id !== newPing.id)
          }, 1000)
        }
        break

      case "typing-start":
        if (message.userId !== userId) {
          typingUsers.add(message.userId)
          callbacks.onTypingChange?.(Array.from(typingUsers))
        }
        break

      case "typing-end":
        typingUsers.delete(message.userId)
        callbacks.onTypingChange?.(Array.from(typingUsers))
        break

      case "state-sync":
        if (message.targetUserId === userId) {
          message.users.forEach((u) => {
            if (u.id !== userId) {
              users.set(u.id, u)
            }
          })
          callbacks.onUsersChange?.(Array.from(users.values()))
        }
        break

      case "state-request":
        if (message.userId !== userId) {
          broadcast({
            type: "state-sync",
            targetUserId: message.userId,
            users: Array.from(users.values()),
          })
        }
        break
    }
  }

  function broadcast(message) {
    if (channel) {
      try {
        channel.postMessage(message)
      } catch (e) {
        console.warn("Failed to broadcast:", e)
      }
    }
  }

  // Public API
  return {
    userId,
    userName,
    userColor,

    init,

    destroy() {
      broadcast({ type: "leave", userId })
      channel?.close()
    },

    updateCursor(x, y) {
      self.cursor = { x, y }
      broadcast({
        type: "cursor-move",
        userId,
        x,
        y,
        color: userColor,
        name: userName,
      })
    },

    updateSelection(selectedId) {
      self.selectedId = selectedId
      broadcast({
        type: "selection-change",
        userId,
        selectedId,
      })
    },

    sendComponentUpdate(update) {
      broadcast({
        type: "component-update",
        userId,
        update,
      })
    },

    sendPing(x, y) {
      broadcast({
        type: "ping",
        userId,
        x,
        y,
        color: userColor,
      })
    },

    startTyping() {
      broadcast({
        type: "typing-start",
        userId,
      })
    },

    endTyping() {
      broadcast({
        type: "typing-end",
        userId,
      })
    },

    getUsers() {
      return Array.from(users.values())
    },

    getCursors() {
      return Array.from(cursors.entries())
    },
  }
}
