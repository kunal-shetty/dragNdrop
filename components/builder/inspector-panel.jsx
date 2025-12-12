"use client"
import { useState, useEffect } from "react"
import {
  Copy,
  Trash2,
  Settings2,
  Palette,
  Layout,
  Type,
  Sparkles,
  Lock,
  Unlock,
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
  Eye,
  Move,
  Maximize2,
  Edit3,
  Layers,
  ArrowUp,
  ArrowDown,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

function QuickActions({ component, onDuplicate, onDelete, onToggleLock, onBringForward, onSendBackward }) {
  const isLocked = component.locked?.position || component.locked?.size || component.locked?.editing

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 p-2 bg-secondary/30 rounded-lg border border-border mb-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDuplicate}>
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Duplicate (Ctrl+D)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onBringForward}>
              <ArrowUp className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Bring Forward</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onSendBackward}>
              <ArrowDown className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Send Backward</p>
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-5 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${isLocked ? "text-neon-magenta" : ""}`}
              onClick={() => onToggleLock("position")}
            >
              {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Toggle Lock</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/20"
              onClick={onDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Delete (Del)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

function LivePreview({ component }) {
  const previewStyle = {
    backgroundColor: component.props.backgroundColor || "transparent",
    color: component.props.color || "#fff",
    borderRadius: component.props.borderRadius || "0px",
    border: component.props.borderWidth
      ? `${component.props.borderWidth}px solid ${component.props.borderColor || "#333"}`
      : "1px solid #333",
    padding: "8px",
    fontSize: "10px",
    transform: component.transform?.rotate ? `rotate(${component.transform.rotate}deg)` : undefined,
    opacity: component.props.opacity || 1,
  }

  return (
    <div className="mb-4 p-3 bg-secondary/20 rounded-lg border border-border">
      <Label className="text-xs text-muted-foreground mb-2 block flex items-center gap-1">
        <Eye className="w-3 h-3" /> Live Preview
      </Label>
      <div className="flex items-center justify-center min-h-[60px] bg-background/50 rounded overflow-hidden">
        <div style={previewStyle} className="max-w-full truncate">
          {component.props.content || component.props.title || component.type}
        </div>
      </div>
    </div>
  )
}

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
  onDuplicate,
  onBringForward,
  onSendBackward,
}) {
  const [activeTab, setActiveTab] = useState("style")
  const [jsonValue, setJsonValue] = useState("")
  const [jsonError, setJsonError] = useState(null)
  const [customName, setCustomName] = useState("")
  const [showIconPicker, setShowIconPicker] = useState(false)

  useEffect(() => {
    if (component && activeTab === "json") {
      updateJSON()
    }
  }, [component, activeTab]) // Changed dependency array to include component itself

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
      <div className="w-80 h-full bg-sidebar border-l border-sidebar-border p-4 relative">
        <Button variant="ghost" size="icon" className="absolute top-2 left-2 w-6 h-6" onClick={onToggleCollapse}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2 text-muted-foreground mb-4 mt-6">
          <Settings2 className="w-4 h-4 text-neon-cyan" />
          <span className="text-sm font-medium">Inspector</span>
        </div>
        <p className="text-sm text-muted-foreground">Select a component to edit its properties.</p>

        <div className="mt-6 p-4 rounded-lg bg-secondary/30 border border-border">
          <h4 className="text-xs font-medium text-neon-cyan mb-3">Keyboard Shortcuts</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">Ctrl+C</kbd>
              </span>
              <span>Copy</span>
            </div>
            <div className="flex justify-between">
              <span>
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">Ctrl+V</kbd>
              </span>
              <span>Paste</span>
            </div>
            <div className="flex justify-between">
              <span>
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">Ctrl+D</kbd>
              </span>
              <span>Duplicate</span>
            </div>
            <div className="flex justify-between">
              <span>
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">Ctrl+Z</kbd>
              </span>
              <span>Undo</span>
            </div>
            <div className="flex justify-between">
              <span>
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">Del</kbd>
              </span>
              <span>Remove</span>
            </div>
            <div className="flex justify-between">
              <span>
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">Arrow</kbd>
              </span>
              <span>Move 1px</span>
            </div>
            <div className="flex justify-between">
              <span>
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">Shift+Arrow</kbd>
              </span>
              <span>Move 10px</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-secondary/30 border border-border">
          <h4 className="text-xs font-medium text-neon-magenta mb-3">Canvas Settings</h4>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Snap to Grid</Label>
            <Switch
              checked={snappingEnabled}
              onCheckedChange={onToggleSnapping}
              className="data-[state=checked]:bg-neon-cyan"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 h-full bg-sidebar border-l border-sidebar-border flex flex-col relative">
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
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            {component.layerName || component.type}
          </p>
          {/* Lock indicators */}
          <div className="flex gap-1">
            {component.locked?.position && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-magenta/20 text-neon-magenta flex items-center gap-1">
                <Move className="w-2.5 h-2.5" />
              </span>
            )}
            {component.locked?.size && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-magenta/20 text-neon-magenta flex items-center gap-1">
                <Maximize2 className="w-2.5 h-2.5" />
              </span>
            )}
            {component.locked?.editing && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-magenta/20 text-neon-magenta flex items-center gap-1">
                <Edit3 className="w-2.5 h-2.5" />
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-3 pt-3">
        <QuickActions
          component={component}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onToggleLock={onToggleLock}
          onBringForward={onBringForward}
          onSendBackward={onSendBackward}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-3 bg-secondary/50 h-8 grid grid-cols-4">
          <TabsTrigger
            value="style"
            className="text-xs data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
          >
            <Palette className="w-3 h-3 mr-1" />
            Style
          </TabsTrigger>
          <TabsTrigger
            value="layout"
            className="text-xs data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
          >
            <Layout className="w-3 h-3 mr-1" />
            Layout
          </TabsTrigger>
          <TabsTrigger
            value="transform"
            className="text-xs data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
          >
            <RotateCw className="w-3 h-3 mr-1" />
            Transform
          </TabsTrigger>
          <TabsTrigger
            value="json"
            className="text-xs data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
          >
            <Code className="w-3 h-3 mr-1" />
            JSON
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-3">
          {/* Style Tab */}
          <TabsContent value="style" className="mt-0 space-y-4">
            <LivePreview component={component} />

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

            {component.type === "navbar" && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Logo Text</Label>
                  <Input
                    value={component.props.logo}
                    onChange={(e) => onUpdateProps({ logo: e.target.value })}
                    className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                    disabled={component.locked?.editing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">CTA Button Text</Label>
                  <Input
                    value={component.props.ctaText}
                    onChange={(e) => onUpdateProps({ ctaText: e.target.value })}
                    className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                    disabled={component.locked?.editing}
                  />
                </div>
              </>
            )}

            {component.type === "hero" && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Headline</Label>
                  <Textarea
                    value={component.props.headline}
                    onChange={(e) => onUpdateProps({ headline: e.target.value })}
                    className="min-h-16 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                    disabled={component.locked?.editing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Subheadline</Label>
                  <Textarea
                    value={component.props.subheadline}
                    onChange={(e) => onUpdateProps({ subheadline: e.target.value })}
                    className="min-h-16 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                    disabled={component.locked?.editing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Primary CTA</Label>
                    <Input
                      value={component.props.primaryCta}
                      onChange={(e) => onUpdateProps({ primaryCta: e.target.value })}
                      className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                      disabled={component.locked?.editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Secondary CTA</Label>
                    <Input
                      value={component.props.secondaryCta}
                      onChange={(e) => onUpdateProps({ secondaryCta: e.target.value })}
                      className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                      disabled={component.locked?.editing}
                    />
                  </div>
                </div>
              </>
            )}

            {component.type === "testimonial" && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Quote</Label>
                  <Textarea
                    value={component.props.quote}
                    onChange={(e) => onUpdateProps({ quote: e.target.value })}
                    className="min-h-20 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                    disabled={component.locked?.editing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Author</Label>
                    <Input
                      value={component.props.author}
                      onChange={(e) => onUpdateProps({ author: e.target.value })}
                      className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                      disabled={component.locked?.editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Role</Label>
                    <Input
                      value={component.props.role}
                      onChange={(e) => onUpdateProps({ role: e.target.value })}
                      className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                      disabled={component.locked?.editing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Rating (1-5)</Label>
                  <Slider
                    value={[component.props.rating || 5]}
                    onValueChange={([value]) => onUpdateProps({ rating: value })}
                    min={1}
                    max={5}
                    step={1}
                    disabled={component.locked?.editing}
                  />
                </div>
              </>
            )}

            {component.type === "section" && (
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
                  <Label className="text-xs text-muted-foreground">Subtitle</Label>
                  <Textarea
                    value={component.props.subtitle}
                    onChange={(e) => onUpdateProps({ subtitle: e.target.value })}
                    className="min-h-16 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                    disabled={component.locked?.editing}
                  />
                </div>
              </>
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
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
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
                      value={component.props.backgroundColor}
                      onChange={(e) => onUpdateProps({ backgroundColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
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

              {component.props.accentColor !== undefined && (
                <div className="space-y-2 mb-3">
                  <Label className="text-xs text-muted-foreground">Accent Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={component.props.accentColor}
                      onChange={(e) => onUpdateProps({ accentColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
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

            {/* Typography for text-based components */}
            {(component.type === "text" ||
              component.type === "heading" ||
              component.type === "paragraph" ||
              component.type === "button") && (
              <div className="pt-3 border-t border-border">
                <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Type className="w-3 h-3" /> Typography
                </h4>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Font Size</Label>
                    <Input
                      type="number"
                      value={component.props.fontSize}
                      onChange={(e) => onUpdateProps({ fontSize: Number.parseInt(e.target.value) || 16 })}
                      className="h-8 text-sm bg-secondary/50 border-border"
                      disabled={component.locked?.editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Font Weight</Label>
                    <Select
                      value={String(component.props.fontWeight)}
                      onValueChange={(value) => onUpdateProps({ fontWeight: value })}
                      disabled={component.locked?.editing}
                    >
                      <SelectTrigger className="h-8 text-sm bg-secondary/50 border-border">
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
                </div>

                <div className="space-y-2 mb-3">
                  <Label className="text-xs text-muted-foreground">Text Align</Label>
                  <Select
                    value={component.props.textAlign || "left"}
                    onValueChange={(value) => onUpdateProps({ textAlign: value })}
                    disabled={component.locked?.editing}
                  >
                    <SelectTrigger className="h-8 text-sm bg-secondary/50 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Letter Spacing</Label>
                    <Input
                      type="number"
                      value={component.props.letterSpacing || 0}
                      onChange={(e) => onUpdateProps({ letterSpacing: Number.parseFloat(e.target.value) || 0 })}
                      className="h-8 text-sm bg-secondary/50 border-border"
                      step="0.5"
                      disabled={component.locked?.editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Line Height</Label>
                    <Input
                      type="number"
                      value={component.props.lineHeight || 1.5}
                      onChange={(e) => onUpdateProps({ lineHeight: Number.parseFloat(e.target.value) || 1.5 })}
                      className="h-8 text-sm bg-secondary/50 border-border"
                      step="0.1"
                      disabled={component.locked?.editing}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Border & Effects */}
            <div className="pt-3 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Effects
              </h4>

              {component.props.borderRadius !== undefined && (
                <div className="space-y-2 mb-3">
                  <Label className="text-xs text-muted-foreground">Border Radius</Label>
                  <Input
                    value={component.props.borderRadius}
                    onChange={(e) => onUpdateProps({ borderRadius: e.target.value })}
                    placeholder="8px or 50%"
                    className="h-8 text-sm bg-secondary/50 border-border"
                    disabled={component.locked?.editing}
                  />
                </div>
              )}

              {component.props.opacity !== undefined && (
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <Label className="text-xs text-muted-foreground">Opacity</Label>
                    <span className="text-xs text-neon-cyan">{Math.round((component.props.opacity || 1) * 100)}%</span>
                  </div>
                  <Slider
                    value={[component.props.opacity || 1]}
                    onValueChange={([value]) => onUpdateProps({ opacity: value })}
                    min={0}
                    max={1}
                    step={0.05}
                    disabled={component.locked?.editing}
                  />
                </div>
              )}

              {component.props.glowIntensity !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs text-muted-foreground">Glow Intensity</Label>
                    <span className="text-xs text-neon-magenta">
                      {Math.round((component.props.glowIntensity || 0) * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[component.props.glowIntensity || 0]}
                    onValueChange={([value]) => onUpdateProps({ glowIntensity: value })}
                    min={0}
                    max={1}
                    step={0.05}
                    disabled={component.locked?.editing}
                  />
                </div>
              )}
            </div>

            {/* Save as Custom Component */}
            <div className="pt-3 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Save className="w-3 h-3" /> Save as Template
              </h4>
              <div className="flex gap-2">
                <Input
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Template name..."
                  className="h-8 text-sm bg-secondary/50 border-border flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (customName.trim()) {
                      onSaveAsCustom(customName.trim())
                      setCustomName("")
                    }
                  }}
                  className="h-8 bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30"
                >
                  <Save className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="mt-0 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">X Position</Label>
                <Input
                  type="number"
                  value={Math.round(component.position.x)}
                  onChange={(e) =>
                    onUpdateComponent({ position: { ...component.position, x: Number.parseInt(e.target.value) || 0 } })
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
                    onUpdateComponent({ position: { ...component.position, y: Number.parseInt(e.target.value) || 0 } })
                  }
                  className="h-8 text-sm bg-secondary/50 border-border"
                  disabled={component.locked?.position}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Width</Label>
                <Input
                  type="number"
                  value={Math.round(component.size.width)}
                  onChange={(e) =>
                    onUpdateComponent({ size: { ...component.size, width: Number.parseInt(e.target.value) || 100 } })
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
                    onUpdateComponent({ size: { ...component.size, height: Number.parseInt(e.target.value) || 50 } })
                  }
                  className="h-8 text-sm bg-secondary/50 border-border"
                  disabled={component.locked?.size}
                />
              </div>
            </div>

            {component.props.padding !== undefined && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Padding</Label>
                <Slider
                  value={[component.props.padding]}
                  onValueChange={([value]) => onUpdateProps({ padding: value })}
                  min={0}
                  max={64}
                  step={4}
                  disabled={component.locked?.editing}
                />
                <div className="text-xs text-right text-muted-foreground">{component.props.padding}px</div>
              </div>
            )}

            {/* Z-Index controls */}
            <div className="pt-3 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Layers className="w-3 h-3" /> Layer Order
              </h4>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Z-Index</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={component.zIndex || 0}
                    onChange={(e) => onUpdateComponent({ zIndex: Number.parseInt(e.target.value) || 0 })}
                    className="h-8 text-sm bg-secondary/50 border-border flex-1"
                  />
                  <Button size="sm" variant="outline" className="h-8 bg-transparent" onClick={onBringForward}>
                    <ArrowUp className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 bg-transparent" onClick={onSendBackward}>
                    <ArrowDown className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Lock Controls */}
            <div className="pt-3 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Lock Controls
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground flex items-center gap-2">
                    <Move className="w-3 h-3" /> Position
                  </Label>
                  <Switch
                    checked={component.locked?.position || false}
                    onCheckedChange={() => onToggleLock("position")}
                    className="data-[state=checked]:bg-neon-magenta"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground flex items-center gap-2">
                    <Maximize2 className="w-3 h-3" /> Size
                  </Label>
                  <Switch
                    checked={component.locked?.size || false}
                    onCheckedChange={() => onToggleLock("size")}
                    className="data-[state=checked]:bg-neon-magenta"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground flex items-center gap-2">
                    <Edit3 className="w-3 h-3" /> Editing
                  </Label>
                  <Switch
                    checked={component.locked?.editing || false}
                    onCheckedChange={() => onToggleLock("editing")}
                    className="data-[state=checked]:bg-neon-magenta"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Transform Tab */}
          <TabsContent value="transform" className="mt-0 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-xs text-muted-foreground">Rotation</Label>
                <span className="text-xs text-neon-cyan">{component.transform?.rotate || 0}°</span>
              </div>
              <Slider
                value={[component.transform?.rotate || 0]}
                onValueChange={([value]) => onUpdateComponent({ transform: { ...component.transform, rotate: value } })}
                min={-180}
                max={180}
                step={1}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                  max={3}
                  step={0.1}
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
                  max={3}
                  step={0.1}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Skew X</Label>
                  <span className="text-xs text-neon-magenta">{component.transform?.skewX || 0}°</span>
                </div>
                <Slider
                  value={[component.transform?.skewX || 0]}
                  onValueChange={([value]) =>
                    onUpdateComponent({ transform: { ...component.transform, skewX: value } })
                  }
                  min={-45}
                  max={45}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Skew Y</Label>
                  <span className="text-xs text-neon-magenta">{component.transform?.skewY || 0}°</span>
                </div>
                <Slider
                  value={[component.transform?.skewY || 0]}
                  onValueChange={([value]) =>
                    onUpdateComponent({ transform: { ...component.transform, skewY: value } })
                  }
                  min={-45}
                  max={45}
                  step={1}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-3">Flip</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 bg-transparent"
                  onClick={() =>
                    onUpdateComponent({
                      transform: {
                        ...component.transform,
                        scaleX: (component.transform?.scaleX || 1) * -1,
                      },
                    })
                  }
                >
                  <FlipHorizontal className="w-4 h-4 mr-2" />
                  Horizontal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 bg-transparent"
                  onClick={() =>
                    onUpdateComponent({
                      transform: {
                        ...component.transform,
                        scaleY: (component.transform?.scaleY || 1) * -1,
                      },
                    })
                  }
                >
                  <FlipVertical className="w-4 h-4 mr-2" />
                  Vertical
                </Button>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 bg-transparent"
                onClick={() =>
                  onUpdateComponent({
                    transform: { rotate: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0 },
                  })
                }
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Reset Transform
              </Button>
            </div>
          </TabsContent>

          {/* JSON Tab */}
          <TabsContent value="json" className="mt-0 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Component JSON</Label>
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={updateJSON}>
                Refresh
              </Button>
            </div>
            <Textarea
              value={jsonValue}
              onChange={(e) => setJsonValue(e.target.value)}
              className="min-h-[300px] font-mono text-xs bg-secondary/50 border-border"
              placeholder="Click 'Refresh' to load component JSON..."
            />
            {jsonError && <p className="text-xs text-red-400">{jsonError}</p>}
            <Button
              size="sm"
              className="w-full h-8 bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30"
              onClick={applyJSON}
            >
              <Code className="w-3 h-3 mr-2" />
              Apply Changes
            </Button>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
