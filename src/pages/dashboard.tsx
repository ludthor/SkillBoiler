import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Upload } from "lucide-react"
import { useSkillStore } from "@/store/skill-store"
import { Button } from "@/components/ui/button"
import { SkillGrid } from "@/components/dashboard/skill-grid"
import { TemplateGallery } from "@/components/dashboard/template-gallery"
import { EmptyState } from "@/components/dashboard/empty-state"
import { ImportDialog } from "@/components/shared/import-dialog"

export function DashboardPage() {
  const { skills, resetDraft } = useSkillStore()
  const navigate = useNavigate()
  const [importOpen, setImportOpen] = useState(false)

  const hasSkills = skills.length > 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">SkillBoiler</h1>
        <p className="text-muted-foreground">
          Build, validate, and export VS Code agent skills — structured and semi-automated.
        </p>
      </div>

      {hasSkills ? (
        <>
          {/* Actions bar */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              Your Skills ({skills.length})
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImportOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  resetDraft()
                  navigate("/create")
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Skill
              </Button>
            </div>
          </div>

          <SkillGrid skills={skills} />

          <div className="mt-10">
            <TemplateGallery />
          </div>
        </>
      ) : (
        <>
          <EmptyState />
          <div className="mt-10">
            <TemplateGallery />
          </div>
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Existing SKILL.md
            </Button>
          </div>
        </>
      )}

      <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  )
}
