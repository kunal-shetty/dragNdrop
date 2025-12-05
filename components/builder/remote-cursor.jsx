"use client"

import { MousePointer2 } from "lucide-react"

export function RemoteCursor({ x, y, color, name }) {
  return (
    <div
      className="fixed pointer-events-none z-[9999] cursor-appear"
      style={{
        left: x,
        top: y,
        transform: "translate(-2px, -2px)",
      }}
    >
      <MousePointer2 className="w-5 h-5 drop-shadow-lg" style={{ color, fill: color }} />
      <div
        className="absolute left-4 top-4 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap"
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
    </div>
  )
}

export function PingEffect({ x, y, color }) {
  return (
    <div
      className="fixed pointer-events-none z-[9998]"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className="w-8 h-8 rounded-full ping-effect"
        style={{
          backgroundColor: color,
          opacity: 0.6,
        }}
      />
    </div>
  )
}
