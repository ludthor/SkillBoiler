import { useParams, useNavigate } from "react-router-dom"
import { useSkillStore } from "@/store/skill-store"
import { generateSkillMarkdown } from "@/lib/skill-generator"
import { MarkdownPreview } from "@/components/shared/markdown-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, ClipboardCopy, Download } from "lucide-react"
import { useState } from "react"

export function PreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { skills } = useSkillStore()
  const [copied, setCopied] = useState(false)

  const skill = skills.find((s) => s.id === id)

  if (!skill) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Skill not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const markdown = generateSkillMarkdown(skill)

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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-3.5 w-3.5 mr-1" />
            Download
          </Button>
          <Button size="sm" onClick={() => navigate(`/edit/${skill.id}`)}>
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
        </div>
      </div>

      {/* Raw markdown */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Raw SKILL.md</h3>
        <pre className="p-4 rounded-lg border bg-muted/50 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
          {markdown}
        </pre>
      </div>

      {/* Rendered preview */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Rendered Preview</h3>
        <div className="p-6 rounded-lg border">
          <MarkdownPreview content={markdown} />
        </div>
      </div>
    </div>
  )
}
