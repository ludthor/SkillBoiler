export interface AnalysisResult {
  score: number // 0-100
  level: "poor" | "fair" | "good" | "excellent"
  checks: AnalysisCheck[]
}

export interface AnalysisCheck {
  id: string
  label: string
  passed: boolean
  message: string
  weight: number
}

const ACTION_VERBS = [
  "summarize", "create", "generate", "analyze", "build", "convert",
  "extract", "format", "implement", "review", "suggest", "transform",
  "validate", "debug", "fix", "refactor", "optimize", "test",
  "document", "deploy", "configure", "scaffold", "parse", "render",
  "lint", "search", "find", "list", "check", "run", "execute",
  "address", "form", "show", "update", "manage",
]

export function analyzeDescription(description: string): AnalysisResult {
  const checks: AnalysisCheck[] = []

  // 1. Length check (15 points)
  const len = description.length
  checks.push({
    id: "length",
    label: "Description length",
    passed: len >= 50 && len <= 300,
    message:
      len < 50
        ? `Too short (${len} chars). Aim for 50-300 characters for good discoverability.`
        : len > 300
          ? `Quite long (${len} chars). Consider trimming to under 300 characters.`
          : `Good length (${len} chars).`,
    weight: 15,
  })

  // 2. Starts with action verb (20 points)
  const firstWord = description.split(/[\s,.]+/)[0]?.toLowerCase() ?? ""
  const startsWithVerb = ACTION_VERBS.some(
    (v) => firstWord === v || firstWord === v + "s" || firstWord === v + "es"
  )
  checks.push({
    id: "action-verb",
    label: "Starts with action verb",
    passed: startsWithVerb,
    message: startsWithVerb
      ? `Starts with "${firstWord}" — clear and action-oriented.`
      : `Consider starting with an action verb (e.g. "Summarizes", "Creates", "Generates").`,
    weight: 20,
  })

  // 3. Trigger phrases (25 points)
  const triggerPatterns = [
    /use when[:\s]/i,
    /always use/i,
    /use for[:\s]/i,
    /do not use/i,
    /use this/i,
  ]
  const hasTrigger = triggerPatterns.some((p) => p.test(description))
  checks.push({
    id: "trigger-phrases",
    label: "Contains trigger phrases",
    passed: hasTrigger,
    message: hasTrigger
      ? "Contains discovery trigger phrases — the agent can find this skill."
      : 'Add trigger phrases like "Use when:", "ALWAYS use when", or "DO NOT USE FOR:" to help agent discovery.',
    weight: 25,
  })

  // 4. YAML safety (20 points)
  const hasUnsafeColons = /[^'"]:[^/\s]/.test(description) && !description.startsWith("'")
  checks.push({
    id: "yaml-safety",
    label: "YAML-safe content",
    passed: !hasUnsafeColons,
    message: hasUnsafeColons
      ? "Contains colons that might break YAML frontmatter. The generator will auto-quote it, but be aware."
      : "No YAML-unsafe characters detected.",
    weight: 20,
  })

  // 5. Keyword richness (20 points)
  const words = description.toLowerCase().split(/\s+/)
  const uniqueWords = new Set(words.filter((w) => w.length > 3))
  const isRich = uniqueWords.size >= 8
  checks.push({
    id: "keyword-richness",
    label: "Keyword richness",
    passed: isRich,
    message: isRich
      ? `Good keyword diversity (${uniqueWords.size} unique terms). This helps discoverability.`
      : `Low keyword diversity (${uniqueWords.size} unique terms). Add more specific terms related to your skill's domain.`,
    weight: 20,
  })

  // Calculate score
  const score = checks.reduce((acc, check) => acc + (check.passed ? check.weight : 0), 0)

  const level: AnalysisResult["level"] =
    score >= 80 ? "excellent" : score >= 60 ? "good" : score >= 35 ? "fair" : "poor"

  return { score, level, checks }
}
