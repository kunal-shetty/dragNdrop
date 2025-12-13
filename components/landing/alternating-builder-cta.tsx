"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Layers, Zap, Palette, Code2 } from "lucide-react"

export default function AlternatingBuilderCTA() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: Layers,
      title: "Drag & Drop",
      description: "Intuitive interface that makes building websites a breeze",
      color: "neon-cyan",
    },
    {
      icon: Palette,
      title: "Customize Everything",
      description: "Full control over colors, typography, spacing, and transforms",
      color: "neon-magenta",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time preview and smooth 60fps interactions",
      color: "neon-purple",
    },
    {
      icon: Code2,
      title: "Export Clean Code",
      description: "Generate production-ready HTML/CSS with one click",
      color: "neon-cyan",
    },
  ]

  return (
    <section className="relative py-24 px-8 overflow-hidden border-t border-border/30">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-neon-cyan/5 to-background" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-neon-magenta/10 rounded-full blur-[128px] translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 mb-6">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-neon-cyan">Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span
              className="text-neon-cyan"
              style={{
                textShadow: "0 0 30px #22d3ee50",
              }}
            >
              Build Better
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional-grade tools wrapped in a beautiful, intuitive interface that makes web design accessible to
            everyone.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-neon-cyan/50 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  transform: hoveredFeature === index ? "translateY(-4px)" : "translateY(0)",
                  boxShadow:
                    hoveredFeature === index
                      ? `0 20px 40px -12px ${feature.color === "neon-cyan" ? "#22d3ee" : feature.color === "neon-magenta" ? "#ff00d9" : "#9d00ff"}30`
                      : "none",
                }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-${feature.color}/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-6 h-6 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>

                {/* Hover effect line */}
                <div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-${feature.color} to-transparent transition-all duration-300`}
                  style={{
                    width: hoveredFeature === index ? "100%" : "0%",
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-neon-cyan/10 via-neon-magenta/10 to-neon-purple/10 border border-neon-cyan/30">
            <h3 className="text-2xl font-semibold">Ready to Start Building?</h3>
            <p className="text-muted-foreground max-w-md">
              Join thousands of creators who are already using BuildIT to bring their ideas to life.
            </p>
            <Link href="/editor">
              <Button
                size="lg"
                className="bg-neon-cyan text-background hover:bg-neon-cyan/90 px-8 h-12 text-base font-medium group"
                style={{ boxShadow: "0 0 30px #22d3ee40" }}
              >
                Launch BuildIT
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground">No credit card required • Free to start</p>
          </div>
        </div>
      </div>
    </section>
  )
}
