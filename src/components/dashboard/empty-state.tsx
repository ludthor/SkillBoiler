import { Flame, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useSkillStore } from "@/store/skill-store"

export function EmptyState() {
  const navigate = useNavigate()
  const { resetDraft } = useSkillStore()

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-primary/10 p-4 mb-6">
        <Flame className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No skills yet</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Start building your first VS Code agent skill. SkillBoiler helps you
        structure, validate, and export production-ready SKILL.md files.
      </p>
      <Button
        onClick={() => {
          resetDraft()
          navigate("/create")
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Your First Skill
      </Button>
    </div>
  )
}
