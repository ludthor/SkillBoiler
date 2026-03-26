import { useSkillStore } from "@/store/skill-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, X } from "lucide-react"
import { FILE_LOCATION_PATHS } from "@/lib/skill-schema"
import type { Skill } from "@/lib/skill-schema"
import { useState } from "react"

const FILE_LOCATIONS: { value: Skill["fileLocation"]; label: string; description: string }[] = [
  { value: "github", label: ".github/skills/", description: "Standard location, tracked in Git" },
  { value: "agents", label: ".agents/skills/", description: "Alternative location, tracked in Git" },
  { value: "claude", label: ".claude/skills/", description: "Claude-specific location" },
  { value: "user-level", label: "User Settings", description: "Roams with VS Code settings sync" },
]

export function StepConfig() {
  const { draftSkill, updateDraft } = useSkillStore()
  const [toolInput, setToolInput] = useState("")

  const tools = draftSkill.tools ?? []

  const addTool = () => {
    const trimmed = toolInput.trim()
    if (trimmed && !tools.includes(trimmed)) {
      updateDraft({ tools: [...tools, trimmed] })
      setToolInput("")
    }
  }

  const removeTool = (tool: string) => {
    updateDraft({ tools: tools.filter((t) => t !== tool) })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Advanced Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Optional settings. These are not required for most skills but can refine behavior.
        </p>
      </div>

      {/* File Location */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>File Location</Label>
          <Tooltip content="Where the SKILL.md file will be saved. .github/skills/ is the standard location.">
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
          </Tooltip>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {FILE_LOCATIONS.map((loc) => (
            <button
              key={loc.value}
              className={`rounded-lg border p-3 text-left text-sm transition-colors cursor-pointer ${
                draftSkill.fileLocation === loc.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => updateDraft({ fileLocation: loc.value })}
            >
              <div className="font-mono text-xs">{loc.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{loc.description}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          Full path: {FILE_LOCATION_PATHS[draftSkill.fileLocation ?? "github"]}{draftSkill.name || "..."}/SKILL.md
        </p>
      </div>

      {/* applyTo */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="apply-to">applyTo Glob Pattern</Label>
          <Tooltip content='A glob pattern that auto-activates this skill when matching files are involved. Leave empty for on-demand only. Avoid "**" (matches everything).'>
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
          </Tooltip>
        </div>
        <Input
          id="apply-to"
          placeholder="e.g. **/*.py or src/components/**"
          value={draftSkill.applyTo ?? ""}
          onChange={(e) => updateDraft({ applyTo: e.target.value || undefined })}
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          Optional. When set, the skill activates automatically for files matching this pattern.
        </p>
      </div>

      {/* Tools */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>Tool Restrictions</Label>
          <Tooltip content="Limit which tools this skill can use. Leave empty to allow all tools.">
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. readFile, grep_search"
            value={toolInput}
            onChange={(e) => setToolInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addTool()
              }
            }}
            className="font-mono"
          />
          <Button variant="outline" onClick={addTool} disabled={!toolInput.trim()}>
            Add
          </Button>
        </div>
        {tools.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tools.map((tool) => (
              <Badge key={tool} variant="secondary" className="gap-1 font-mono">
                {tool}
                <button onClick={() => removeTool(tool)} className="hover:text-destructive cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Optional. Press Enter to add each tool name. Leave empty to allow all tools.
        </p>
      </div>
    </div>
  )
}
