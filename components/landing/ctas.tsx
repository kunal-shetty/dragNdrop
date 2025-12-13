"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function AlternatingBuilderCTA() {
  const items = [
    { text: "Resume Builder", href: "/resume-builder" },
    { text: "Portfolio Builder", href: "/portfolio-builder" },
  ]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative z-20 px-8 py-16 border-t border-border/30">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <p className="uppercase tracking-wider text-xs text-muted-foreground mb-3">
          Also try
        </p>

        {/* Alternating Builder */}
        <Link
          href={items[index].href}
          className="inline-flex items-center gap-3 text-2xl md:text-3xl font-semibold
                     text-neon-magenta hover:text-neon-cyan transition-colors duration-500"
          style={{
            textShadow: "0 0 25px rgba(232,121,249,0.45)",
          }}
        >
          {items[index].text}
          <Sparkles className="w-6 h-6" />
        </Link>

        {/* Subtext */}
        <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
          Create professional resumes and stunning portfolios using the same powerful editor.
        </p>
      </div>
    </section>
  )
}
