"use client"

import { useState, useEffect, useRef } from "react"
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
  Settings,
  Sliders,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import AlternatingBuilderCTA from "./ctas"
import { toast } from "sonner"

// Particle system
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
}

function useParticles(count: number, enabled: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Initialize particles
    const colors = ["#22d3ee", "#e879f9", "#a855f7"]
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.2,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      })

      // Draw connections
      ctx.globalAlpha = 0.1
      ctx.strokeStyle = "#22d3ee"
      ctx.lineWidth = 0.5
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x
          const dy = particlesRef.current[i].y - particlesRef.current[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y)
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y)
            ctx.stroke()
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [count, enabled])

  return canvasRef
}

export function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    particleDensity: 50,
    motionStrength: 1,
    glowIntensity: 1,
    particlesEnabled: true,
  })

  const canvasRef = useParticles(settings.particleDensity, settings.particlesEnabled)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Parallax calculation
  const parallaxX = mounted ? (mousePosition.x - window.innerWidth / 2) * 0.02 * settings.motionStrength : 0

  const parallaxY = mounted ? (mousePosition.y - window.innerHeight / 2) * 0.02 * settings.motionStrength : 0

  const features = [
    { icon: MousePointer2, title: "Drag & Drop", description: "Intuitive interface for effortless website creation" },
    { icon: Layers, title: "Layer Control", description: "Figma-style layer management with precise z-index" },
    { icon: RotateCw, title: "Transform Tools", description: "Rotate, scale, skew with advanced controls" },
    { icon: Palette, title: "Style Editor", description: "Advanced styling with neon effects" },
    { icon: Lock, title: "Component Locking", description: "Lock position, size, or editing per layer" },
    { icon: Save, title: "Custom Components", description: "Save and reuse your own component library" },
  ]

  const floatingComponents = [
    { name: "Hero", color: "#22d3ee", x: 15, y: 20, delay: 0 },
    { name: "Card", color: "#e879f9", x: 80, y: 15, delay: 0.5 },
    { name: "Button", color: "#a855f7", x: 10, y: 70, delay: 1 },
    { name: "Navbar", color: "#22d3ee", x: 85, y: 65, delay: 1.5 },
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden relative font-sans">
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} />

      {/* Depth blur layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Foreground blur */}
        <div
          className="absolute w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)",
            left: "10%",
            top: "20%",
            transform: `translate(${parallaxX * 2}px, ${parallaxY * 2}px)`,
            filter: "blur(40px)",
          }}
        />
        {/* Background sharp elements */}
        <div
          className="absolute w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #e879f9 0%, transparent 70%)",
            right: "10%",
            bottom: "20%",
            transform: `translate(${-parallaxX * 0.5}px, ${-parallaxY * 0.5}px)`,
          }}
        />
      </div>

      {/* Animated neon blurs behind hero */}
      <div
        className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse, oklch(0.75 0.2 195 / ${0.15 * settings.glowIntensity}) 0%, transparent 70%)`,
          filter: `blur(${60 * settings.glowIntensity}px)`,
          animation: "pulse 4s ease-in-out infinite",
        }}
      />
      <div
        className="fixed top-1/3 left-1/3 w-[400px] h-[400px] pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle, oklch(0.7 0.25 330 / ${0.1 * settings.glowIntensity}) 0%, transparent 70%)`,
          filter: `blur(${80 * settings.glowIntensity}px)`,
          animation: "pulse 5s ease-in-out infinite 1s",
        }}
      />

      {/* Mouse follow glow */}
      <div
        className="fixed w-80 h-80 rounded-full pointer-events-none z-10 transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(circle, oklch(0.8 0.2 195 / ${0.12 * settings.glowIntensity}) 0%, transparent 70%)`,
          left: mousePosition.x - 160,
          top: mousePosition.y - 160,
          filter: "blur(20px)",
        }}
      />

      {/* Floating 3D-like component previews */}
      {floatingComponents.map((comp, i) => (
        <div
          key={comp.name}
          className="fixed pointer-events-none z-5 opacity-40"
          style={{
            left: `${comp.x}%`,
            top: `${comp.y}%`,
            transform: `translate(${parallaxX * (i % 2 === 0 ? 1 : -1) * settings.motionStrength}px, ${parallaxY * (i % 2 === 0 ? -1 : 1) * settings.motionStrength}px)`,
            animation: `float 6s ease-in-out infinite ${comp.delay}s`,
          }}
        >
          <div
            className="px-4 py-2 rounded-lg border backdrop-blur-sm"
            style={{
              borderColor: `${comp.color}40`,
              background: `linear-gradient(135deg, ${comp.color}10 0%, transparent 100%)`,
              boxShadow: `0 0 20px ${comp.color}20`,
            }}
          >
            <span className="text-xs font-medium" style={{ color: comp.color }}>
              {comp.name}
            </span>
          </div>
        </div>
      ))}

      {/* Settings Toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:border-neon-cyan/50 transition-colors"
      >
        <Settings className="w-5 h-5 text-neon-cyan" />
      </button>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed bottom-20 right-6 z-50 w-72 p-4 rounded-xl bg-card/90 backdrop-blur-md border border-border shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium">Visual Settings</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Particle Density</label>
              <Slider
                value={[settings.particleDensity]}
                onValueChange={([v]) => setSettings((s) => ({ ...s, particleDensity: v }))}
                min={10}
                max={100}
                step={10}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Motion Strength</label>
              <Slider
                value={[settings.motionStrength * 100]}
                onValueChange={([v]) => setSettings((s) => ({ ...s, motionStrength: v / 100 }))}
                min={0}
                max={200}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Glow Intensity</label>
              <Slider
                value={[settings.glowIntensity * 100]}
                onValueChange={([v]) => setSettings((s) => ({ ...s, glowIntensity: v / 100 }))}
                min={0}
                max={200}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.particlesEnabled}
                onChange={(e) => setSettings((s) => ({ ...s, particlesEnabled: e.target.checked }))}
                className="rounded border-border"
              />
              <span className="text-xs">Enable Particles</span>
            </label>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 border-b border-border/30 backdrop-blur-sm">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg bg-neon-cyan/20 flex items-center justify-center"
            style={{ boxShadow: `0 0 ${20 * settings.glowIntensity}px #22d3ee40` }}
          >
            <Sparkles className="w-5 h-5 text-neon-cyan" />
          </div>

          <span className="text-lg font-semibold tracking-tight text-foreground whitespace-nowrap">
            Build<span className="text-neon-cyan">IT</span>
          </span>

          {/* Mobile links inline */}
          <div className="flex items-center gap-4 sm:hidden">
            <Link
              href="#features"
              className="text-xs text-muted-foreground hover:text-neon-cyan transition-colors"
            >
              Features
            </Link>
            <Link
              href="#examples"
              className="text-xs text-muted-foreground hover:text-neon-cyan transition-colors"
            >
              Examples
            </Link>
          </div>
        </div>

        {/* Desktop right side */}
        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors"
          >
            Features
          </Link>
          <Link
            href="#examples"
            className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors"
          >
            Examples
          </Link>
          <Link href="/editor">
            <Button
              className="bg-neon-cyan text-background hover:bg-neon-cyan/90 px-10 h-12 text-base font-medium"
              style={{ boxShadow: `0 0 ${30 * settings.glowIntensity}px #22d3ee40` }}
            >
              Explore
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="relative z-20 px-8 pt-20 pb-28">
        <div
          className="max-w-5xl mx-auto text-center"
          style={{ transform: `translate(${parallaxX * 0.3}px, ${parallaxY * 0.3}px)` }}
        >
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
              <span className="text-neon-cyan" style={{ textShadow: `0 0 ${40 * settings.glowIntensity}px #22d3ee60` }}>
                From The Future
              </span>
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
                className="bg-neon-cyan text-background hover:bg-neon-cyan/90 px-8 h-12 text-base font-medium"
                style={{ boxShadow: `0 0 ${30 * settings.glowIntensity}px #22d3ee40` }}
              >
                Start Building
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Button
  size="lg"
  variant="outline"
  onClick={() =>
    toast("Coming soon.....", {
  description: "Stay tuned!",
})
  }
  className="border-neon-purple/40 text-neon-purple hover:text-neon-pink px-8 h-12 text-base bg-transparent"
