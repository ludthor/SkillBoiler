import { useEffect } from "react"
import { useSkillStore } from "@/store/skill-store"
import { WizardShell } from "@/components/builder/wizard-shell"

export function CreatePage() {
  const { draftSkill, resetDraft } = useSkillStore()

  // If draft has no name (fresh visit without template), ensure we start clean
  useEffect(() => {
    if (!draftSkill.name && !draftSkill.description) {
      resetDraft()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <WizardShell mode="create" />
}
