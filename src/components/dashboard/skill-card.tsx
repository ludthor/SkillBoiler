import { useSkillStore } from "@/store/skill-store"
import type { Skill } from "@/lib/skill-schema"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Edit, Eye, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getSkillFilePath } from "@/lib/skill-schema"

export function SkillCard({ skill }: { skill: Skill }) {
  const navigate = useNavigate()
  const { deleteSkill, duplicateSkill } = useSkillStore()

  const filePath = getSkillFilePath(skill)
  const relativeDate = formatRelativeDate(skill.updatedAt)

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-mono">{skill.name}</CardTitle>
          <Badge variant="secondary" className="shrink-0 text-[10px]">
            {skill.fileLocation}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground font-mono truncate" title={filePath}>
          {filePath}
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {skill.description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-3 border-t gap-1">
        <span className="text-xs text-muted-foreground">{relativeDate}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/preview/${skill.id}`)} title="Preview">
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/edit/${skill.id}`)} title="Edit">
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => duplicateSkill(skill.id)} title="Duplicate">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteSkill(skill.id)} title="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  return date.toLocaleDateString()
}
