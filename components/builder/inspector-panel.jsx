"use client"
import { useState } from "react"
import {
  Copy,
  Trash2,
  Settings2,
  Palette,
  Layout,
  Type,
  Sparkles,
  Lock,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Code,
  Save,
  ChevronLeft,
  ChevronRight,
  Zap,
  Heart,
  Star,
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
  Grid3X3,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const ICON_OPTIONS = [
  { name: "Zap", icon: Zap },
  { name: "Star", icon: Star },
  { name: "Heart", icon: Heart },
  { name: "Rocket", icon: Rocket },
  { name: "Globe", icon: Globe },
  { name: "Shield", icon: Shield },
  { name: "Award", icon: Award },
  { name: "Target", icon: Target },
  { name: "Briefcase", icon: Briefcase },
  { name: "Coffee", icon: Coffee },
  { name: "Camera", icon: Camera },
  { name: "Music", icon: Music },
  { name: "Mail", icon: Mail },
  { name: "Phone", icon: Phone },
  { name: "MapPin", icon: MapPin },
  { name: "Clock", icon: Clock },
  { name: "Calendar", icon: Calendar },
  { name: "Users", icon: Users },
  { name: "Settings", icon: Settings },
  { name: "Search", icon: Search },
  { name: "Home", icon: Home },
  { name: "Bell", icon: Bell },
]

export function InspectorPanel({
  component,
  editorMode,
  gridSettings,
  onUpdateProps,
  onUpdateComponent,
  onDelete,
  onGridSettingsChange,
  snappingEnabled,
  onToggleSnapping,
  collapsed,
  onToggleCollapse,
  onUpdateFromJSON,
  onToggleLock,
  onSaveAsCustom,
  onDuplicate, // Added onDuplicate prop
}) {
  const [activeTab, setActiveTab] = useState("style")
  const [jsonValue, setJsonValue] = useState("")
  const [jsonError, setJsonError] = useState(null)
  const [customName, setCustomName] = useState("")
  const [showIconPicker, setShowIconPicker] = useState(false)

  const updateJSON = () => {
    if (component) {
      const json = JSON.stringify(
        {
          position: component.position,
          size: component.size,
          props: component.props,
          transform: component.transform,
        },
        null,
        2,
      )
      setJsonValue(json)
      setJsonError(null)
    }
  }

  const applyJSON = () => {
    const result = onUpdateFromJSON(jsonValue)
    if (!result.success) {
      setJsonError(result.error)
    } else {
      setJsonError(null)
    }
  }

  if (collapsed) {
    return (
      <div
        className="w-10 h-full bg-sidebar border-l border-sidebar-border flex flex-col items-center py-4 cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={onToggleCollapse}
      >
        <ChevronLeft className="w-4 h-4 text-neon-cyan mb-2" />
        <div className="writing-mode-vertical text-xs text-muted-foreground font-medium tracking-wider">INSPECTOR</div>
      </div>
    )
  }

  if (!component) {
    return (
      <div className="w-100 h-full bg-sidebar border-l border-sidebar-border p-4 relative">
        <Button variant="ghost" size="icon" className="absolute top-2 left-2 w-6 h-6" onClick={onToggleCollapse}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2 text-muted-foreground mb-4 mt-6">
          <Settings2 className="w-4 h-4 text-neon-cyan" />
          <span className="text-sm font-medium">Inspector</span>
        </div>
        <p className="text-sm text-muted-foreground">Select a component to edit its properties.</p>

        <div className="mt-6 p-4 rounded-lg bg-secondary/30 border border-border">
          <h4 className="text-xs font-medium text-neon-cyan mb-2">Keyboard Shortcuts</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <kbd className="px-1 bg-secondary rounded">Ctrl+C</kbd> Copy
            </p>
            <p>
              <kbd className="px-1 bg-secondary rounded">Ctrl+V</kbd> Paste
            </p>
            <p>
              <kbd className="px-1 bg-secondary rounded">Ctrl+D</kbd> Duplicate
            </p>
            <p>
              <kbd className="px-1 bg-secondary rounded">Del</kbd> Remove
            </p>
            <p>
              <kbd className="px-1 bg-secondary rounded">Arrow</kbd> Move 1px
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-100 h-full bg-sidebar border-l border-sidebar-border flex flex-col relative">
      <Button variant="ghost" size="icon" className="absolute top-2 left-2 w-6 h-6 z-10" onClick={onToggleCollapse}>
        <ChevronRight className="w-4 h-4" />
      </Button>

      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-2 ml-6">
          <Settings2 className="w-4 h-4 text-neon-cyan" />
          <span className="text-sm font-medium text-foreground">Inspector</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground capitalize flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-cyan" />
            {component.layerName || component.type}
          </p>
          {/* Lock indicators */}
          <div className="flex gap-1">
            {component.locked?.position && <Lock className="w-3 h-3 text-neon-magenta" />}
            {component.locked?.size && <Lock className="w-3 h-3 text-neon-magenta" />}
            {component.locked?.editing && <Lock className="w-3 h-3 text-neon-magenta" />}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-3 mt-2 bg-secondary/50 h-8">
          <TabsTrigger
            value="style"
            className="flex-1 text-xs data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
          >
            <Palette className="w-3 h-3 mr-1" />
            Style
          </TabsTrigger>
          <TabsTrigger
            value="typography"
            className="flex-1 text-xs data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
          >
            <Type className="w-3 h-3 mr-1" />
            Text
          </TabsTrigger>
          <TabsTrigger
            value="layout"
            className="flex-1 text-xs data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
          >
            <Layout className="w-3 h-3 mr-1" />
            Layout
          </TabsTrigger>
          {editorMode === "grid" && (
            <TabsTrigger
              value="grid"
              className="flex-1 text-xs data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
            >
              <Grid3X3 className="w-3 h-3 mr-1" />
              Grid
            </TabsTrigger>
          )}
          {/* Added Transform and JSON tabs */}
          <TabsTrigger
            value="transform"
            className="flex-1 text-xs data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
          >
            <RotateCw className="w-3 h-3 mr-1" />
            Transform
          </TabsTrigger>
          <TabsTrigger
            value="json"
            className="flex-1 text-xs data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
          >
            <Code className="w-3 h-3 mr-1" />
            JSON
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-3">
          {/* Style Tab */}
          <TabsContent value="style" className="mt-0 space-y-4">
            {/* Content editing based on type */}
            {(component.type === "text" || component.type === "button" || component.type === "heading") && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Content</Label>
                <Input
                  value={component.props.content}
                  onChange={(e) => onUpdateProps({ content: e.target.value })}
                  className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                  disabled={component.locked?.editing}
                />
              </div>
            )}

            {component.type === "paragraph" && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Content</Label>
                <Textarea
                  value={component.props.content}
                  onChange={(e) => onUpdateProps({ content: e.target.value })}
                  className="min-h-24 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                  disabled={component.locked?.editing}
                />
              </div>
            )}

            {component.type === "quote" && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Quote</Label>
                  <Textarea
                    value={component.props.content}
                    onChange={(e) => onUpdateProps({ content: e.target.value })}
                    className="min-h-20 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                    disabled={component.locked?.editing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Author</Label>
                  <Input
                    value={component.props.author}
                    onChange={(e) => onUpdateProps({ author: e.target.value })}
                    className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                    disabled={component.locked?.editing}
                  />
                </div>
              </>
            )}

            {(component.type === "card" || component.type === "imageCard") && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Title</Label>
                  <Input
                    value={component.props.title}
                    onChange={(e) => onUpdateProps({ title: e.target.value })}
                    className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                    disabled={component.locked?.editing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Textarea
                    value={component.props.description}
                    onChange={(e) => onUpdateProps({ description: e.target.value })}
                    className="min-h-16 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                    disabled={component.locked?.editing}
                  />
                </div>
              </>
            )}

            {(component.type === "image" || component.type === "imageCard") && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Image URL</Label>
                  <Input
                    value={component.props.src || component.props.imageSrc}
                    onChange={(e) =>
                      onUpdateProps({
                        [component.type === "imageCard" ? "imageSrc" : "src"]: e.target.value,
                      })
                    }
                    className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                    disabled={component.locked?.editing}
                  />
                </div>
                {component.type === "image" && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Alt Text</Label>
                    <Input
                      value={component.props.alt}
                      onChange={(e) => onUpdateProps({ alt: e.target.value })}
                      className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                      disabled={component.locked?.editing}
                    />
                  </div>
                )}
              </>
            )}

            {component.type === "video" && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Video Embed URL</Label>
                <Input
                  value={component.props.videoUrl}
                  onChange={(e) => onUpdateProps({ videoUrl: e.target.value })}
                  placeholder="https://youtube.com/embed/..."
                  className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                  disabled={component.locked?.editing}
                />
              </div>
            )}

            {/* Icon picker for icon type */}
            {component.type === "icon" && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Icon</Label>
                <Dialog open={showIconPicker} onOpenChange={setShowIconPicker}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full h-8 justify-start bg-secondary/50">
                      {component.props.iconName || "Select icon"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Select Icon</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-6 gap-2 p-2">
                      {ICON_OPTIONS.map(({ name, icon: Icon }) => (
                        <Button
                          key={name}
                          variant={component.props.iconName === name ? "default" : "outline"}
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => {
                            onUpdateProps({ iconName: name })
                            setShowIconPicker(false)
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Size</Label>
                  <Slider
                    value={[component.props.iconSize || 24]}
                    onValueChange={([value]) => onUpdateProps({ iconSize: value })}
                    min={16}
                    max={64}
                    step={4}
                    disabled={component.locked?.editing}
                  />
                </div>
              </div>
            )}

            {component.type === "pricing" && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Plan Name</Label>
                  <Input
                    value={component.props.planName}
                    onChange={(e) => onUpdateProps({ planName: e.target.value })}
                    className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                    disabled={component.locked?.editing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Price</Label>
                    <Input
                      value={component.props.price}
                      onChange={(e) => onUpdateProps({ price: e.target.value })}
                      className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                      disabled={component.locked?.editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Period</Label>
                    <Input
                      value={component.props.period}
                      onChange={(e) => onUpdateProps({ period: e.target.value })}
                      className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                      disabled={component.locked?.editing}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Featured</Label>
                  <Switch
                    checked={component.props.featured}
                    onCheckedChange={(checked) => onUpdateProps({ featured: checked })}
                    disabled={component.locked?.editing}
                  />
                </div>
              </>
            )}

            {component.type === "footer" && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Company Name</Label>
                  <Input
                    value={component.props.companyName}
                    onChange={(e) => onUpdateProps({ companyName: e.target.value })}
                    className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                    disabled={component.locked?.editing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Tagline</Label>
                  <Input
                    value={component.props.tagline}
                    onChange={(e) => onUpdateProps({ tagline: e.target.value })}
                    className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                    disabled={component.locked?.editing}
                  />
                </div>
              </>
            )}

            {/* Colors Section */}
            <div className="pt-3 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Palette className="w-3 h-3" /> Colors
              </h4>

              {component.props.color !== undefined && (
                <div className="space-y-2 mb-3">
                  <Label className="text-xs text-muted-foreground">Text Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={component.props.color}
                      onChange={(e) => onUpdateProps({ color: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent"
                      disabled={component.locked?.editing}
                    />
                    <Input
                      value={component.props.color}
                      onChange={(e) => onUpdateProps({ color: e.target.value })}
                      className="h-8 text-xs flex-1 bg-secondary/50 border-border"
                      disabled={component.locked?.editing}
                    />
                  </div>
                </div>
              )}

              {component.props.backgroundColor !== undefined && (
                <div className="space-y-2 mb-3">
                  <Label className="text-xs text-muted-foreground">Background</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={
                        component.props.backgroundColor === "transparent" ? "#1a1a2e" : component.props.backgroundColor
                      }
                      onChange={(e) => onUpdateProps({ backgroundColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent"
                      disabled={component.locked?.editing}
                    />
                    <Input
                      value={component.props.backgroundColor}
                      onChange={(e) => onUpdateProps({ backgroundColor: e.target.value })}
                      className="h-8 text-xs flex-1 bg-secondary/50 border-border"
                      disabled={component.locked?.editing}
                    />
                  </div>
                </div>
              )}

              {component.props.borderColor !== undefined && (
                <div className="space-y-2 mb-3">
                  <Label className="text-xs text-muted-foreground">Border Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={component.props.borderColor}
                      onChange={(e) => onUpdateProps({ borderColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent"
                      disabled={component.locked?.editing}
                    />
                    <Input
                      value={component.props.borderColor}
                      onChange={(e) => onUpdateProps({ borderColor: e.target.value })}
                      className="h-8 text-xs flex-1 bg-secondary/50 border-border"
                      disabled={component.locked?.editing}
                    />
                  </div>
                </div>
              )}

              {component.props.accentColor !== undefined && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Accent Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={component.props.accentColor}
                      onChange={(e) => onUpdateProps({ accentColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent"
                      disabled={component.locked?.editing}
                    />
                    <Input
                      value={component.props.accentColor}
                      onChange={(e) => onUpdateProps({ accentColor: e.target.value })}
                      className="h-8 text-xs flex-1 bg-secondary/50 border-border"
                      disabled={component.locked?.editing}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Effects Section */}
            <div className="pt-3 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Effects
              </h4>

              {component.props.opacity !== undefined && (
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <Label className="text-xs text-muted-foreground">Opacity</Label>
                    <span className="text-xs text-neon-cyan">{Math.round(component.props.opacity * 100)}%</span>
                  </div>
                  <Slider
                    value={[component.props.opacity]}
                    onValueChange={([value]) => onUpdateProps({ opacity: value })}
                    min={0}
                    max={1}
                    step={0.05}
                    disabled={component.locked?.editing}
                    className="[&_[role=slider]]:bg-neon-cyan"
                  />
                </div>
              )}

              {component.props.glowIntensity !== undefined && (
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <Label className="text-xs text-muted-foreground">Glow Intensity</Label>
                    <span className="text-xs text-neon-cyan">{Math.round(component.props.glowIntensity * 100)}%</span>
                  </div>
                  <Slider
                    value={[component.props.glowIntensity]}
                    onValueChange={([value]) => onUpdateProps({ glowIntensity: value })}
                    min={0}
                    max={1}
                    step={0.1}
                    disabled={component.locked?.editing}
                    className="[&_[role=slider]]:bg-neon-cyan"
                  />
                </div>
              )}

              {component.props.shadow !== undefined && (
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Drop Shadow</Label>
                  <Switch
                    checked={component.props.shadow}
                    onCheckedChange={(checked) => onUpdateProps({ shadow: checked })}
                    disabled={component.locked?.editing}
                  />
                </div>
              )}

              {component.props.borderWidth !== undefined && (
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between">
                    <Label className="text-xs text-muted-foreground">Border Width</Label>
                    <span className="text-xs text-neon-cyan">{component.props.borderWidth}px</span>
                  </div>
                  <Slider
                    value={[component.props.borderWidth]}
                    onValueChange={([value]) => onUpdateProps({ borderWidth: value })}
                    min={0}
                    max={8}
                    step={1}
                    disabled={component.locked?.editing}
                    className="[&_[role=slider]]:bg-neon-cyan"
                  />
                </div>
              )}

              {component.props.borderRadius !== undefined && (
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between">
                    <Label className="text-xs text-muted-foreground">Border Radius</Label>
                    <span className="text-xs text-neon-cyan">{component.props.borderRadius}px</span>
                  </div>
                  <Slider
                    value={[Number.parseInt(component.props.borderRadius) || 0]}
                    onValueChange={([value]) => onUpdateProps({ borderRadius: `${value}px` })}
                    min={0}
                    max={32}
                    step={1}
                    disabled={component.locked?.editing}
                    className="[&_[role=slider]]:bg-neon-cyan"
                  />
                </div>
              )}
            </div>

            {/* Style Preview */}
            <div className="pt-3 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Eye className="w-3 h-3" /> Preview
              </h4>
              <div
                className="h-16 rounded-lg flex items-center justify-center text-sm"
                style={{
                  backgroundColor: component.props.backgroundColor || "#1a1a2e",
                  color: component.props.color || "#ffffff",
                  borderRadius: component.props.borderRadius || 8,
                  border: component.props.borderWidth
                    ? `${component.props.borderWidth}px solid ${component.props.borderColor || "#22d3ee"}`
                    : "1px solid var(--border)",
                  opacity: component.props.opacity || 1,
                  boxShadow: component.props.glowIntensity
                    ? `0 0 ${20 * component.props.glowIntensity}px ${component.props.borderColor || "#22d3ee"}40`
                    : "none",
                }}
              >
                Preview
              </div>
            </div>

            {/* Locking */}
            <div className="pt-3 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Locking
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Lock Position</Label>
                  <Switch checked={component.locked?.position} onCheckedChange={() => onToggleLock("position")} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Lock Size</Label>
                  <Switch checked={component.locked?.size} onCheckedChange={() => onToggleLock("size")} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Lock Editing</Label>
                  <Switch checked={component.locked?.editing} onCheckedChange={() => onToggleLock("editing")} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="mt-0 space-y-4">
            {component.props.fontSize !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Font Size</Label>
                  <span className="text-xs text-neon-cyan">{component.props.fontSize}px</span>
                </div>
                <Slider
                  value={[component.props.fontSize]}
                  onValueChange={([value]) => onUpdateProps({ fontSize: value })}
                  min={10}
                  max={96}
                  step={1}
                  disabled={component.locked?.editing}
                  className="[&_[role=slider]]:bg-neon-cyan"
                />
              </div>
            )}

            {component.props.fontWeight !== undefined && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Font Weight</Label>
                <Select
                  value={component.props.fontWeight}
                  onValueChange={(value) => onUpdateProps({ fontWeight: value })}
                  disabled={component.locked?.editing}
                >
                  <SelectTrigger className="h-8 bg-secondary/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="semibold">Semibold</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {component.props.letterSpacing !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Letter Spacing</Label>
                  <span className="text-xs text-neon-cyan">{component.props.letterSpacing}px</span>
                </div>
                <Slider
                  value={[component.props.letterSpacing]}
                  onValueChange={([value]) => onUpdateProps({ letterSpacing: value })}
                  min={-2}
                  max={10}
                  step={0.5}
                  disabled={component.locked?.editing}
                  className="[&_[role=slider]]:bg-neon-cyan"
                />
              </div>
            )}

            {component.props.lineHeight !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Line Height</Label>
                  <span className="text-xs text-neon-cyan">{component.props.lineHeight}</span>
                </div>
                <Slider
                  value={[component.props.lineHeight]}
                  onValueChange={([value]) => onUpdateProps({ lineHeight: value })}
                  min={1}
                  max={3}
                  step={0.1}
                  disabled={component.locked?.editing}
                  className="[&_[role=slider]]:bg-neon-cyan"
                />
              </div>
            )}

            {component.props.textAlign !== undefined && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Text Align</Label>
                <Select
                  value={component.props.textAlign}
                  onValueChange={(value) => onUpdateProps({ textAlign: value })}
                  disabled={component.locked?.editing}
                >
                  <SelectTrigger className="h-8 bg-secondary/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="justify">Justify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {component.type === "heading" && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Heading Level</Label>
                <Select
                  value={component.props.level}
                  onValueChange={(value) => onUpdateProps({ level: value })}
                  disabled={component.locked?.editing}
                >
                  <SelectTrigger className="h-8 bg-secondary/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h1">H1</SelectItem>
                    <SelectItem value="h2">H2</SelectItem>
                    <SelectItem value="h3">H3</SelectItem>
                    <SelectItem value="h4">H4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {component.props.padding !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Padding</Label>
                  <span className="text-xs text-neon-cyan">{component.props.padding}px</span>
                </div>
                <Slider
                  value={[component.props.padding]}
                  onValueChange={([value]) => onUpdateProps({ padding: value })}
                  min={0}
                  max={64}
                  step={4}
                  disabled={component.locked?.editing}
                  className="[&_[role=slider]]:bg-neon-cyan"
                />
              </div>
            )}
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="mt-0 space-y-4">
            {editorMode === "freeform" && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">X Position</Label>
                    <Input
                      type="number"
                      value={Math.round(component.position.x)}
                      onChange={(e) =>
                        onUpdateComponent({ position: { ...component.position, x: Number(e.target.value) } })
                      }
                      className="h-8 text-sm bg-secondary/50 border-border"
                      disabled={component.locked?.position}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Y Position</Label>
                    <Input
                      type="number"
                      value={Math.round(component.position.y)}
                      onChange={(e) =>
                        onUpdateComponent({ position: { ...component.position, y: Number(e.target.value) } })
                      }
                      className="h-8 text-sm bg-secondary/50 border-border"
                      disabled={component.locked?.position}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Width</Label>
                    <Input
                      type="number"
                      value={Math.round(component.size.width)}
                      onChange={(e) =>
                        onUpdateComponent({ size: { ...component.size, width: Number(e.target.value) } })
                      }
                      className="h-8 text-sm bg-secondary/50 border-border"
                      disabled={component.locked?.size}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Height</Label>
                    <Input
                      type="number"
                      value={Math.round(component.size.height)}
                      onChange={(e) =>
                        onUpdateComponent({ size: { ...component.size, height: Number(e.target.value) } })
                      }
                      className="h-8 text-sm bg-secondary/50 border-border"
                      disabled={component.locked?.size}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Enable Snapping</Label>
                    <Switch checked={snappingEnabled} onCheckedChange={onToggleSnapping} />
                  </div>
                </div>
              </>
            )}

            {editorMode === "grid" && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Column Span</Label>
                    <Input
                      type="number"
                      value={component.gridPosition?.colSpan || 4}
                      onChange={(e) =>
                        onUpdateComponent({
                          gridPosition: {
                            ...component.gridPosition,
                            colSpan: Math.max(1, Math.min(gridSettings.columns, Number(e.target.value))),
                          },
                        })
                      }
                      min={1}
                      max={gridSettings.columns}
                      className="h-8 text-sm bg-secondary/50 border-border"
                      disabled={component.locked?.grid}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Row Span</Label>
                    <Input
                      type="number"
                      value={component.gridPosition?.rowSpan || 2}
                      onChange={(e) =>
                        onUpdateComponent({
                          gridPosition: {
                            ...component.gridPosition,
                            rowSpan: Math.max(1, Number(e.target.value)),
                          },
                        })
                      }
                      min={1}
                      className="h-8 text-sm bg-secondary/50 border-border"
                      disabled={component.locked?.grid}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Background Image Upload for Container */}
            {component?.type === "container" && (
              <div className="pt-4 border-t border-border">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Background Image URL</Label>
                  <Input
                    value={component.props.backgroundImage || ""}
                    onChange={(e) => onUpdateProps({ backgroundImage: e.target.value })}
                    placeholder="https://..."
                    className="h-8 text-sm bg-secondary/50 border-border"
                    disabled={component.locked?.editing}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* Grid Settings Tab */}
          {editorMode === "grid" && (
            <TabsContent value="grid" className="mt-0 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Columns</Label>
                  <span className="text-xs text-neon-cyan">{gridSettings.columns}</span>
                </div>
                <Slider
                  value={[gridSettings.columns]}
                  onValueChange={([value]) => onGridSettingsChange({ ...gridSettings, columns: value })}
                  min={1}
                  max={24}
                  step={1}
                  className="[&_[role=slider]]:bg-neon-cyan"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Gap</Label>
                  <span className="text-xs text-neon-cyan">{gridSettings.gap}px</span>
                </div>
                <Slider
                  value={[gridSettings.gap]}
                  onValueChange={([value]) => onGridSettingsChange({ ...gridSettings, gap: value })}
                  min={0}
                  max={48}
                  step={4}
                  className="[&_[role=slider]]:bg-neon-cyan"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Row Height</Label>
                  <span className="text-xs text-neon-cyan">{gridSettings.rowHeight || 100}px</span>
                </div>
                <Slider
                  value={[gridSettings.rowHeight || 100]}
                  onValueChange={([value]) => onGridSettingsChange({ ...gridSettings, rowHeight: value })}
                  min={50}
                  max={200}
                  step={10}
                  className="[&_[role=slider]]:bg-neon-cyan"
                />
              </div>
            </TabsContent>
          )}

          {/* Transform Tab */}
          <TabsContent value="transform" className="mt-0 space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Rotate</Label>
                  <span className="text-xs text-neon-cyan">{component.transform?.rotate || 0}°</span>
                </div>
                <Slider
                  value={[component.transform?.rotate || 0]}
                  onValueChange={([value]) =>
                    onUpdateComponent({ transform: { ...component.transform, rotate: value } })
                  }
                  min={-180}
                  max={180}
                  step={1}
                  disabled={component.locked?.transform}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Scale X</Label>
                  <span className="text-xs text-neon-cyan">{(component.transform?.scaleX || 1).toFixed(2)}</span>
                </div>
                <Slider
                  value={[component.transform?.scaleX || 1]}
                  onValueChange={([value]) =>
                    onUpdateComponent({ transform: { ...component.transform, scaleX: value } })
                  }
                  min={0.1}
                  max={2}
                  step={0.05}
                  disabled={component.locked?.transform}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Scale Y</Label>
                  <span className="text-xs text-neon-cyan">{(component.transform?.scaleY || 1).toFixed(2)}</span>
                </div>
                <Slider
                  value={[component.transform?.scaleY || 1]}
                  onValueChange={([value]) =>
                    onUpdateComponent({ transform: { ...component.transform, scaleY: value } })
                  }
                  min={0.1}
                  max={2}
                  step={0.05}
                  disabled={component.locked?.transform}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Skew X</Label>
                  <span className="text-xs text-neon-cyan">{component.transform?.skewX || 0}°</span>
                </div>
                <Slider
                  value={[component.transform?.skewX || 0]}
                  onValueChange={([value]) =>
                    onUpdateComponent({ transform: { ...component.transform, skewX: value } })
                  }
                  min={-45}
                  max={45}
                  step={1}
                  disabled={component.locked?.transform}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Skew Y</Label>
                  <span className="text-xs text-neon-cyan">{component.transform?.skewY || 0}°</span>
                </div>
                <Slider
                  value={[component.transform?.skewY || 0]}
                  onValueChange={([value]) =>
                    onUpdateComponent({ transform: { ...component.transform, skewY: value } })
                  }
                  min={-45}
                  max={45}
                  step={1}
                  disabled={component.locked?.transform}
                />
              </div>

              {/* Flip buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 bg-transparent"
                  onClick={() =>
                    onUpdateComponent({
                      transform: { ...component.transform, scaleX: (component.transform?.scaleX || 1) * -1 },
                    })
                  }
                  disabled={component.locked?.transform}
                >
                  <FlipHorizontal className="w-4 h-4 mr-1" />
                  Flip H
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 bg-transparent"
                  onClick={() =>
                    onUpdateComponent({
                      transform: { ...component.transform, scaleY: (component.transform?.scaleY || 1) * -1 },
                    })
                  }
                  disabled={component.locked?.transform}
                >
                  <FlipVertical className="w-4 h-4 mr-1" />
                  Flip V
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 bg-transparent"
                onClick={() =>
                  onUpdateComponent({ transform: { rotate: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0 } })
                }
                disabled={component.locked?.transform}
              >
                Reset Transform
              </Button>
            </div>
          </TabsContent>

          {/* JSON Tab */}
          <TabsContent value="json" className="mt-0 space-y-3">
            <Button variant="outline" size="sm" className="w-full h-8 bg-transparent" onClick={updateJSON}>
              <Code className="w-4 h-4 mr-2" />
              Load Current JSON
            </Button>
            <Textarea
              value={jsonValue}
              onChange={(e) => {
                setJsonValue(e.target.value)
                setJsonError(null)
              }}
              className={`min-h-48 text-xs font-mono bg-secondary/50 ${jsonError ? "border-destructive" : "border-border"}`}
              placeholder="Component JSON..."
            />
            {jsonError && <p className="text-xs text-destructive">{jsonError}</p>}
            <Button
              variant="default"
              size="sm"
              className="w-full h-8 bg-neon-cyan text-background"
              onClick={applyJSON}
              disabled={!jsonValue}
            >
              Apply JSON
            </Button>
          </TabsContent>
        </div>
      </Tabs>

      {/* Actions */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {/* Save as custom */}
        <div className="flex gap-2">
          <Input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Custom name..."
            className="h-8 text-xs bg-secondary/50"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 bg-transparent"
            onClick={() => {
              if (customName.trim()) {
                onSaveAsCustom(customName.trim())
                setCustomName("")
              }
            }}
            disabled={!customName.trim()}
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDuplicate(component.id)}
            className="flex-1 h-8 border-border hover:border-neon-cyan/50 hover:text-neon-cyan"
          >
            <Copy className="w-4 h-4 mr-1" />
            Duplicate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(component.id)}
            className="flex-1 h-8 border-border hover:border-destructive/50 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
