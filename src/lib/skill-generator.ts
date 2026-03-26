import type { Skill } from "./skill-schema"

function escapeYamlString(value: string): string {
  if (value.includes(":") || value.includes("#") || value.includes("'") || value.includes('"') || value.includes("\n")) {
    return `'${value.replace(/'/g, "''")}'`
  }
  return value
}

export function generateSkillMarkdown(skill: Skill): string {
  const lines: string[] = []

  // YAML frontmatter
  lines.push("---")
  lines.push(`name: ${skill.name}`)
  lines.push(`description: ${escapeYamlString(skill.description)}`)
  if (skill.applyTo) {
    lines.push(`applyTo: ${escapeYamlString(skill.applyTo)}`)
  }
  if (skill.tools && skill.tools.length > 0) {
    lines.push("tools:")
    for (const tool of skill.tools) {
      lines.push(`  - ${tool}`)
    }
  }
  lines.push("---")
  lines.push("")

  // Purpose
  lines.push(`# ${formatTitle(skill.name)}`)
  lines.push("")
  lines.push("## Purpose")
  lines.push("")
  lines.push(skill.purpose)
  lines.push("")

  // Usage
  lines.push("## Usage")
  lines.push("")
  lines.push(skill.usage)
  lines.push("")

  // Guidelines
  if (skill.guidelines.length > 0) {
    lines.push("## Guidelines")
    lines.push("")
    for (const guideline of skill.guidelines) {
      lines.push(`### ${guideline.title}`)
      lines.push("")
      lines.push(guideline.content)
      lines.push("")
    }
  }

  return lines.join("\n")
}

function formatTitle(kebabName: string): string {
  return kebabName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
