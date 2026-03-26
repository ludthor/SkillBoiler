import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSkillStore } from "@/store/skill-store"
import { WizardShell } from "@/components/builder/wizard-shell"

export function EditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { skills, loadSkillIntoDraft } = useSkillStore()

  useEffect(() => {
    if (!id) {
      navigate("/")
      return
    }
    const skill = skills.find((s) => s.id === id)
    if (!skill) {
      navigate("/")
      return
    }
    loadSkillIntoDraft(id)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  return <WizardShell mode="edit" />
}
