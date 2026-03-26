import type { Skill } from "@/lib/skill-schema"
import { SkillCard } from "./skill-card"

export function SkillGrid({ skills }: { skills: Skill[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  )
}
