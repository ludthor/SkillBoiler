import { useNavigate } from "react-router-dom"
import { useSkillStore } from "@/store/skill-store"
import { createEmptySkill } from "@/lib/skill-schema"
import { SKILL_TEMPLATES } from "@/data/templates"
import { Card, CardContent } from "@/components/ui/card"

export function TemplateGallery() {
  const navigate = useNavigate()
  const { setDraft } = useSkillStore()

  const handleTemplateClick = (templateId: string) => {
    const template = SKILL_TEMPLATES.find((t) => t.id === templateId)
    if (!template) return

    const draft = {
      ...createEmptySkill(),
      ...template.draft,
    }
    setDraft(draft)
    navigate("/create")
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Quick Start Templates</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SKILL_TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer hover:shadow-md hover:border-primary/50 transition-all"
            onClick={() => handleTemplateClick(template.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">{template.emoji}</div>
              <h3 className="text-sm font-medium">{template.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{template.brief}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
