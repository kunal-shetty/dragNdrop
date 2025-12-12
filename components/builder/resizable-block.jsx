"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  Zap,
  Star,
  Heart,
  Code,
  Sparkles,
  Rocket,
  Globe,
  Shield,
  Award,
  Target,
  Check,
  Briefcase,
  Coffee,
  Camera,
  Music,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Users,
  Settings,
  Search,
  Home,
  Bell,
  Lock,
  Twitter,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react"

const resizeHandles = ["n", "s", "e", "w", "ne", "nw", "se", "sw"]

const iconComponents = {
  Zap,
  Star,
  Heart,
  Code,
  Sparkles,
  Rocket,
  Globe,
  Shield,
  Award,
  Target,
  Briefcase,
  Coffee,
  Camera,
  Music,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Users,
  Settings,
  Search,
  Home,
  Bell,
  Twitter,
  Github,
  Linkedin,
  Instagram,
}

export function ResizableBlock({
  component,
  isSelected,
  onSelect,
  onMove,
  onResize,
  onContentChange,
  zoom = 1,
  zIndex = 1,
  physicsEnabled = false,
  snappingEnabled = false,
  onSnapGuidesChange = () => {},
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [localPosition, setLocalPosition] = useState(component.position)
  const [localSize, setLocalSize] = useState(component.size)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const blockRef = useRef(null)
  const startPosRef = useRef({ x: 0, y: 0 })
  const startSizeRef = useRef({ width: 0, height: 0 })
  const startMouseRef = useRef({ x: 0, y: 0 })
  const lastMouseRef = useRef({ x: 0, y: 0, time: 0 })
  const animationRef = useRef(null)

  useEffect(() => {
    setLocalPosition(component.position)
    setLocalSize(component.size)
  }, [component.position, component.size])

  const applyInertia = useCallback(() => {
    if (!physicsEnabled || (Math.abs(velocity.x) < 0.5 && Math.abs(velocity.y) < 0.5)) {
      setVelocity({ x: 0, y: 0 })
      return
    }

    const friction = 0.92
    const newVelocity = {
      x: velocity.x * friction,
      y: velocity.y * friction,
    }

    setLocalPosition((prev) => ({
      x: Math.max(0, prev.x + newVelocity.x),
      y: Math.max(0, prev.y + newVelocity.y),
    }))
    setVelocity(newVelocity)

    animationRef.current = requestAnimationFrame(applyInertia)
  }, [velocity, physicsEnabled])

  useEffect(() => {
    if (!isDragging && (velocity.x !== 0 || velocity.y !== 0)) {
      animationRef.current = requestAnimationFrame(applyInertia)
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isDragging, velocity, applyInertia])

  const handleMouseDown = useCallback(
    (e) => {
      if (component.locked?.position || isEditing) return
      if (e.button !== 0) return // Only left click

      e.preventDefault()
      e.stopPropagation()

      setIsDragging(true)
      startPosRef.current = { x: component.position.x, y: component.position.y }
      startMouseRef.current = { x: e.clientX, y: e.clientY }
      lastMouseRef.current = { x: e.clientX, y: e.clientY, time: Date.now() }
      onSelect(component.id)
    },
    [component.id, component.locked?.position, component.position, isEditing, onSelect],
  )

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging && !component.locked?.position) {
        const dx = (e.clientX - startMouseRef.current.x) / zoom
        const dy = (e.clientY - startMouseRef.current.y) / zoom
        const newX = Math.max(0, startPosRef.current.x + dx)
        const newY = Math.max(0, startPosRef.current.y + dy)

        // Calculate velocity for physics
        if (physicsEnabled) {
          const now = Date.now()
          const dt = now - lastMouseRef.current.time
          if (dt > 0) {
            setVelocity({
              x: (e.clientX - lastMouseRef.current.x) / zoom,
              y: (e.clientY - lastMouseRef.current.y) / zoom,
            })
          }
          lastMouseRef.current = { x: e.clientX, y: e.clientY, time: now }
        }

        setLocalPosition({ x: newX, y: newY })

        if (snappingEnabled && onSnapGuidesChange) {
          onSnapGuidesChange([])
        }
      }

      if (isResizing && resizeHandle && !component.locked?.size) {
        const dx = (e.clientX - startMouseRef.current.x) / zoom
        const dy = (e.clientY - startMouseRef.current.y) / zoom

        let newWidth = startSizeRef.current.width
        let newHeight = startSizeRef.current.height
        let newX = startPosRef.current.x
        let newY = startPosRef.current.y

        const ease = (val) => val // Direct 1:1 for pixel-perfect

        if (resizeHandle.includes("e")) newWidth = Math.max(50, startSizeRef.current.width + ease(dx))
        if (resizeHandle.includes("w")) {
          newWidth = Math.max(50, startSizeRef.current.width - ease(dx))
          newX = startPosRef.current.x + (startSizeRef.current.width - newWidth)
        }
        if (resizeHandle.includes("s")) newHeight = Math.max(50, startSizeRef.current.height + ease(dy))
        if (resizeHandle.includes("n")) {
          newHeight = Math.max(50, startSizeRef.current.height - ease(dy))
          newY = startPosRef.current.y + (startSizeRef.current.height - newHeight)
        }

        // Proportional resize with Shift
        if (e.shiftKey && ["se", "nw", "ne", "sw"].includes(resizeHandle)) {
          const aspectRatio = startSizeRef.current.width / startSizeRef.current.height
          if (Math.abs(dx) > Math.abs(dy)) {
            newHeight = newWidth / aspectRatio
          } else {
            newWidth = newHeight * aspectRatio
          }
        }

        setLocalSize({ width: newWidth, height: newHeight })
        setLocalPosition({ x: newX, y: newY })
      }
    },
    [isDragging, isResizing, resizeHandle, component.locked, zoom, physicsEnabled, snappingEnabled, onSnapGuidesChange],
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      onMove(component.id, localPosition)
    }
    if (isResizing) {
      setIsResizing(false)
      setResizeHandle(null)
      onResize(component.id, localSize)
      onMove(component.id, localPosition)
    }
  }, [isDragging, isResizing, component.id, localPosition, localSize, onMove, onResize])

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  const handleResizeStart = useCallback(
    (e, handle) => {
      if (component.locked?.size) return
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(true)
      setResizeHandle(handle)
      startSizeRef.current = { ...localSize }
      startPosRef.current = { ...localPosition }
      startMouseRef.current = { x: e.clientX, y: e.clientY }
    },
    [component.locked?.size, localSize, localPosition],
  )

  const handleDoubleClick = useCallback(
    (e) => {
      if (component.locked?.editing) return
      e.stopPropagation()
      const editableTypes = [
        "text",
        "button",
        "card",
        "heading",
        "paragraph",
        "quote",
        "imageCard",
        "pricing",
        "footer",
        "navbar",
        "navbarItem",
        "section",
        "hero",
        "testimonial",
        "stats",
      ]
      if (editableTypes.includes(component.type)) {
        setIsEditing(true)
      }
    },
    [component.type, component.locked?.editing],
  )

  const handleBlur = useCallback(() => {
    setIsEditing(false)
  }, [])

  const handleKeyDown = useCallback(
    (e) => {
      if (!isSelected || isEditing || component.locked?.position) return

      const step = e.shiftKey ? 10 : 1
      const newPos = { ...localPosition }

      switch (e.key) {
        case "ArrowUp":
          newPos.y = Math.max(0, newPos.y - step)
          break
        case "ArrowDown":
          newPos.y = newPos.y + step
          break
        case "ArrowLeft":
          newPos.x = Math.max(0, newPos.x - step)
          break
        case "ArrowRight":
          newPos.x = newPos.x + step
          break
        default:
          return
      }

      e.preventDefault()
      setLocalPosition(newPos)
      onMove(component.id, newPos)
    },
    [isSelected, isEditing, component.locked?.position, component.id, localPosition, onMove],
  )

  useEffect(() => {
    if (isSelected) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isSelected, handleKeyDown])

  const getTransformStyle = () => {
    const t = component.transform || {}
    const transforms = []
    if (t.rotate) transforms.push(`rotate(${t.rotate}deg)`)
    if (t.scaleX !== undefined && t.scaleX !== 1) transforms.push(`scaleX(${t.scaleX})`)
    if (t.scaleY !== undefined && t.scaleY !== 1) transforms.push(`scaleY(${t.scaleY})`)
    if (t.skewX) transforms.push(`skewX(${t.skewX}deg)`)
    if (t.skewY) transforms.push(`skewY(${t.skewY}deg)`)
    return transforms.length > 0 ? transforms.join(" ") : undefined
  }

  const computedZIndex = isSelected ? 9999 : isDragging ? 9998 : zIndex

  const freeformStyle = {
    position: "absolute",
    left: localPosition.x,
    top: localPosition.y,
    width: localSize.width,
    height: localSize.height,
    transform: getTransformStyle(),
    zIndex: computedZIndex,
    transition: isDragging || isResizing ? "none" : "box-shadow 0.2s ease-out",
  }

  const renderContent = () => {
    const { props } = component
    const glowStyle = props.glowIntensity
      ? { boxShadow: `0 0 ${20 * props.glowIntensity}px ${props.borderColor || "#22d3ee"}40` }
      : {}

    switch (component.type) {
      case "text":
        return isEditing ? (
          <textarea
            className="w-full h-full resize-none border-none outline-none bg-transparent"
            style={{
              fontSize: props.fontSize,
              fontWeight: props.fontWeight,
              color: props.color,
              padding: props.padding,
              letterSpacing: props.letterSpacing,
              lineHeight: props.lineHeight,
              textAlign: props.textAlign,
            }}
            defaultValue={props.content}
            onChange={(e) => onContentChange(component.id, { content: e.target.value })}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <div
            style={{
              fontSize: props.fontSize,
              fontWeight: props.fontWeight,
              color: props.color,
              padding: props.padding,
              backgroundColor: props.backgroundColor,
              letterSpacing: props.letterSpacing,
              lineHeight: props.lineHeight,
              textAlign: props.textAlign,
              width: "100%",
              height: "100%",
            }}
          >
            {props.content}
          </div>
        )

      case "heading":
        return isEditing ? (
          <input
            className="w-full h-full border-none outline-none bg-transparent"
            style={{
              fontSize: props.fontSize,
              fontWeight: props.fontWeight,
              color: props.color,
              padding: props.padding,
            }}
            defaultValue={props.content}
            onChange={(e) => onContentChange(component.id, { content: e.target.value })}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <div
            style={{
              fontSize: props.fontSize,
              fontWeight: props.fontWeight,
              color: props.color,
              padding: props.padding,
              backgroundColor: props.backgroundColor,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            {props.content}
          </div>
        )

      case "paragraph":
        return isEditing ? (
          <textarea
            className="w-full h-full resize-none border-none outline-none bg-transparent"
            style={{
              fontSize: props.fontSize,
              color: props.color,
              padding: props.padding,
              lineHeight: props.lineHeight,
            }}
            defaultValue={props.content}
            onChange={(e) => onContentChange(component.id, { content: e.target.value })}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <div
            style={{
              fontSize: props.fontSize,
              color: props.color,
              padding: props.padding,
              backgroundColor: props.backgroundColor,
              lineHeight: props.lineHeight,
              width: "100%",
              height: "100%",
              overflow: "auto",
            }}
          >
            {props.content}
          </div>
        )

      case "button":
        return isEditing ? (
          <input
            className="border-none outline-none bg-transparent text-center w-full"
            style={{ fontSize: props.fontSize, color: props.color }}
            defaultValue={props.content}
            onChange={(e) => onContentChange(component.id, { content: e.target.value })}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <button
            className="w-full h-full flex items-center justify-center transition-all duration-300 hover:scale-105"
            style={{
              fontSize: props.fontSize,
              fontWeight: props.fontWeight === "medium" ? 500 : props.fontWeight,
              color: props.color,
              backgroundColor: props.backgroundColor,
              padding: props.padding,
              borderRadius: props.borderRadius,
              border: `${props.borderWidth || 1}px solid ${props.borderColor || props.backgroundColor}`,
              ...glowStyle,
            }}
          >
            {props.content}
          </button>
        )

      case "image":
        return (
          <img
            src={props.src || "/placeholder.svg?height=200&width=300"}
            alt={props.alt}
            className="w-full h-full"
            style={{
              objectFit: props.objectFit,
              borderRadius: props.borderRadius,
              opacity: props.opacity,
              border: props.borderWidth ? `${props.borderWidth}px solid ${props.borderColor}` : "none",
            }}
          />
        )

      case "video":
        return (
          <div className="w-full h-full" style={{ borderRadius: props.borderRadius, overflow: "hidden" }}>
            <iframe
              src={props.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )

      case "card":
        return (
          <div
            className="w-full h-full flex flex-col"
            style={{
              padding: props.padding,
              backgroundColor: props.backgroundColor,
              borderRadius: props.borderRadius,
              border: `${props.borderWidth || 1}px solid ${props.borderColor || "transparent"}`,
              boxShadow: props.shadow ? "0 4px 6px -1px rgb(0 0 0 / 0.3)" : "none",
              ...glowStyle,
            }}
          >
            {isEditing ? (
              <>
                <input
                  className="text-lg font-semibold border-none outline-none bg-transparent mb-2 text-foreground"
                  defaultValue={props.title}
                  onChange={(e) => onContentChange(component.id, { title: e.target.value })}
                  autoFocus
                />
                <textarea
                  className="text-sm flex-1 resize-none border-none outline-none bg-transparent text-muted-foreground"
                  defaultValue={props.description}
                  onChange={(e) => onContentChange(component.id, { description: e.target.value })}
                  onBlur={handleBlur}
                />
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{props.title}</h3>
                <p className="text-sm text-muted-foreground">{props.description}</p>
              </>
            )}
          </div>
        )

      case "imageCard":
        return (
          <div
            className="w-full h-full flex flex-col overflow-hidden"
            style={{
              backgroundColor: props.backgroundColor,
              borderRadius: props.borderRadius,
              border: `${props.borderWidth || 1}px solid ${props.borderColor || "transparent"}`,
            }}
          >
            <div className="h-32 overflow-hidden">
              <img
                src={props.imageSrc || "/placeholder.svg?height=150&width=300"}
                alt={props.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex-1">
              <h4 className="text-base font-semibold mb-1 text-foreground">{props.title}</h4>
              <p className="text-sm text-muted-foreground">{props.description}</p>
            </div>
          </div>
        )

      case "container":
        return (
          <div
            className="w-full h-full flex items-center justify-center text-muted-foreground text-sm"
            style={{
              padding: props.padding,
              backgroundColor: props.backgroundColor,
              borderRadius: props.borderRadius,
              border: `${props.borderWidth || 1}px solid ${props.borderColor || "transparent"}`,
              backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : "none",
              backgroundSize: "cover",
            }}
          >
            {!props.backgroundImage && "Container"}
          </div>
        )

      case "divider":
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div
              style={{
                width: `${props.width}%`,
                height: props.thickness,
                backgroundColor: props.color,
                boxShadow: props.glowIntensity ? `0 0 ${10 * props.glowIntensity}px ${props.color}` : "none",
              }}
            />
          </div>
        )

      case "quote":
        return (
          <div
            className="w-full h-full"
            style={{
              padding: props.padding,
              backgroundColor: props.backgroundColor,
              borderRadius: props.borderRadius,
              borderLeft: `4px solid ${props.accentColor}`,
            }}
          >
            <p className="italic mb-2" style={{ fontSize: props.fontSize, color: props.color }}>
              "{props.content}"
            </p>
            <p className="text-sm" style={{ color: props.accentColor }}>
              — {props.author}
            </p>
          </div>
        )

      case "icon":
        const IconComponent = iconComponents[props.iconName] || Zap
        return (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ padding: props.padding, backgroundColor: props.backgroundColor }}
          >
            <IconComponent
              style={{
                width: props.iconSize || 24,
                height: props.iconSize || 24,
                color: props.color,
                filter: props.glowIntensity ? `drop-shadow(0 0 ${10 * props.glowIntensity}px ${props.color})` : "none",
              }}
            />
          </div>
        )

      case "pricing":
        return (
          <div
            className="w-full h-full flex flex-col"
            style={{
              backgroundColor: props.backgroundColor,
              borderRadius: props.borderRadius,
              border: `1px solid ${props.borderColor}`,
              padding: 24,
            }}
          >
            {props.featured && (
              <div className="text-xs font-medium px-2 py-1 rounded-full bg-neon-cyan/20 text-neon-cyan self-start mb-3">
                Popular
              </div>
            )}
            <h3 className="text-xl font-semibold" style={{ color: props.color }}>
              {props.planName}
            </h3>
            <div className="flex items-baseline gap-1 my-3">
              <span className="text-3xl font-bold" style={{ color: props.accentColor }}>
                {props.price}
              </span>
              <span className="text-sm text-muted-foreground">/{props.period}</span>
            </div>
            <ul className="space-y-2 flex-1">
              {(props.features || []).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4" style={{ color: props.accentColor }} />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 w-full py-2 rounded-lg font-medium"
              style={{ backgroundColor: props.accentColor, color: props.backgroundColor }}
            >
              Get Started
            </button>
          </div>
        )

      case "footer":
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: props.backgroundColor,
              borderRadius: props.borderRadius,
              padding: props.padding,
              borderTop: `1px solid ${props.borderColor}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold" style={{ color: props.color }}>
                  {props.companyName}
                </h4>
                <p className="text-sm text-muted-foreground">{props.tagline}</p>
              </div>
              <div className="flex gap-4">
                {(props.links || []).map((link, i) => (
                  <a key={i} href="#" className="text-sm hover:underline" style={{ color: props.accentColor }}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )

      case "navbar":
        return (
          <nav
            className="w-full h-full flex items-center justify-between"
            style={{
              backgroundColor: props.backgroundColor,
              padding: props.padding,
              borderBottom: `1px solid ${props.borderColor}`,
              borderRadius: props.borderRadius,
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: props.accentColor }} />
              <span className="font-semibold" style={{ color: props.color }}>
                {props.logoText}
              </span>
            </div>
            <div className="flex items-center gap-6">
              {(props.menuItems || []).map((item, i) => (
                <a key={i} href="#" className="text-sm hover:opacity-80" style={{ color: props.color }}>
                  {item}
                </a>
              ))}
            </div>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: props.accentColor, color: props.backgroundColor }}
            >
              {props.ctaText}
            </button>
          </nav>
        )

      case "section":
        return (
          <section
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundColor: props.backgroundColor,
              padding: props.padding,
              minHeight: props.minHeight,
              backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <span className="text-muted-foreground text-sm">Section - Drop components here</span>
          </section>
        )

      case "hero":
        return (
          <div
            className="w-full h-full flex flex-col items-center justify-center text-center"
            style={{
              backgroundColor: props.backgroundColor,
              padding: props.padding,
              backgroundImage: props.backgroundImage
                ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${props.backgroundImage})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: props.borderRadius,
            }}
          >
            <h1 className="text-4xl font-bold mb-4" style={{ color: props.headingColor }}>
              {props.heading}
            </h1>
            <p className="text-lg mb-6 max-w-lg" style={{ color: props.subheadingColor }}>
              {props.subheading}
            </p>
            <button
              className="px-6 py-3 rounded-lg font-medium"
              style={{ backgroundColor: props.ctaColor, color: props.ctaTextColor }}
            >
              {props.ctaText}
            </button>
          </div>
        )

      case "testimonial":
        return (
          <div
            className="w-full h-full flex flex-col"
            style={{
              backgroundColor: props.backgroundColor,
              padding: props.padding,
              borderRadius: props.borderRadius,
              border: `1px solid ${props.borderColor}`,
            }}
          >
            <p className="italic flex-1" style={{ fontSize: props.fontSize, color: props.quoteColor }}>
              "{props.quote}"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary">
                {props.avatarSrc && (
                  <img
                    src={props.avatarSrc || "/placeholder.svg"}
                    alt={props.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-medium" style={{ color: props.nameColor }}>
                  {props.name}
                </p>
                <p className="text-sm text-muted-foreground">{props.role}</p>
              </div>
            </div>
          </div>
        )

      case "stats":
        return (
          <div
            className="w-full h-full grid gap-4"
            style={{
              backgroundColor: props.backgroundColor,
              padding: props.padding,
              borderRadius: props.borderRadius,
              gridTemplateColumns: `repeat(${props.columns || 3}, 1fr)`,
            }}
          >
            {(props.stats || []).map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold" style={{ color: props.numberColor }}>
                  {stat.value}
                </p>
                <p className="text-sm" style={{ color: props.labelColor }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )

      case "group":
        return (
          <div className="w-full h-full relative border border-dashed border-neon-purple/50 rounded-lg">
            {(component.children || []).map((child) => (
              <div
                key={child.id}
                className="absolute"
                style={{
                  left: child.position.x,
                  top: child.position.y,
                  width: child.size.width,
                  height: child.size.height,
                }}
              >
                <ResizableBlock
                  component={child}
                  isSelected={false}
                  onSelect={() => {}}
                  onMove={() => {}}
                  onResize={() => {}}
                  onContentChange={() => {}}
                  zoom={zoom}
                />
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="w-full h-full bg-secondary rounded flex items-center justify-center text-xs text-muted-foreground">
            {component.type}
          </div>
        )
    }
  }

  const cursorStyle = () => {
    if (component.locked?.position) return "not-allowed"
    if (isDragging) return "grabbing"
    return "grab"
  }

  return (
    <div
      ref={blockRef}
      style={freeformStyle}
      className={`group ${isDragging ? "cursor-grabbing" : ""}`}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(component.id)
      }}
    >
      {/* Selection outline */}
      {isSelected && (
        <div
          className="absolute -inset-px border-2 border-neon-cyan rounded pointer-events-none"
          style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.3)" }}
        />
      )}

      {/* Lock indicator */}
      {(component.locked?.position || component.locked?.size || component.locked?.editing) && (
        <div className="absolute -top-6 left-0 flex items-center gap-1 px-2 py-0.5 rounded bg-card/90 text-xs text-neon-magenta border border-neon-magenta/30">
          <Lock className="w-3 h-3" />
          Locked
        </div>
      )}

      {/* Coordinates display while dragging */}
      {isDragging && (
        <div className="absolute -top-8 left-0 px-2 py-1 rounded bg-neon-cyan/90 text-background text-xs font-mono">
          {Math.round(localPosition.x)}, {Math.round(localPosition.y)}
        </div>
      )}

      {/* Size display while resizing */}
      {isResizing && (
        <div className="absolute -bottom-8 right-0 px-2 py-1 rounded bg-neon-magenta/90 text-background text-xs font-mono">
          {Math.round(localSize.width)} × {Math.round(localSize.height)}
        </div>
      )}

      {/* Resize handles */}
      {isSelected && !component.locked?.size && (
        <>
          {resizeHandles.map((handle) => (
            <div
              key={handle}
              className={`absolute w-3 h-3 bg-neon-cyan border-2 border-background rounded-sm cursor-${getResizeCursor(handle)} hover:bg-neon-magenta transition-colors z-10`}
              style={getHandlePosition(handle)}
              onMouseDown={(e) => handleResizeStart(e, handle)}
            />
          ))}
        </>
      )}

      {/* Content */}
      <div className="w-full h-full overflow-hidden" style={{ cursor: cursorStyle() }}>
        {renderContent()}
      </div>
    </div>
  )
}

function getHandlePosition(handle) {
  const positions = {
    n: { top: -5, left: "50%", transform: "translateX(-50%)" },
    s: { bottom: -5, left: "50%", transform: "translateX(-50%)" },
    e: { right: -5, top: "50%", transform: "translateY(-50%)" },
    w: { left: -5, top: "50%", transform: "translateY(-50%)" },
    ne: { top: -5, right: -5 },
    nw: { top: -5, left: -5 },
    se: { bottom: -5, right: -5 },
    sw: { bottom: -5, left: -5 },
  }
  return positions[handle]
}

function getResizeCursor(handle) {
  const cursors = {
    n: "ns-resize",
    s: "ns-resize",
    e: "ew-resize",
    w: "ew-resize",
    ne: "nesw-resize",
    sw: "nesw-resize",
    nw: "nwse-resize",
    se: "nwse-resize",
  }
  return cursors[handle]
}
