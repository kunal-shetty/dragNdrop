"use client"

import { useState } from "react"
import { defaultComponents, componentCategories } from "@/lib/default-components"
import { ComponentCard } from "./component-card"
import {
  Layers,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Sparkles,
  ChevronDown,
  Type,
  ImageIcon,
  LayoutGrid,
  Magnet,
  ImageOff as MagnetOff,
  PanelLeft,
  Star,
  Zap,
  History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"

const categoryIcons = {
  basic: Type,
  media: ImageIcon,
  layout: LayoutGrid,
  sections: Layers,
}

export function Sidebar({
  onUndo,
  onRedo,
  onClear,
  onExport,
  canUndo,
  canRedo,
  canExport = true,
  snappingEnabled,
  onToggleSnapping,
  physicsEnabled,
  onTogglePhysics,
  customComponents,
  onDeleteCustomComponent,
  showLayerPanel,
  onToggleLayerPanel,
  showHistoryPanel,
  onToggleHistoryPanel,
}) {
  const [openCategories, setOpenCategories] = useState(["basic", "sections", "custom"])

  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const componentsByCategory = componentCategories.map((category) => ({
    ...category,
    components: defaultComponents.filter((c) => c.category === category.id),
  }))

  return (
    <div className="w-56 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header with Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-neon-cyan/20 flex items-center justify-center neon-glow-cyan">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
          </div>
          <span className="text-base font-semibold tracking-wide text-sidebar-foreground">
            NEON<span className="text-neon-cyan">FORGE</span>
          </span>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex gap-1 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSnapping}
            className={`flex-1 h-8 ${snappingEnabled ? "text-neon-cyan bg-neon-cyan/10" : ""}`}
            title={snappingEnabled ? "Disable snapping" : "Enable snapping"}
          >
            {snappingEnabled ? <Magnet className="w-4 h-4" /> : <MagnetOff className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleLayerPanel}
            className={`flex-1 h-8 ${showLayerPanel ? "text-neon-cyan bg-neon-cyan/10" : ""}`}
            title="Toggle layer panel"
          >
            <PanelLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleHistoryPanel}
            className={`flex-1 h-8 ${showHistoryPanel ? "text-neon-cyan bg-neon-cyan/10" : ""}`}
            title="Toggle history panel"
          >
            <History className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePhysics}
            className={`flex-1 h-8 ${physicsEnabled ? "text-neon-magenta bg-neon-magenta/10" : ""}`}
            title={physicsEnabled ? "Disable physics" : "Enable physics (experimental)"}
          >
            <Zap className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Components by Category */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Custom Components Section */}
        {customComponents && customComponents.length > 0 && (
          <Collapsible
            open={openCategories.includes("custom")}
            onOpenChange={() => toggleCategory("custom")}
            className="mb-3"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-neon-magenta" />
                <span className="text-sm font-medium text-foreground">Custom</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${openCategories.includes("custom") ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-2">
              {customComponents.map((comp) => (
                <ComponentCard
                  key={comp.id}
                  component={{
                    type: comp.baseType,
                    label: comp.name,
                    icon: comp.baseType,
                  }}
                  isCustom
                  customId={comp.id}
                  onDelete={() => onDeleteCustomComponent(comp.id)}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {componentsByCategory.map((category) => {
          const CategoryIcon = categoryIcons[category.id] || Layers
          return (
            <Collapsible
              key={category.id}
              open={openCategories.includes(category.id)}
              onOpenChange={() => toggleCategory(category.id)}
              className="mb-3"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-2">
                  <CategoryIcon className="w-4 h-4 text-neon-cyan" />
                  <span className="text-sm font-medium text-foreground">{category.label}</span>
                  <span className="text-xs text-muted-foreground">({category.components.length})</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${openCategories.includes(category.id) ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-2">
                {category.components.map((component) => (
                  <ComponentCard key={component.type} component={component} />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1 h-8 border-border hover:border-neon-cyan/50 hover:text-neon-cyan disabled:opacity-30 bg-transparent"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1 h-8 border-border hover:border-neon-cyan/50 hover:text-neon-cyan disabled:opacity-30 bg-transparent"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="flex-1 h-8 border-border hover:border-destructive/50 hover:text-destructive bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <Button
          size="sm"
          onClick={onExport}
          className="w-full h-8 bg-neon-cyan text-background hover:bg-neon-cyan/90 disabled:opacity-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export HTML
        </Button>
      </div>
    </div>
  )
}
