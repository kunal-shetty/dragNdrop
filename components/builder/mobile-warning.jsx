"use client"

import { useState, useEffect } from "react"
import { Monitor, Smartphone, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileWarning({ children }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const isSmallScreen = window.innerWidth < 768
      setIsMobile(isSmallScreen)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Icon */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-card border border-neon-cyan/40 flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-neon-cyan" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-foreground">
              Desktop <span className="text-neon-cyan">Required</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              This editor requires a desktop or laptop computer with a minimum screen width of 768px. The complex
              drag-and-drop interface is not supported on mobile devices.
            </p>
          </div>

          {/* Device illustration */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="flex flex-col items-center gap-2 opacity-40">
              <Smartphone className="w-8 h-8" />
              <span className="text-xs text-muted-foreground">Not Available</span>
            </div>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="flex flex-col items-center gap-2 text-neon-cyan">
              <Monitor className="w-10 h-10" />
              <span className="text-xs">Use Desktop</span>
            </div>
          </div>

          {/* Back to home button */}
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90 gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Back to Home
          </Button>

          {/* Info */}
          <p className="text-xs text-muted-foreground">
            Please visit this page on a desktop or laptop computer to use the editor
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
