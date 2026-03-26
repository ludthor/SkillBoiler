import { useState } from "react"
import { useSkillStore } from "@/store/skill-store"
import { generateSkillMarkdown } from "@/lib/skill-generator"
import { MarkdownPreview } from "@/components/shared/markdown-preview"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ClipboardCopy, Download, Eye, Code } from "lucide-react"
import type { Skill } from "@/lib/skill-schema"

export function StepPreview() {
  const { draftSkill } = useSkillStore()
  const [view, setView] = useState<"raw" | "rendered">("rendered")
  const [copied, setCopied] = useState(false)

  const markdown = generateSkillMarkdown(draftSkill as Skill)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "SKILL.md"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Preview & Export</h2>
        <p className="text-sm text-muted-foreground">
          Review your generated SKILL.md. Copy or download it, then save to your library.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg border p-0.5">
          <button
            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
              view === "rendered" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
            onClick={() => setView("rendered")}
          >
            <Eye className="h-3 w-3 inline mr-1" />
            Preview
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
              view === "raw" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
            onClick={() => setView("raw")}
          >
            <Code className="h-3 w-3 inline mr-1" />
            Raw
          </button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
                Copy
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-3.5 w-3.5 mr-1" />
            Download
          </Button>
        </div>
      </div>

      {/* File path info */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="font-mono">
          {draftSkill.fileLocation ?? "github"}
        </Badge>
        <span className="font-mono">
          .github/skills/{draftSkill.name || "..."}/SKILL.md
        </span>
      </div>

      {/* Content */}
      <div className="border rounded-lg overflow-hidden">
        {view === "raw" ? (
          <pre className="p-4 text-sm font-mono overflow-x-auto bg-muted/50 max-h-[500px] overflow-y-auto whitespace-pre-wrap">
            {markdown}
          </pre>
        ) : (
          <div className="p-6 max-h-[500px] overflow-y-auto">
            <MarkdownPreview content={markdown} />
          </div>
        )}
      </div>
    </div>
  )
}
