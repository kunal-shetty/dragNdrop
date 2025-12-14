"use client"

import { useEffect, useState } from "react"

const steps = [
  "Generating HTML structure…",
  "Applying styles…",
  "Optimizing layout…",
  "Preparing download…",
]

export function ExportProgress({ open, onDone }) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!open) return

    // ✅ RESET when export starts again
    setStep(0)
    setVisible(true)

    let current = 0

    const interval = setInterval(() => {
      current++
      setStep((prev) => Math.min(prev + 1, steps.length - 1))
    }, 800) // slower step changes

    const timeout = setTimeout(() => {
      clearInterval(interval)
      setVisible(false)

      // allow fade-out animation
      setTimeout(onDone, 300)
    }, 3500) // ⏱️ longer duration

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [open, onDone])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/70 backdrop-blur-md">
      <div
        className={`relative w-[320px] rounded-2xl border border-border bg-card px-6 py-6 shadow-2xl transition-all duration-300
        ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        {/* Glow */}
        <div className="absolute -inset-0.5 rounded-2xl bg-neon-cyan/20 blur-xl animate-pulse" />

        <div className="relative space-y-4">
          {/* Spinner + text */}
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neon-cyan border-t-transparent" />
            <span
              key={step}
              className="text-sm text-muted-foreground transition-all duration-300 animate-fade-in"
            >
              {steps[step]}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-neon-cyan transition-all duration-700"
              style={{
                width: `${((step + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
