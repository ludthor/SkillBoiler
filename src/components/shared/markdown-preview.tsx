import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

export function MarkdownPreview({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  )
}
