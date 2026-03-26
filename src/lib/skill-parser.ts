import type { DraftSkill, SkillGuideline } from "./skill-schema"

export function parseSkillMarkdown(markdown: string): DraftSkill {
  const skill: DraftSkill = {
    id: crypto.randomUUID(),
    guidelines: [],
    fileLocation: "github",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Extract frontmatter
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/)
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1]
    skill.name = extractYamlValue(frontmatter, "name")
    skill.description = extractYamlValue(frontmatter, "description")
    const applyTo = extractYamlValue(frontmatter, "applyTo")
    if (applyTo) skill.applyTo = applyTo

    // Parse tools array
    const toolsMatch = frontmatter.match(/tools:\n((?:\s+-\s+.+\n?)+)/)
    if (toolsMatch) {
      skill.tools = toolsMatch[1]
        .split("\n")
        .map((line) => line.replace(/^\s+-\s+/, "").trim())
        .filter(Boolean)
    }
  }

  // Extract body (after frontmatter)
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n*/, "")

  // Extract purpose
  const purposeMatch = body.match(/## Purpose\n\n([\s\S]*?)(?=\n## |\n$|$)/)
  if (purposeMatch) {
    skill.purpose = purposeMatch[1].trim()
  }

  // Extract usage
  const usageMatch = body.match(/## Usage\n\n([\s\S]*?)(?=\n## |\n$|$)/)
  if (usageMatch) {
    skill.usage = usageMatch[1].trim()
  }

  // Extract guidelines
  const guidelinesSection = body.match(/## Guidelines\n\n([\s\S]*)$/)
  if (guidelinesSection) {
    const guidelinesText = guidelinesSection[1]
    const guidelineMatches = guidelinesText.matchAll(/### (.+)\n\n([\s\S]*?)(?=\n### |\n$|$)/g)
    const guidelines: SkillGuideline[] = []
    for (const match of guidelineMatches) {
      guidelines.push({
        id: crypto.randomUUID(),
        title: match[1].trim(),
        content: match[2].trim(),
      })
    }
    skill.guidelines = guidelines
  }

  return skill
}

function extractYamlValue(yaml: string, key: string): string {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`^${escapedKey}:\\s*(.+)$`, "m")
  const match = yaml.match(regex)
  if (!match) return ""
  let value = match[1].trim()
  // Remove surrounding quotes
  if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
    value = value.slice(1, -1)
  }
  // Unescape single quotes
  value = value.replace(/''/g, "'")
  return value
}
