import { useSkillStore } from "@/store/skill-store"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toKebabCase } from "@/lib/skill-schema"
import { DescriptionAnalyzer, DescriptionTip } from "./description-analyzer"

export function StepIdentity() {
  const { draftSkill, updateDraft } = useSkillStore()

  const handleNameChange = (value: string) => {
    updateDraft({ name: toKebabCase(value) })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Identity</h2>
        <p className="text-sm text-muted-foreground">
          Name your skill and write its description — the most critical field for discoverability.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skill-name">Skill Name</Label>
        <Input
          id="skill-name"
          placeholder="my-awesome-skill"
          value={draftSkill.name ?? ""}
          onChange={(e) => handleNameChange(e.target.value)}
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          Kebab-case only (auto-formatted). This becomes the folder name: <code className="text-primary">.github/skills/{draftSkill.name || "..."}/SKILL.md</code>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skill-description">Description</Label>
        <DescriptionTip />
        <Textarea
          id="skill-description"
          placeholder='Summarizes the content of a document or text. Use when: asked to summarize, condense, or provide an overview. ALWAYS use when summarization is requested.'
          value={draftSkill.description ?? ""}
          onChange={(e) => updateDraft({ description: e.target.value })}
          rows={4}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{(draftSkill.description ?? "").length} characters</span>
          <span>Aim for 50–300 characters</span>
        </div>
        <DescriptionAnalyzer description={draftSkill.description ?? ""} />
      </div>
    </div>
  )
}
