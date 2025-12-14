import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Manrope, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "BuildIT - Modern Website Builder",
  description:
    "Build stunning websites with our modern drag-and-drop editor featuring cyberpunk aesthetics and powerful customization",
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  themeColor: "#0a0a14",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
                <script src="https://checkout.razorpay.com/v1/checkout.js" defer></script>
        <Toaster
  theme="dark"
  position="bottom-right"
  toastOptions={{
    className:
      "bg-[#0b0f1a] text-white border border-neon-purple/40 backdrop-blur-md rounded-xl shadow-[0_0_25px_#a855f740]",
    descriptionClassName: "text-white/70",
  }}
/>
        {children}
      </body>
    </html>
  )
}
