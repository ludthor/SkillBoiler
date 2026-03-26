import { z } from "zod"

export const skillGuidelineSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Guideline title is required"),
  content: z.string().min(1, "Guideline content is required"),
})

export const skillSchema = z.object({
  id: z.string(),
  name: z.string()
    .min(1, "Name is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Name must be kebab-case (e.g. my-awesome-skill)"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description should be under 500 characters"),
  purpose: z.string().min(1, "Purpose is required"),
  usage: z.string().min(1, "Usage is required"),
  guidelines: z.array(skillGuidelineSchema),
  applyTo: z.string().optional(),
  tools: z.array(z.string()).optional(),
  fileLocation: z.enum(["github", "agents", "claude", "user-level"]),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Skill = z.infer<typeof skillSchema>
export type SkillGuideline = z.infer<typeof skillGuidelineSchema>

export type DraftSkill = Partial<Skill> & { id: string }

export function createEmptySkill(): DraftSkill {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    purpose: "",
    usage: "",
    guidelines: [],
    fileLocation: "github",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function toKebabCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export const FILE_LOCATION_PATHS: Record<Skill["fileLocation"], string> = {
  github: ".github/skills/",
  agents: ".agents/skills/",
  claude: ".claude/skills/",
  "user-level": "~/Library/Application Support/Code/User/prompts/",
}

export function getSkillFilePath(skill: Pick<Skill, "name" | "fileLocation">): string {
  return `${FILE_LOCATION_PATHS[skill.fileLocation]}${skill.name}/SKILL.md`
}
