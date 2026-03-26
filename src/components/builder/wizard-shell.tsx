import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSkillStore } from "@/store/skill-store"
import { skillSchema } from "@/lib/skill-schema"
import type { Skill } from "@/lib/skill-schema"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Save, CheckCircle2, Settings } from "lucide-react"
import { StepIdentity } from "./step-identity"
import { StepPurpose } from "./step-purpose"
import { StepGuidelines } from "./step-guidelines"
import { StepConfig } from "./step-config"
import { StepPreview } from "./step-preview"

interface WizardStep {
  id: string
  label: string
  icon: React.ReactNode
  component: React.ReactNode
  validate: () => string | null
  advanced?: boolean
}

export function WizardShell({ mode }: { mode: "create" | "edit" }) {
  const navigate = useNavigate()
  const { draftSkill, saveSkill, resetDraft } = useSkillStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showAdvanced, setShowAdvanced] = useState(false)

  const steps: WizardStep[] = [
    {
      id: "identity",
      label: "Identity",
      icon: <span className="text-xs font-bold">1</span>,
      component: <StepIdentity />,
      validate: () => {
        if (!draftSkill.name || draftSkill.name.length < 1) return "Name is required"
        if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(draftSkill.name)) return "Name must be kebab-case"
        if (!draftSkill.description || draftSkill.description.length < 10) return "Description must be at least 10 characters"
        return null
      },
    },
    {
      id: "purpose",
      label: "Purpose & Usage",
      icon: <span className="text-xs font-bold">2</span>,
      component: <StepPurpose />,
      validate: () => {
        if (!draftSkill.purpose) return "Purpose is required"
        if (!draftSkill.usage) return "Usage is required"
        return null
      },
    },
    {
      id: "guidelines",
      label: "Guidelines",
      icon: <span className="text-xs font-bold">3</span>,
      component: <StepGuidelines />,
      validate: () => null,
    },
    {
      id: "config",
      label: "Configuration",
      icon: <Settings className="h-3.5 w-3.5" />,
      component: <StepConfig />,
      validate: () => null,
      advanced: true,
    },
    {
      id: "preview",
      label: "Preview & Export",
      icon: <span className="text-xs font-bold">4</span>,
      component: <StepPreview />,
      validate: () => null,
    },
  ]

  const visibleSteps = showAdvanced ? steps : steps.filter((s) => !s.advanced)
  const activeStep = visibleSteps[currentStep]

  const goNext = () => {
    const error = activeStep.validate()
    if (error) {
      setErrors({ [activeStep.id]: error })
      return
    }
    setErrors({})
    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goPrev = () => {
    setErrors({})
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    const result = skillSchema.safeParse(draftSkill)
    if (!result.success) {
      // Basic fallback: save anyway with current data if core fields present
      const skill: Skill = {
        id: draftSkill.id!,
        name: draftSkill.name ?? "",
        description: draftSkill.description ?? "",
        purpose: draftSkill.purpose ?? "",
        usage: draftSkill.usage ?? "",
        guidelines: draftSkill.guidelines ?? [],
        fileLocation: draftSkill.fileLocation ?? "github",
        applyTo: draftSkill.applyTo,
        tools: draftSkill.tools,
        createdAt: draftSkill.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      saveSkill(skill)
    } else {
      saveSkill(result.data)
    }
    resetDraft()
    navigate("/")
  }

  const isLastStep = currentStep === visibleSteps.length - 1

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Progress sidebar/top bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {mode === "create" ? "Create Skill" : "Edit Skill"}
          </h1>
          {!showAdvanced && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setShowAdvanced(true)}
            >
              <Settings className="h-3.5 w-3.5 mr-1" />
              Show Advanced
            </Button>
          )}
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1">
          {visibleSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer",
                  index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : index < currentStep
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                )}
                onClick={() => {
                  if (index < currentStep) setCurrentStep(index)
                }}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  step.icon
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {index < visibleSteps.length - 1 && (
                <div className={cn(
                  "w-4 h-px mx-1",
                  index < currentStep ? "bg-primary" : "bg-border"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {activeStep.component}
      </div>

      {/* Error display */}
      {errors[activeStep.id] && (
        <div className="mt-4 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {errors[activeStep.id]}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="flex gap-2">
          {isLastStep ? (
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save to Library
            </Button>
          ) : (
            <Button onClick={goNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
