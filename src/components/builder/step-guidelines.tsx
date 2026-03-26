import { useSkillStore } from "@/store/skill-store"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical, Trash2, Lightbulb } from "lucide-react"
import type { SkillGuideline } from "@/lib/skill-schema"

const SUGGESTION_CHIPS = [
  "Output Format",
  "Error Handling",
  "Edge Cases",
  "Examples",
  "Constraints",
  "Security",
  "Performance",
  "Testing",
]

export function StepGuidelines() {
  const { draftSkill, updateDraft } = useSkillStore()
  const guidelines = draftSkill.guidelines ?? []

  const addGuideline = (title = "") => {
    const newGuideline: SkillGuideline = {
      id: crypto.randomUUID(),
      title,
      content: "",
    }
    updateDraft({ guidelines: [...guidelines, newGuideline] })
  }

  const updateGuideline = (id: string, updates: Partial<SkillGuideline>) => {
    updateDraft({
      guidelines: guidelines.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })
  }

  const removeGuideline = (id: string) => {
    updateDraft({ guidelines: guidelines.filter((g) => g.id !== id) })
  }

  const moveGuideline = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= guidelines.length) return
    const updated = [...guidelines]
    const [moved] = updated.splice(index, 1)
    updated.splice(newIndex, 0, moved)
    updateDraft({ guidelines: updated })
  }

  const usedTitles = new Set(guidelines.map((g) => g.title))
  const availableChips = SUGGESTION_CHIPS.filter((c) => !usedTitles.has(c))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Guidelines</h2>
        <p className="text-sm text-muted-foreground">
          Add implementation guidelines — tips, rules, and output formats that define how the skill behaves.
          Each becomes a <code>### Section</code> under <code>## Guidelines</code>.
        </p>
      </div>

      {/* Suggestion chips */}
      {availableChips.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lightbulb className="h-3.5 w-3.5" />
            Quick add:
          </div>
          <div className="flex flex-wrap gap-2">
            {availableChips.map((chip) => (
              <Button
                key={chip}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => addGuideline(chip)}
              >
                <Plus className="h-3 w-3 mr-1" />
                {chip}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Guidelines list */}
      <div className="space-y-4">
        {guidelines.map((guideline, index) => (
          <div
            key={guideline.id}
            className="border rounded-lg p-4 space-y-3 bg-card"
          >
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5">
                <button
                  className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                  onClick={() => moveGuideline(index, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                >
                  <GripVertical className="h-3 w-3 rotate-0" />
                </button>
              </div>
              <div className="flex-1">
                <Label className="sr-only">Guideline title</Label>
                <Input
                  placeholder="Section title (e.g. Output Format)"
                  value={guideline.title}
                  onChange={(e) => updateGuideline(guideline.id, { title: e.target.value })}
                  className="font-medium"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeGuideline(guideline.id)}
                title="Remove guideline"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div>
              <Label className="sr-only">Guideline content</Label>
              <Textarea
                placeholder="- Use bullet points for clear guidelines&#10;- Be specific about expected behavior&#10;- Include examples where helpful"
                value={guideline.content}
                onChange={(e) => updateGuideline(guideline.id, { content: e.target.value })}
                rows={4}
              />
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={() => addGuideline()} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Guideline Section
      </Button>
    </div>
  )
}
