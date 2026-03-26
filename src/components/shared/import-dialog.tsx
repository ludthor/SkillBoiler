import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useSkillStore } from "@/store/skill-store"
import { parseSkillMarkdown } from "@/lib/skill-parser"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText } from "lucide-react"

export function ImportDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const { setDraft } = useSkillStore()
  const [pastedContent, setPastedContent] = useState("")
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = (markdown: string) => {
    try {
      const draft = parseSkillMarkdown(markdown)
      if (!draft.name && !draft.description && !draft.purpose) {
        setError("Could not parse any skill data from this content. Make sure it's a valid SKILL.md file.")
        return
      }
      setDraft(draft)
      onOpenChange(false)
      setPastedContent("")
      setError("")
      navigate("/create")
    } catch {
      setError("Failed to parse the markdown. Make sure it's a valid SKILL.md file.")
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 1024 * 1024) {
      setError("File is too large. Maximum size is 1 MB.")
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result
      if (typeof text === "string") {
        handleImport(text)
      }
    }
    reader.readAsText(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import SKILL.md</DialogTitle>
          <DialogDescription>
            Upload a SKILL.md file or paste its contents to import an existing skill.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* File upload */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full h-20 border-dashed"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-1">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">Upload SKILL.md file</span>
              </div>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or paste below</span>
            </div>
          </div>

          {/* Paste */}
          <Textarea
            placeholder={`---\nname: my-skill\ndescription: 'My skill description. Use when: ...'\n---\n\n# My Skill\n\n## Purpose\n...`}
            value={pastedContent}
            onChange={(e) => {
              setPastedContent(e.target.value)
              setError("")
            }}
            rows={8}
            className="font-mono text-xs"
          />

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleImport(pastedContent)}
              disabled={!pastedContent.trim()}
            >
              <FileText className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
