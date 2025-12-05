"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Zap,
  Layers,
  Palette,
  MousePointer2,
  ChevronRight,
  Sparkles,
  Code2,
  Monitor,
  Lock,
  RotateCw,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const features = [
    {
      icon: MousePointer2,
      title: "Drag & Drop",
      description: "Intuitive interface for effortless website creation",
    },
    {
      icon: Layers,
      title: "Layer Control",
      description: "Figma-style layer management with precise z-index",
    },
    {
      icon: RotateCw,
      title: "Transform Tools",
      description: "Rotate, scale, skew with advanced controls",
    },
    {
      icon: Palette,
      title: "Style Editor",
      description: "Advanced styling with neon effects",
    },
    {
      icon: Lock,
      title: "Component Locking",
      description: "Lock position, size, or editing per layer",
    },
    {
      icon: Save,
      title: "Custom Components",
      description: "Save and reuse your own component library",
    },
  ]

  const examples = [
    { title: "Landing Page", color: "neon-cyan" },
    { title: "Dashboard UI", color: "neon-magenta" },
    { title: "Portfolio Site", color: "neon-purple" },
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden relative font-sans">
      {/* Wave gradient background */}
      <div className="fixed inset-0 wave-gradient opacity-60" />

      {/* Mouse follow glow - subtle */}
      <div
        className="fixed w-80 h-80 rounded-full pointer-events-none opacity-15 blur-3xl transition-all duration-500 ease-out"
        style={{
          background: "radial-gradient(circle, oklch(0.8 0.2 195) 0%, transparent 70%)",
          left: mousePosition.x - 160,
          top: mousePosition.y - 160,
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-border/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-cyan/20 flex items-center justify-center neon-glow-cyan">
            <Sparkles className="w-5 h-5 text-neon-cyan" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Neon<span className="text-neon-cyan">Forge</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#features" className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
            Features
          </Link>
          <Link href="#examples" className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
            Examples
          </Link>
          <Link href="/editor">
            <Button className="bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 hover:bg-neon-cyan/30 h-9">
              Launch Editor
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 pt-20 pb-28">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-magenta/30 bg-neon-magenta/10 mb-8">
            <Zap className="w-3.5 h-3.5 text-neon-magenta" />
            <span className="text-xs font-medium text-neon-magenta">Next-Gen Website Builder</span>
          </div>

          {/* Main heading with corner brackets */}
          <div className="relative inline-block mb-6">
            <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight corner-brackets px-4 py-2">
              <span className="text-foreground">Build Websites</span>
              <br />
              <span className="text-neon-cyan neon-text-cyan">From The Future</span>
            </h1>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Create stunning, responsive websites with our modern drag-and-drop builder. Featuring Figma-style editing,
            advanced customization, and clean code export.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <Link href="/editor">
              <Button
                size="lg"
                className="bg-neon-cyan text-background hover:bg-neon-cyan/90 neon-pulse px-8 h-12 text-base font-medium"
              >
                Start Building
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-neon-purple/40 text-neon-purple hover:bg-neon-purple/10 px-8 h-12 text-base bg-transparent"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Hero Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-neon-cyan/10 blur-3xl rounded-3xl" />
            <div className="relative rounded-xl overflow-hidden neon-border bg-card/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary/50">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-chart-4/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-chart-2/60" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">NeonForge Editor</span>
              </div>
              <div className="flex h-72">
                <div className="w-40 border-r border-border p-3 space-y-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Components</div>
                  {["Text", "Button", "Image", "Card"].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 p-2 rounded-md bg-secondary/50 border border-border hover:border-neon-cyan/50 transition-colors"
                    >
                      <div className="w-5 h-5 rounded bg-neon-cyan/20" />
                      <span className="text-xs">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-4 cyber-grid relative">
                  <div className="absolute top-6 left-6 w-56 h-12 rounded-lg bg-neon-cyan/10 border border-neon-cyan/40 flex items-center justify-center">
                    <span className="text-neon-cyan text-sm font-medium">Hero Section</span>
                  </div>
                  <div className="absolute top-24 left-6 w-40 h-10 rounded-lg bg-neon-magenta/10 border border-neon-magenta/40 flex items-center justify-center">
                    <span className="text-neon-magenta text-xs">Call to Action</span>
                  </div>
                  <div className="absolute top-24 right-16 w-32 h-24 rounded-lg bg-neon-purple/10 border border-neon-purple/40 flex items-center justify-center">
                    <span className="text-neon-purple text-xs">Card Block</span>
                  </div>
                </div>
                <div className="w-44 border-l border-border p-3">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Inspector</div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1.5">Width</div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-neon-cyan rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1.5">Opacity</div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full w-full bg-neon-magenta rounded-full" />
                      </div>
                    </div>
                    <div className="flex gap-1.5 pt-2">
                      <div className="w-6 h-6 rounded bg-neon-cyan" />
                      <div className="w-6 h-6 rounded bg-neon-magenta" />
                      <div className="w-6 h-6 rounded bg-neon-purple" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-8 py-20 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-3">
              <span className="text-neon-magenta">Powerful</span> Features
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to create stunning websites without code
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-5 rounded-xl bg-card/40 border border-border hover:border-neon-cyan/40 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center mb-4 group-hover:bg-neon-cyan/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-neon-cyan" />
                </div>
                <h3 className="text-base font-medium mb-1.5 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="relative z-10 px-8 py-20 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-3">
              View <span className="text-neon-purple">Examples</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">See what you can build with NeonForge</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {examples.map((example) => (
              <div key={example.title} className="rounded-xl overflow-hidden neon-border bg-card/40">
                <div className="aspect-video bg-secondary/30 flex items-center justify-center cyber-grid">
                  <Code2 className={`w-10 h-10 text-${example.color} opacity-40`} />
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-1">{example.title}</h4>
                  <p className="text-xs text-muted-foreground">Built with NeonForge</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-8 py-20 border-t border-border/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Ready to Build Something <span className="text-neon-cyan">Amazing</span>?
          </h2>
          <p className="text-muted-foreground mb-8">Join the future of web design. No coding required.</p>
          <Link href="/editor">
            <Button
              size="lg"
              className="bg-neon-cyan text-background hover:bg-neon-cyan/90 neon-pulse px-10 h-12 text-base font-medium"
            >
              Launch NeonForge
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-10 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          {/* Neon divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
              </div>
              <span className="font-medium tracking-tight">
                Neon<span className="text-neon-cyan">Forge</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Built for creators who dare to be different</p>
            <span className="text-xs text-muted-foreground font-mono">v2.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
