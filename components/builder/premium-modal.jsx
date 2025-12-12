"use client"

import { useState, useEffect } from "react"
import { X, Zap, Crown, Infinity, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const USAGE_KEY = "neonforge-usage"
const DAILY_LIMIT = 5

const pricingTiers = [
  {
    name: "Basic",
    price: "$9",
    period: "month",
    icon: Zap,
    color: "neon-cyan",
    features: ["20 exports per day", "Basic components", "Email support", "Community access"],
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "month",
    icon: Crown,
    color: "neon-magenta",
    features: ["Unlimited exports", "All components", "Priority support", "Custom branding", "Team collaboration"],
    popular: true,
  },
  {
    name: "Lifetime",
    price: "$199",
    period: "one-time",
    icon: Infinity,
    color: "neon-purple",
    features: [
      "Unlimited forever",
      "All future updates",
      "Premium support",
      "Source code access",
      "Commercial license",
    ],
    popular: false,
  },
]

export function usePremiumModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [usageCount, setUsageCount] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem(USAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        const today = new Date().toDateString()
        if (data.date === today) {
          setUsageCount(data.count)
        } else {
          // Reset for new day
          localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count: 0 }))
          setUsageCount(0)
        }
      } catch {
        setUsageCount(0)
      }
    }
  }, [])

  const trackUsage = () => {
    const today = new Date().toDateString()
    const newCount = usageCount + 1
    setUsageCount(newCount)
    localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count: newCount }))

    if (newCount >= DAILY_LIMIT) {
      setIsOpen(true)
      return false
    }
    return true
  }

  const canExport = usageCount < DAILY_LIMIT

  return { isOpen, setIsOpen, trackUsage, canExport, usageCount, limit: DAILY_LIMIT }
}

export function PremiumModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 text-center border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-b from-neon-magenta/10 to-transparent" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-magenta/20 border border-neon-magenta/40 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-neon-magenta" />
              <span className="text-xs font-medium text-neon-magenta">Daily Limit Reached</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              You've reached today's <span className="text-neon-cyan">download limit</span>
            </h2>
            <p className="text-muted-foreground">Upgrade to Premium for unlimited usage and exclusive features</p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => {
              const Icon = tier.icon
              return (
                <div
                  key={tier.name}
                  className={`relative rounded-xl border p-6 transition-all duration-300 hover:scale-105 ${
                    tier.popular ? `border-${tier.color}/60 bg-${tier.color}/5` : "border-border bg-card/50"
                  }`}
                  style={{
                    boxShadow: tier.popular
                      ? `0 0 30px oklch(0.75 0.2 ${tier.color === "neon-magenta" ? 330 : 195} / 0.2)`
                      : undefined,
                  }}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-neon-magenta text-background text-xs font-medium">
                      Most Popular
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-xl bg-${tier.color}/20 flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 text-${tier.color}`} />
                  </div>

                  <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className={`text-3xl font-bold text-${tier.color}`}>{tier.price}</span>
                    <span className="text-sm text-muted-foreground">/{tier.period}</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className={`w-4 h-4 text-${tier.color}`} />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      tier.popular
                        ? "bg-neon-magenta text-background hover:bg-neon-magenta/90"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    {tier.popular ? "Upgrade Now" : "Choose Plan"}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 text-center">
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Maybe later — continue with limited access
          </button>
        </div>
      </div>
    </div>
  )
}
