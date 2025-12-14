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
  ImageIcon,
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
  }, [component, activeTab])

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
        className="w-12 h-full bg-sidebar border-l border-sidebar-border flex flex-col items-center py-4 cursor-pointer hover:bg-secondary/30 transition-colors flex-shrink-0"
        onClick={onToggleCollapse}
      >
        <ChevronLeft className="w-4 h-4 text-neon-cyan mb-4" />
        <div className="flex-1 flex items-center">
          <span
            className="text-xs text-muted-foreground font-medium tracking-wider"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            INSPECTOR
          </span>
        </div>
        <Settings2 className="w-4 h-4 text-muted-foreground mt-4" />
      </div>
    )
  }

  if (!component) {
    return (
      <div className="w-96 h-full bg-sidebar border-l border-sidebar-border flex flex-col relative flex-shrink-0">
        <Button variant="ghost" size="icon" className="absolute top-2 left-2 w-6 h-6 z-10" onClick={onToggleCollapse}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <div className="flex-1 overflow-y-auto p-4">
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
      </div>
    )
  }

  return (
    <div className="w-96 h-full bg-sidebar border-l border-sidebar-border flex flex-col relative flex-shrink-0">
      <Button variant="ghost" size="icon" className="absolute top-2 left-2 w-6 h-6 z-10" onClick={onToggleCollapse}>
        <ChevronRight className="w-4 h-4" />
      </Button>

      <div className="p-4 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-2 mb-2 ml-6">
          <Settings2 className="w-4 h-4 text-neon-cyan" />
          <span className="text-sm font-medium text-foreground">Inspector</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground capitalize flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            {component.layerName || component.type}
          </p>
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

      <div className="px-3 pt-3 flex-shrink-0">
        <QuickActions
          component={component}
          onDuplicate={() => onDuplicate(component.id)}
          onDelete={() => onDelete(component.id)}
          onToggleLock={onToggleLock}
          onBringForward={() => onBringForward(component.id)}
          onSendBackward={() => onSendBackward(component.id)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-3 bg-secondary/50 h-8 grid grid-cols-4 flex-shrink-0">
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

        <div className="flex-1 overflow-y-auto p-3 min-h-0">
          {/* Style Tab */}
          <TabsContent value="style" className="mt-0 space-y-4 m-0">
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
              <div className="space-y-3 p-3 bg-secondary/20 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ImageIcon className="w-3 h-3" />
                  Image Settings
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Image URL</Label>
                  <Input
                    value={component.props.src || component.props.imageSrc || ""}
                    onChange={(e) =>
                      onUpdateProps({
                        [component.type === "imageCard" ? "imageSrc" : "src"]: e.target.value,
                      })
                    }
                    placeholder="https://example.com/image.jpg"
                    className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                    disabled={component.locked?.editing}
                  />
                </div>
                {component.type === "image" && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Alt Text</Label>
                    <Input
                      value={component.props.alt || ""}
                      onChange={(e) => onUpdateProps({ alt: e.target.value })}
                      placeholder="Describe the image"
                      className="h-8 text-sm bg-secondary/50 border-border focus:border-neon-cyan"
                      disabled={component.locked?.editing}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Object Fit</Label>
                  <Select
                    value={component.props.objectFit || "cover"}
                    onValueChange={(value) => onUpdateProps({ objectFit: value })}
                  >
                    <SelectTrigger className="h-8 bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cover">Cover</SelectItem>
                      <SelectItem value="contain">Contain</SelectItem>
                      <SelectItem value="fill">Fill</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
                    <div className="grid grid-cols-6 gap-2 p-4">
                      {ICON_OPTIONS.map(({ name, icon: Icon }) => (
                        <Button
                          key={name}
                          variant={component.props.iconName === name ? "default" : "ghost"}
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
              </div>
            )}

            {/* Colors Section */}
            <div className="space-y-3 p-3 bg-secondary/20 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Palette className="w-3 h-3" />
                Colors
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Background</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={component.props.backgroundColor || "#1a1a2e"}
                      onChange={(e) => onUpdateProps({ backgroundColor: e.target.value })}
                      className="w-10 h-8 p-1 bg-secondary/50 border-border cursor-pointer"
                    />
                    <Input
                      value={component.props.backgroundColor || "#1a1a2e"}
                      onChange={(e) => onUpdateProps({ backgroundColor: e.target.value })}
                      className="flex-1 h-8 text-xs bg-secondary/50 border-border font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={component.props.color || "#ffffff"}
                      onChange={(e) => onUpdateProps({ color: e.target.value })}
                      className="w-10 h-8 p-1 bg-secondary/50 border-border cursor-pointer"
                    />
                    <Input
                      value={component.props.color || "#ffffff"}
                      onChange={(e) => onUpdateProps({ color: e.target.value })}
                      className="flex-1 h-8 text-xs bg-secondary/50 border-border font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Border Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={component.props.borderColor || "#333333"}
                      onChange={(e) => onUpdateProps({ borderColor: e.target.value })}
                      className="w-10 h-8 p-1 bg-secondary/50 border-border cursor-pointer"
                    />
                    <Input
                      value={component.props.borderColor || "#333333"}
                      onChange={(e) => onUpdateProps({ borderColor: e.target.value })}
                      className="flex-1 h-8 text-xs bg-secondary/50 border-border font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Border Width</Label>
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    value={component.props.borderWidth || 0}
                    onChange={(e) => onUpdateProps({ borderWidth: Number.parseInt(e.target.value) || 0 })}
                    className="h-8 text-sm bg-secondary/50 border-border"
                  />
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-3 p-3 bg-secondary/20 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Type className="w-3 h-3" />
                Typography
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Font Size (px)</Label>
                  <Input
                    type="number"
                    min={8}
                    max={200}
                    value={Number.parseInt(component.props.fontSize) || 16}
                    onChange={(e) => onUpdateProps({ fontSize: Number.parseInt(e.target.value) || 16 })}
                    className="h-8 text-sm bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Font Weight</Label>
                  <Select
                    value={component.props.fontWeight || "400"}
                    onValueChange={(value) => onUpdateProps({ fontWeight: value })}
                  >
                    <SelectTrigger className="h-8 bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">Light</SelectItem>
                      <SelectItem value="400">Regular</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semibold</SelectItem>
                      <SelectItem value="700">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Text Align</Label>
                <Select
                  value={component.props.textAlign || "left"}
                  onValueChange={(value) => onUpdateProps({ textAlign: value })}
                >
                  <SelectTrigger className="h-8 bg-secondary/50">
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Letter Spacing (px)</Label>
                  <Input
                    type="number"
                    min={-5}
                    max={20}
                    step={0.5}
                    value={Number.parseFloat(component.props.letterSpacing) || 0}
                    onChange={(e) => onUpdateProps({ letterSpacing: Number.parseFloat(e.target.value) || 0 })}
                    className="h-8 text-sm bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Line Height</Label>
                  <Input
                    type="number"
                    min={0.5}
                    max={3}
                    step={0.1}
                    value={Number.parseFloat(component.props.lineHeight) || 1.5}
                    onChange={(e) => onUpdateProps({ lineHeight: Number.parseFloat(e.target.value) || 1.5 })}
                    className="h-8 text-sm bg-secondary/50 border-border"
                  />
                </div>
              </div>
            </div>

            {/* Effects */}
            <div className="space-y-3 p-3 bg-secondary/20 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3" />
                Effects
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-muted-foreground">Opacity</Label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round((component.props.opacity || 1) * 100)}%
                  </span>
                </div>
                <Slider
                  value={[(component.props.opacity || 1) * 100]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([value]) => onUpdateProps({ opacity: value / 100 })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-muted-foreground">Border Radius</Label>
                  <span className="text-xs text-muted-foreground">
                    {Number.parseInt(component.props.borderRadius || "0")}px
                  </span>
                </div>

                <Slider
                  value={[Number.parseInt(component.props.borderRadius || "0")]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([value]) => onUpdateProps({ borderRadius: `${value}px` })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-muted-foreground">Shadow Intensity</Label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round((component.props.shadowIntensity || 0) * 100)}%
                  </span>
                </div>
                <Slider
                  value={[(component.props.shadowIntensity || 0) * 100]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([value]) => {
                    const intensity = value / 100
                    const shadow =
                      intensity > 0 ? `0 ${4 * intensity}px ${16 * intensity}px rgba(0,0,0,${0.5 * intensity})` : "none"
                    onUpdateProps({ shadowIntensity: intensity, boxShadow: shadow })
                  }}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-muted-foreground">Backdrop Blur</Label>
                  <span className="text-xs text-muted-foreground">{component.props.backdropBlur || 0}px</span>
                </div>
                <Slider
                  value={[component.props.backdropBlur || 0]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={([value]) => onUpdateProps({ backdropBlur: value })}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="mt-0 space-y-4 m-0">
            <div className="space-y-3 p-3 bg-secondary/20 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Move className="w-3 h-3" />
                Position
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">X</Label>
                  <Input
                    type="number"
                    value={Math.round(component.position?.x || 0)}
                    onChange={(e) =>
                      onUpdateComponent({
                        position: { ...component.position, x: Number.parseInt(e.target.value) || 0 },
                      })
                    }
                    className="h-8 text-sm bg-secondary/50 border-border"
                    disabled={component.locked?.position}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Y</Label>
                  <Input
                    type="number"
                    value={Math.round(component.position?.y || 0)}
                    onChange={(e) =>
                      onUpdateComponent({
                        position: { ...component.position, y: Number.parseInt(e.target.value) || 0 },
                      })
                    }
                    className="h-8 text-sm bg-secondary/50 border-border"
                    disabled={component.locked?.position}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 p-3 bg-secondary/20 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Maximize2 className="w-3 h-3" />
                Size
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Width</Label>
                  <Input
                    type="number"
                    value={Math.round(component.size?.width || 100)}
                    onChange={(e) =>
                      onUpdateComponent({ size: { ...component.size, width: Number.parseInt(e.target.value) || 100 } })
                    }
                    className="h-8 text-sm bg-secondary/50 border-border"
                    disabled={component.locked?.size}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Height</Label>
                  <Input
                    type="number"
                    value={Math.round(component.size?.height || 40)}
                    onChange={(e) =>
                      onUpdateComponent({ size: { ...component.size, height: Number.parseInt(e.target.value) || 40 } })
                    }
                    className="h-8 text-sm bg-secondary/50 border-border"
                    disabled={component.locked?.size}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 p-3 bg-secondary/20 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Layout className="w-3 h-3" />
                Padding & Margin
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Top</Label>
                  <Input
                    type="number"
                    min={0}
                    max={200}
                    value={Number.parseInt(component.props.paddingTop) || Number.parseInt(component.props.padding) || 0}
                    onChange={(e) => onUpdateProps({ paddingTop: Number.parseInt(e.target.value) || 0 })}
                    className="h-7 text-xs bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Right</Label>
                  <Input
                    type="number"
                    min={0}
                    max={200}
                    value={
                      Number.parseInt(component.props.paddingRight) || Number.parseInt(component.props.padding) || 0
                    }
                    onChange={(e) => onUpdateProps({ paddingRight: Number.parseInt(e.target.value) || 0 })}
                    className="h-7 text-xs bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Bottom</Label>
                  <Input
                    type="number"
                    min={0}
                    max={200}
                    value={
                      Number.parseInt(component.props.paddingBottom) || Number.parseInt(component.props.padding) || 0
                    }
                    onChange={(e) => onUpdateProps({ paddingBottom: Number.parseInt(e.target.value) || 0 })}
                    className="h-7 text-xs bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Left</Label>
                  <Input
                    type="number"
                    min={0}
                    max={200}
                    value={
                      Number.parseInt(component.props.paddingLeft) || Number.parseInt(component.props.padding) || 0
                    }
                    onChange={(e) => onUpdateProps({ paddingLeft: Number.parseInt(e.target.value) || 0 })}
                    className="h-7 text-xs bg-secondary/50 border-border"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <Label className="text-xs text-muted-foreground mb-2 block">Margin</Label>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Top</Label>
                    <Input
                      type="number"
                      min={0}
                      max={200}
                      value={Number.parseInt(component.props.marginTop) || 0}
                      onChange={(e) => onUpdateProps({ marginTop: Number.parseInt(e.target.value) || 0 })}
                      className="h-7 text-xs bg-secondary/50 border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Right</Label>
                    <Input
                      type="number"
                      min={0}
                      max={200}
                      value={Number.parseInt(component.props.marginRight) || 0}
                      onChange={(e) => onUpdateProps({ marginRight: Number.parseInt(e.target.value) || 0 })}
                      className="h-7 text-xs bg-secondary/50 border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Bottom</Label>
                    <Input
                      type="number"
                      min={0}
                      max={200}
                      value={Number.parseInt(component.props.marginBottom) || 0}
                      onChange={(e) => onUpdateProps({ marginBottom: Number.parseInt(e.target.value) || 0 })}
                      className="h-7 text-xs bg-secondary/50 border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Left</Label>
                    <Input
                      type="number"
                      min={0}
                      max={200}
                      value={Number.parseInt(component.props.marginLeft) || 0}
                      onChange={(e) => onUpdateProps({ marginLeft: Number.parseInt(e.target.value) || 0 })}
                      className="h-7 text-xs bg-secondary/50 border-border"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Lock Controls */}
            <div className="space-y-3 p-3 bg-secondary/20 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                Lock Controls
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Lock Position</Label>
                  <Switch
                    checked={component.locked?.position || false}
                    onCheckedChange={() => onToggleLock("position")}
                    className="data-[state=checked]:bg-neon-magenta"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Lock Size</Label>
                  <Switch
                    checked={component.locked?.size || false}
                    onCheckedChange={() => onToggleLock("size")}
                    className="data-[state=checked]:bg-neon-magenta"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Lock Editing</Label>
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
          <TabsContent value="transform" className="mt-0 space-y-4 m-0">
            <div className="space-y-3 p-3 bg-secondary/20 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RotateCw className="w-3 h-3" />
                Rotation
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-muted-foreground">Angle</Label>
                  <span className="text-xs text-muted-foreground">{component.transform?.rotate || 0}°</span>
                </div>
                <Slider
                  value={[component.transform?.rotate || 0]}
                  min={-180}
                  max={180}
                  step={1}
                  onValueChange={([value]) =>
                    onUpdateComponent({ transform: { ...component.transform, rotate: value } })
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-3 p-3 bg-secondary/20 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Maximize2 className="w-3 h-3" />
                Scale
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs text-muted-foreground">X</Label>
                    <span className="text-xs text-muted-foreground">{component.transform?.scaleX || 1}</span>
                  </div>
                  <Slider
                    value={[(component.transform?.scaleX || 1) * 100]}
                    min={10}
                    max={200}
                    step={1}
                    onValueChange={([value]) =>
                      onUpdateComponent({ transform: { ...component.transform, scaleX: value / 100 } })
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs text-muted-foreground">Y</Label>
                    <span className="text-xs text-muted-foreground">{component.transform?.scaleY || 1}</span>
                  </div>
                  <Slider
                    value={[(component.transform?.scaleY || 1) * 100]}
                    min={10}
                    max={200}
                    step={1}
                    onValueChange={([value]) =>
                      onUpdateComponent({ transform: { ...component.transform, scaleY: value / 100 } })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 p-3 bg-secondary/20 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FlipHorizontal className="w-3 h-3" />
                Flip
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onUpdateComponent({
                      transform: { ...component.transform, scaleX: -(component.transform?.scaleX || 1) },
                    })
                  }
                  className="flex-1 h-8 bg-secondary/50"
                >
                  <FlipHorizontal className="w-4 h-4 mr-2" />
                  Horizontal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onUpdateComponent({
                      transform: { ...component.transform, scaleY: -(component.transform?.scaleY || 1) },
                    })
                  }
                  className="flex-1 h-8 bg-secondary/50"
                >
                  <FlipVertical className="w-4 h-4 mr-2" />
                  Vertical
                </Button>
              </div>
            </div>

            <div className="space-y-3 p-3 bg-secondary/20 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Layers className="w-3 h-3" />
                Skew
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs text-muted-foreground">X</Label>
                    <span className="text-xs text-muted-foreground">{component.transform?.skewX || 0}°</span>
                  </div>
                  <Slider
                    value={[component.transform?.skewX || 0]}
                    min={-45}
                    max={45}
                    step={1}
                    onValueChange={([value]) =>
                      onUpdateComponent({ transform: { ...component.transform, skewX: value } })
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs text-muted-foreground">Y</Label>
                    <span className="text-xs text-muted-foreground">{component.transform?.skewY || 0}°</span>
                  </div>
                  <Slider
                    value={[component.transform?.skewY || 0]}
                    min={-45}
                    max={45}
                    step={1}
                    onValueChange={([value]) =>
                      onUpdateComponent({ transform: { ...component.transform, skewY: value } })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateComponent({ transform: { rotate: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0 } })}
              className="w-full h-8 bg-secondary/50"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Reset Transform
            </Button>
          </TabsContent>

          {/* JSON Tab */}
          <TabsContent value="json" className="mt-0 space-y-4 m-0">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-2">
                <Code className="w-3 h-3" />
                Component JSON
              </Label>
              <Textarea
                value={jsonValue}
                onChange={(e) => setJsonValue(e.target.value)}
                className="min-h-[300px] font-mono text-xs bg-secondary/50 border-border"
                disabled={component.locked?.editing}
              />
              {jsonError && <p className="text-xs text-red-400">{jsonError}</p>}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={updateJSON} className="flex-1 h-8 bg-secondary/50">
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={applyJSON}
                  disabled={component.locked?.editing}
                  className="flex-1 h-8 bg-neon-cyan text-background hover:bg-neon-cyan/90"
                >
                  Apply Changes
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
