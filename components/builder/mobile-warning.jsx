"use client"

import { useState, useEffect } from "react"
import { Monitor, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileWarning({ children }) {
  const [isMobile, setIsMobile] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      // Check viewport width and touch capability
      const isSmallScreen = window.innerWidth < 768
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )

      setIsMobile(isSmallScreen || (isTouchDevice && isMobileUserAgent && window.innerWidth < 1024))
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  if (isMobile && !dismissed) {
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
              Desktop Experience <span className="text-neon-cyan">Recommended</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              This editor works best on a laptop or tablet. For the best experience, please switch to a larger device.
            </p>
          </div>

          {/* Device illustration */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="flex flex-col items-center gap-2 opacity-40">
              <Smartphone className="w-8 h-8" />
              <span className="text-xs text-muted-foreground">Mobile</span>
            </div>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="flex flex-col items-center gap-2 text-neon-cyan">
              <Monitor className="w-10 h-10" />
              <span className="text-xs">Desktop</span>
            </div>
          </div>

          {/* Continue button */}
          <Button
            onClick={() => setDismissed(true)}
            variant="outline"
            className="border-border hover:border-neon-cyan/50 hover:text-neon-cyan"
          >
            Continue Anyway
          </Button>

          {/* Warning */}
          <p className="text-xs text-muted-foreground">Some features may not work correctly on mobile devices</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
