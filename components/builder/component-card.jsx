"use client"

import { useDraggable } from "@dnd-kit/core"
import {
  Type,
  Square,
  ImageIcon,
  CreditCard,
  Box,
  Heading,
  AlignLeft,
  Video,
  Minus,
  Quote,
  Star,
  DollarSign,
  PanelBottom,
  LayoutGrid,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const iconMap = {
  Type,
  Square,
  Image: ImageIcon,
  ImageIcon,
  CreditCard,
  Box,
  Heading,
  AlignLeft,
  Video,
  Minus,
  Quote,
  Star,
  DollarSign,
  PanelBottom,
  LayoutGrid,
  text: Type,
  heading: Heading,
  paragraph: AlignLeft,
  button: Square,
  image: ImageIcon,
  video: Video,
  card: CreditCard,
  imageCard: LayoutGrid,
  container: Box,
  divider: Minus,
  quote: Quote,
  icon: Star,
  pricing: DollarSign,
  footer: PanelBottom,
}

export function ComponentCard({ component, isCustom, customId, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: isCustom ? `custom-${customId}` : `sidebar-${component.type}`,
    data: {
      type: component.type,
      fromSidebar: true,
      isCustom: isCustom || false,
      customId: customId,
    },
  })

  const Icon = iconMap[component.icon] || iconMap[component.type] || Box

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`
        flex items-center gap-2 p-2 bg-card/50 border border-border rounded-lg cursor-grab active:cursor-grabbing 
        hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all select-none group
        ${isCustom ? "border-neon-magenta/30 hover:border-neon-magenta/50" : ""}
      `}
    >
      <div
        className={`p-1.5 rounded-md transition-colors ${isCustom ? "bg-neon-magenta/10 group-hover:bg-neon-magenta/20" : "bg-neon-cyan/10 group-hover:bg-neon-cyan/20"}`}
      >
        <Icon className={`w-3.5 h-3.5 ${isCustom ? "text-neon-magenta" : "text-neon-cyan"}`} />
      </div>
      <span className="text-xs font-medium text-foreground flex-1 truncate">{component.label}</span>
      {/* Delete button for custom components */}
      {isCustom && onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="w-5 h-5 opacity-0 group-hover:opacity-100 hover:bg-destructive/20"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onDelete()
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Trash2 className="w-3 h-3 text-destructive" />
        </Button>
      )}
    </div>
  )
}
