"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, ChevronRight, ChevronLeft } from "lucide-react"

const tourSteps = [
  {
    title: "Welcome to BuildIT - The Ultimate Website Builder!",
    description:
      "Let me show you around. This powerful editor lets you create stunning websites with drag-and-drop ease.",
    highlight: null,
  },
  {
    title: "Component Sidebar",
    description:
      "Drag any component from the sidebar onto the canvas. We have 14+ components including text, buttons, images, sections, and more!",
    highlight: "sidebar",
  },
  {
    title: "Canvas Area",
    description:
      "This is your design canvas. Drop components here, move them around freely, and resize them using the handles. Use Ctrl+Scroll to zoom!",
    highlight: "canvas",
  },
  {
    title: "Inspector Panel",
    description:
      "Select any component to edit its properties here: colors, fonts, spacing, borders, shadows, and transforms. Try different tabs!",
    highlight: "inspector",
  },
  {
    title: "Layer Panel",
    description:
      "Manage your component layers here. Drag to reorder, adjust z-index, lock components, and organize your design.",
    highlight: "layers",
  },
  {
    title: "Keyboard Shortcuts",
    description:
      "Speed up your workflow:\n• Ctrl+Z/Y: Undo/Redo\n• Ctrl+D: Duplicate\n• Ctrl+C/V: Copy/Paste\n• Delete: Remove\n• Arrow Keys: Move (Shift for 10px)\n• Ctrl+]/[: Layer order",
    highlight: null,
  },
  {
    title: "Export Your Design",
    description:
      "When you're done, click the Export button to download clean HTML/CSS code. Auto-save keeps your work safe!",
    highlight: "sidebar",
  },
]

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenTour")
    if (!hasSeenTour) {
      // Delay to let the UI load
      setTimeout(() => setIsOpen(true), 1000)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem("hasSeenTour", "true")
  }

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!isOpen) return null

  const step = tourSteps[currentStep]

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={handleClose} />

      {/* Tour card */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[32rem] bg-card border-2 border-neon-cyan/40 rounded-2xl shadow-2xl shadow-neon-cyan/20">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center text-white text-sm font-bold">
                  {currentStep + 1}
                </div>
                <span className="text-xs text-muted-foreground">
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground">{step.title}</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{step.description}</p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 py-2">
            {tourSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep ? "w-8 bg-neon-cyan" : idx < currentStep ? "w-2 bg-neon-cyan/40" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 0} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button
              onClick={currentStep === tourSteps.length - 1 ? handleClose : handleNext}
              className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90 gap-2"
            >
              {currentStep === tourSteps.length - 1 ? "Get Started!" : "Next"}
              {currentStep < tourSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
