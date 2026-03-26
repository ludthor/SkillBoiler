import { useMemo } from "react"
import { analyzeDescription } from "@/lib/description-analyzer"
import type { AnalysisResult } from "@/lib/description-analyzer"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

export function DescriptionAnalyzer({ description }: { description: string }) {
  const analysis = useMemo(() => analyzeDescription(description), [description])

  if (!description || description.length < 5) {
    return (
      <div className="text-xs text-muted-foreground mt-2">
        Start typing your description to see quality analysis...
      </div>
    )
  }

  return (
    <div className="mt-3 space-y-3">
      <ScoreBar analysis={analysis} />
      <div className="space-y-1.5">
        {analysis.checks.map((check) => (
          <div key={check.id} className="flex items-start gap-2 text-xs">
            {check.passed ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            )}
            <div>
              <span className={cn("font-medium", check.passed ? "text-foreground" : "text-muted-foreground")}>
                {check.label}
              </span>
              <span className="text-muted-foreground ml-1">— {check.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScoreBar({ analysis }: { analysis: AnalysisResult }) {
  const variant = {
    poor: "destructive" as const,
    fair: "warning" as const,
    good: "secondary" as const,
    excellent: "success" as const,
  }[analysis.level]

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            {
              "bg-destructive": analysis.level === "poor",
              "bg-warning": analysis.level === "fair",
              "bg-primary": analysis.level === "good",
              "bg-success": analysis.level === "excellent",
            }
          )}
          style={{ width: `${analysis.score}%` }}
        />
      </div>
      <Badge variant={variant} className="capitalize">
        {analysis.level}
      </Badge>
      <span className="text-xs text-muted-foreground tabular-nums">{analysis.score}/100</span>
    </div>
  )
}

export function DescriptionTip() {
  return (
    <div className="flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 p-3 text-xs">
      <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <div className="text-muted-foreground">
        <span className="font-medium text-foreground">The description is the #1 discovery field.</span>{" "}
        The VS Code agent decides whether to load your skill based solely on keywords in the description.
        Include trigger phrases like <code className="text-primary">"Use when:"</code>, start with an action verb,
        and pack in relevant keywords.
      </div>
    </div>
  )
}
