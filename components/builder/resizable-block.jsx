"use client"

import { useState, useRef, useEffect } from "react"
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
}

export function ResizableBlock({ component, isSelected, onSelect, onMove, onResize, onContentChange, zoom = 1 }) {
  const [isEditing, setIsEditing] = useState(false)
  const [localPosition, setLocalPosition] = useState(component.position)
  const [localSize, setLocalSize] = useState(component.size)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const blockRef = useRef(null)
  const startPosRef = useRef({ x: 0, y: 0 })
  const startSizeRef = useRef({ width: 0, height: 0 })
  const startMouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setLocalPosition(component.position)
    setLocalSize(component.size)
  }, [component.position, component.size])

  const handleMouseDown = (e) => {
    if (component.locked?.position || isEditing) return
    e.preventDefault()
    setIsDragging(true)
    startPosRef.current = { ...localPosition }
    startMouseRef.current = { x: e.clientX, y: e.clientY }
    onSelect(component.id)
  }

  const handleMouseMove = (e) => {
    if (isDragging && !component.locked?.position) {
      const dx = (e.clientX - startMouseRef.current.x) / zoom
      const dy = (e.clientY - startMouseRef.current.y) / zoom
      const newX = Math.max(0, startPosRef.current.x + dx)
      const newY = Math.max(0, startPosRef.current.y + dy)
      setLocalPosition({ x: newX, y: newY })
    }

    if (isResizing && resizeHandle && !component.locked?.size) {
      const dx = (e.clientX - startMouseRef.current.x) / zoom
      const dy = (e.clientY - startMouseRef.current.y) / zoom

      let newWidth = startSizeRef.current.width
      let newHeight = startSizeRef.current.height
      let newX = startPosRef.current.x
      let newY = startPosRef.current.y

      if (resizeHandle.includes("e")) newWidth = Math.max(50, startSizeRef.current.width + dx)
      if (resizeHandle.includes("w")) {
        newWidth = Math.max(50, startSizeRef.current.width - dx)
        newX = startPosRef.current.x + (startSizeRef.current.width - newWidth)
      }
      if (resizeHandle.includes("s")) newHeight = Math.max(50, startSizeRef.current.height + dy)
      if (resizeHandle.includes("n")) {
        newHeight = Math.max(50, startSizeRef.current.height - dy)
        newY = startPosRef.current.y + (startSizeRef.current.height - newHeight)
      }

      if (
        e.shiftKey &&
        (resizeHandle === "se" || resizeHandle === "nw" || resizeHandle === "ne" || resizeHandle === "sw")
      ) {
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
  }

  const handleMouseUp = () => {
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
  }

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isResizing, resizeHandle])

  const handleResizeStart = (e, handle) => {
    if (component.locked?.size) return
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeHandle(handle)
    startSizeRef.current = { ...localSize }
    startPosRef.current = { ...localPosition }
    startMouseRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleDoubleClick = (e) => {
    if (component.locked?.editing) return
    e.stopPropagation()
    const editableTypes = ["text", "button", "card", "heading", "paragraph", "quote", "imageCard", "pricing", "footer"]
    if (editableTypes.includes(component.type)) {
      setIsEditing(true)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
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
  }

  useEffect(() => {
    if (isSelected) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isSelected, localPosition, isEditing, component.locked])

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

  const freeformStyle = {
    position: "absolute",
    left: localPosition.x,
    top: localPosition.y,
    width: localSize.width,
    height: localSize.height,
    transform: getTransformStyle(),
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
            style={{
              fontSize: props.fontSize,
              fontWeight: props.fontWeight === "medium" ? 500 : props.fontWeight,
              color: props.color,
            }}
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
              style={{ aspectRatio: props.aspectRatio }}
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
              boxShadow: props.shadow ? "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)" : "none",
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
              boxShadow: props.shadow ? "0 4px 6px -1px rgb(0 0 0 / 0.3)" : "none",
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
              {isEditing ? (
                <>
                  <input
                    className="text-base font-semibold border-none outline-none bg-transparent mb-1 text-foreground w-full"
                    defaultValue={props.title}
                    onChange={(e) => onContentChange(component.id, { title: e.target.value })}
                    autoFocus
                  />
                  <textarea
                    className="text-sm resize-none border-none outline-none bg-transparent text-muted-foreground w-full"
                    defaultValue={props.description}
                    onChange={(e) => onContentChange(component.id, { description: e.target.value })}
                    onBlur={handleBlur}
                  />
                </>
              ) : (
                <>
                  <h4 className="text-base font-semibold mb-1 text-foreground">{props.title}</h4>
                  <p className="text-sm text-muted-foreground">{props.description}</p>
                </>
              )}
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
              minHeight: props.minHeight,
              border: `${props.borderWidth || 1}px solid ${props.borderColor || "transparent"}`,
              opacity: props.opacity,
              backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!props.backgroundImage && "Container"}
          </div>
        )

      case "divider":
        return (
          <div className="w-full h-full flex items-center justify-center" style={{ padding: `${props.margin}px 0` }}>
            <div
              style={{
                width: `${props.width}%`,
                height: props.thickness,
                backgroundColor: props.color,
                borderStyle: props.style,
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
            {isEditing ? (
              <>
                <textarea
                  className="w-full resize-none border-none outline-none bg-transparent italic mb-2"
                  style={{ fontSize: props.fontSize, color: props.color, lineHeight: 1.6 }}
                  defaultValue={props.content}
                  onChange={(e) => onContentChange(component.id, { content: e.target.value })}
                  autoFocus
                />
                <input
                  className="text-sm border-none outline-none bg-transparent"
                  style={{ color: props.accentColor }}
                  defaultValue={props.author}
                  onChange={(e) => onContentChange(component.id, { author: e.target.value })}
                  onBlur={handleBlur}
                />
              </>
            ) : (
              <>
                <p className="italic mb-2" style={{ fontSize: props.fontSize, color: props.color, lineHeight: 1.6 }}>
                  "{props.content}"
                </p>
                <p className="text-sm" style={{ color: props.accentColor }}>
                  — {props.author}
                </p>
              </>
            )}
          </div>
        )

      case "icon":
        const IconComponent = iconComponents[props.iconName] || Zap
        return (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              padding: props.padding,
              backgroundColor: props.backgroundColor,
            }}
          >
            <IconComponent
              style={{
                width: props.iconSize || props.size || 24,
                height: props.iconSize || props.size || 24,
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
              border: `${props.borderWidth || 1}px solid ${props.featured ? props.accentColor : props.borderColor || "transparent"}`,
              boxShadow: props.featured
                ? `0 0 20px ${props.accentColor}30`
                : props.shadow
                  ? "0 4px 6px -1px rgb(0 0 0 / 0.3)"
                  : "none",
              overflow: "hidden",
            }}
          >
            {props.featured && (
              <div
                className="text-center text-xs font-medium py-1"
                style={{ backgroundColor: props.accentColor, color: props.backgroundColor }}
              >
                RECOMMENDED
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold mb-2" style={{ color: props.color }}>
                {props.planName}
              </h3>
              <div className="mb-4">
                <span className="text-3xl font-bold" style={{ color: props.accentColor }}>
                  {props.price}
                </span>
                <span className="text-sm text-muted-foreground">/{props.period}</span>
              </div>
              <ul className="space-y-2 flex-1 text-sm text-muted-foreground">
                {(props.features || ["Feature 1", "Feature 2", "Feature 3"]).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: props.accentColor }} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 w-full py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: props.featured ? props.accentColor : "transparent",
                  color: props.featured ? props.backgroundColor : props.accentColor,
                  border: `1px solid ${props.accentColor}`,
                }}
              >
                Get Started
              </button>
            </div>
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
            <div className="flex items-center justify-between h-full">
              <div>
                <h4 className="font-semibold" style={{ color: props.color }}>
                  {props.companyName}
                </h4>
                <p className="text-sm text-muted-foreground">{props.tagline}</p>
              </div>
              <div className="flex gap-4">
                {(props.links || ["About", "Contact", "Privacy"]).map((link, i) => (
                  <a key={i} href="#" className="text-sm hover:underline" style={{ color: props.accentColor }}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return <div className="w-full h-full flex items-center justify-center text-muted-foreground">Unknown</div>
    }
  }

  const isLocked = component.locked?.position || component.locked?.size || component.locked?.editing

  return (
    <div
      ref={blockRef}
      style={freeformStyle}
      className={`
        group select-none
        ${isSelected ? "ring-2 ring-neon-cyan ring-offset-1 ring-offset-background" : ""}
        ${isDragging ? "opacity-80 cursor-grabbing" : "cursor-grab"}
        ${isLocked ? "cursor-not-allowed" : ""}
      `}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(component.id)
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Lock indicator */}
      {isLocked && isSelected && (
        <div className="absolute -top-6 left-0 flex items-center gap-1 text-xs text-neon-magenta bg-background/80 px-2 py-0.5 rounded">
          <Lock className="w-3 h-3" />
          Locked
        </div>
      )}

      {/* Position indicator when dragging */}
      {isDragging && (
        <div className="absolute -top-6 right-0 text-xs text-neon-cyan bg-background/80 px-2 py-0.5 rounded font-mono">
          {Math.round(localPosition.x)}, {Math.round(localPosition.y)}
        </div>
      )}

      {/* Size indicator when resizing */}
      {isResizing && (
        <div className="absolute -bottom-6 right-0 text-xs text-neon-cyan bg-background/80 px-2 py-0.5 rounded font-mono">
          {Math.round(localSize.width)} × {Math.round(localSize.height)}
        </div>
      )}

      {renderContent()}

      {/* Resize handles */}
      {isSelected && !component.locked?.size && (
        <>
          {resizeHandles.map((handle) => (
            <div
              key={handle}
              className={`
                absolute w-3 h-3 bg-neon-cyan border-2 border-background rounded-sm z-10
                ${handle === "n" ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-n-resize" : ""}
                ${handle === "s" ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-s-resize" : ""}
                ${handle === "e" ? "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-e-resize" : ""}
                ${handle === "w" ? "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-w-resize" : ""}
                ${handle === "ne" ? "top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize" : ""}
                ${handle === "nw" ? "top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize" : ""}
                ${handle === "se" ? "bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize" : ""}
                ${handle === "sw" ? "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize" : ""}
              `}
              onMouseDown={(e) => handleResizeStart(e, handle)}
            />
          ))}
        </>
      )}
    </div>
  )
}
