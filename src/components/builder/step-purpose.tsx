import { useSkillStore } from "@/store/skill-store"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function StepPurpose() {
  const { draftSkill, updateDraft } = useSkillStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Purpose & Usage</h2>
        <p className="text-sm text-muted-foreground">
          Explain what the skill does and how the agent should use it.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skill-purpose">Purpose</Label>
        <p className="text-xs text-muted-foreground">
          A clear description of what this skill accomplishes. This becomes the <code>## Purpose</code> section.
        </p>
        <Textarea
          id="skill-purpose"
          placeholder="Analyze code for potential bugs, security issues, and performance problems. Provide actionable feedback organized by severity."
          value={draftSkill.purpose ?? ""}
          onChange={(e) => updateDraft({ purpose: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skill-usage">Usage</Label>
        <p className="text-xs text-muted-foreground">
          How should the agent invoke this skill? What inputs does it expect? This becomes the <code>## Usage</code> section.
        </p>
        <Textarea
          id="skill-usage"
          placeholder="Provide the code files to review. The skill will analyze them and return structured feedback grouped by severity (critical, warning, suggestion)."
          value={draftSkill.usage ?? ""}
          onChange={(e) => updateDraft({ usage: e.target.value })}
          rows={4}
        />
      </div>
    </div>
  )
}