>
  <Monitor className="w-4 h-4 mr-2" />
  Watch Demo
</Button>
          </div>

          {/* Hero Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: `radial-gradient(circle, #22d3ee${Math.round(settings.glowIntensity * 25).toString(16)} 0%, transparent 70%)`,
                filter: "blur(40px)",
              }}
            />
            <div
              className="relative rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm border border-neon-cyan/30"
              style={{ boxShadow: `0 0 ${40 * settings.glowIntensity}px #22d3ee20` }}
            >
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary/50">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-chart-4/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-chart-2/60" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">BuildIT Editor</span>
              </div>
              <div className="flex h-72">
                <div className="w-40 border-r border-border p-3 space-y-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Components</div>
                  {["Text", "Button", "Image", "Card", "Navbar"].map((item) => (
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
                  <div
                    className="absolute top-6 left-6 w-56 h-12 rounded-lg bg-neon-cyan/10 border border-neon-cyan/40 flex items-center justify-center"
                    style={{
                      transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)`,
                      boxShadow: `0 0 ${15 * settings.glowIntensity}px #22d3ee30`,
                    }}
                  >
                    <span className="text-neon-cyan text-sm font-medium">Hero Section</span>
                  </div>
                  <div
                    className="absolute top-24 left-6 w-40 h-10 rounded-lg bg-neon-magenta/10 border border-neon-magenta/40 flex items-center justify-center"
                    style={{
                      transform: `translate(${parallaxX * 0.8}px, ${parallaxY * 0.8}px)`,
                      boxShadow: `0 0 ${15 * settings.glowIntensity}px #e879f930`,
                    }}
                  >
                    <span className="text-neon-magenta text-xs">Call to Action</span>
                  </div>
                  <div
                    className="absolute top-24 right-16 w-32 h-24 rounded-lg bg-neon-purple/10 border border-neon-purple/40 flex items-center justify-center"
                    style={{
                      transform: `translate(${-parallaxX * 0.6}px, ${-parallaxY * 0.6}px)`,
                      boxShadow: `0 0 ${15 * settings.glowIntensity}px #a855f730`,
                    }}
                  >
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
      <section id="features" className="relative z-20 px-8 py-20 border-t border-border/30">
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
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group p-5 rounded-xl bg-card/40 border border-border hover:border-neon-cyan/40 transition-all duration-300"
                style={{
                  transform: `translate(${parallaxX * 0.1 * (i % 3 === 0 ? 1 : i % 3 === 1 ? 0 : -1)}px, ${parallaxY * 0.1 * (i < 3 ? 1 : -1)}px)`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center mb-4 group-hover:bg-neon-cyan/20 transition-colors"
                  style={{ boxShadow: `0 0 ${10 * settings.glowIntensity}px #22d3ee20` }}
                >
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
      <section id="examples" className="relative z-20 px-8 py-20 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-3">
              View <span className="text-neon-purple">Gallery</span> of Possibilities
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">See what you can build with BuildIT</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: "Landing Page", color: "#22d3ee" },
              { title: "Dashboard UI", color: "#e879f9" },
              { title: "Portfolio Site", color: "#a855f7" },
            ].map((example, i) => (
              <div
                key={example.title}
                className="rounded-xl overflow-hidden bg-card/40 border border-border hover:border-opacity-60 transition-all"
                style={{
                  borderColor: `${example.color}40`,
                  boxShadow: `0 0 ${20 * settings.glowIntensity}px ${example.color}10`,
                }}
              >
                <div className="aspect-video bg-secondary/30 flex items-center justify-center cyber-grid">
                  <Code2 className="w-10 h-10 opacity-40" style={{ color: example.color }} />
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-1">{example.title}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-magenta" />
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                    </div>
                    <p className="text-xs text-muted-foreground">Built with BuildIT</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-20 px-8 py-24 border-t border-border/30">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/editor"
            className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 rounded-full 
             bg-neon-cyan/10 border border-neon-cyan/30 mb-6 text-neon-cyan
             hover:bg-neon-magenta/20 hover:border-neon-magenta/30 hover:text-neon-magenta
             transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Ready to create?</span>
          </Link>


          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Building Your{" "}
            <span className="text-neon-cyan" style={{ textShadow: `0 0 ${30 * settings.glowIntensity}px #22d3ee50` }}>
              Dream Website
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of creators who build stunning websites without writing a single line of code. Drag, drop,
            and publish in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/editor">
              <Button
                size="lg"
                className="bg-neon-cyan text-background hover:bg-neon-cyan/90 px-10 h-14 text-lg font-medium min-w-[200px]"
                style={{ boxShadow: `0 0 ${40 * settings.glowIntensity}px #22d3ee50` }}
              >
                Launch BuildIT
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#examples">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:text-neon-magenta px-10 h-14 text-lg bg-transparent min-w-[200px]"
              >
                <Monitor className="w-5 h-5 mr-2" />
                View Examples
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">No credit card required. Free exports included.</p>
        </div>
      </section>
      <AlternatingBuilderCTA />

      {/* Footer */}
      <footer className="relative z-20 px-8 py-10 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <div
            className="h-px w-full mb-8"
            style={{
              background: `linear-gradient(to right, transparent, #22d3ee${Math.round(settings.glowIntensity * 60).toString(16)}, transparent)`,
            }}
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg bg-neon-cyan/20 flex items-center justify-center"
                style={{ boxShadow: `0 0 ${10 * settings.glowIntensity}px #22d3ee30` }}
              >
                <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
              </div>
              <span className="font-medium tracking-tight">
                Build<span className="text-neon-cyan">It</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Built for creators who dare to be different</p>
            <span className="text-xs text-muted-foreground font-mono">v2.0.0</span>
          </div>
        </div>
      </footer>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}
