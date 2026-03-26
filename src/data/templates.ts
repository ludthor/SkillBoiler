import type { DraftSkill } from "@/lib/skill-schema"

export interface SkillTemplate {
  id: string
  label: string
  emoji: string
  brief: string
  draft: Omit<DraftSkill, "id" | "createdAt" | "updatedAt">
}

export const SKILL_TEMPLATES: SkillTemplate[] = [
  {
    id: "summarizer",
    label: "Summarizer",
    emoji: "📝",
    brief: "A skill that summarizes content (issues, docs, PRs, etc.)",
    draft: {
      name: "summarize-content",
      description:
        "Summarizes the content of a document or text, providing a concise overview of the main points. Use when: asked to summarize, condense, or provide an overview of content.",
      purpose:
        "Summarize documents, issues, pull requests, or any text content into a concise, actionable overview that preserves the key information.",
      usage:
        "Provide the content to summarize. The skill will extract key points, decisions, and action items, and return a structured summary.",
      guidelines: [
        {
          id: "format",
          title: "Output Format",
          content:
            "- Start with a one-sentence TL;DR\n- Use bullet points for key findings\n- Keep the summary shorter than the original\n- Preserve any important references or links",
        },
        {
          id: "edge-cases",
          title: "Edge Cases",
          content:
            "- If the content is very short (< 50 words), note that it's already concise\n- If the content contains code, summarize the intent rather than repeating the code",
        },
      ],
      fileLocation: "github",
    },
  },
  {
    id: "code-generator",
    label: "Code Generator",
    emoji: "⚡",
    brief: "A skill that generates code based on specifications",
    draft: {
      name: "generate-code",
      description:
        "Generates code based on specifications or requirements. Use when: asked to create, scaffold, or generate code for a specific purpose. DO NOT USE FOR: debugging or fixing existing code.",
      purpose:
        "Generate well-structured, production-ready code based on a description of what is needed, following project conventions and best practices.",
      usage:
        "Describe what code should be generated, including the language, framework, and any specific requirements. The skill will produce complete, runnable code.",
      guidelines: [
        {
          id: "conventions",
          title: "Code Conventions",
          content:
            "- Follow the project's existing coding style\n- Include necessary imports\n- Add TypeScript types where applicable\n- Use descriptive variable names",
        },
        {
          id: "structure",
          title: "Output Structure",
          content:
            "- Provide the complete file content, not just snippets\n- Include inline comments only where the logic isn't self-evident\n- Group related functions together",
        },
      ],
      fileLocation: "github",
    },
  },
  {
    id: "reviewer",
    label: "Code Reviewer",
    emoji: "🔍",
    brief: "A skill that reviews code for quality, bugs, and improvements",
    draft: {
      name: "review-code",
      description:
        "Reviews code for quality, potential bugs, and improvement opportunities. Use when: asked to review, audit, or check code for issues. ALWAYS use when a code review is requested.",
      purpose:
        "Analyze code for potential bugs, security issues, performance problems, and adherence to best practices. Provide actionable feedback.",
      usage:
        "Provide the code to review. The skill will analyze it and return structured feedback organized by severity (critical, warning, suggestion).",
      guidelines: [
        {
          id: "severity",
          title: "Severity Levels",
          content:
            "- **Critical**: Bugs, security vulnerabilities, data loss risks\n- **Warning**: Performance issues, deprecated patterns, missing error handling\n- **Suggestion**: Style improvements, better naming, refactoring opportunities",
        },
        {
          id: "format",
          title: "Feedback Format",
          content:
            "- Reference specific line numbers or code sections\n- Explain WHY something is an issue, not just WHAT\n- Provide a concrete fix or alternative for each issue",
        },
      ],
      fileLocation: "github",
    },
  },
  {
    id: "workflow",
    label: "Workflow Automation",
    emoji: "🔄",
    brief: "A skill that automates a multi-step development workflow",
    draft: {
      name: "automate-workflow",
      description:
        "Automates a multi-step development workflow. Use when: asked to perform a sequence of related tasks, set up a pipeline, or automate repetitive development operations.",
      purpose:
        "Execute a structured sequence of development tasks, ensuring each step completes successfully before moving to the next. Report progress and handle errors gracefully.",
      usage:
        "Describe the workflow to automate. The skill will break it into discrete steps, execute them in order, and report the outcome of each step.",
      guidelines: [
        {
          id: "steps",
          title: "Step Execution",
          content:
            "- Validate prerequisites before starting\n- Execute steps sequentially unless explicitly parallelizable\n- Report progress after each step\n- Stop and report if a step fails, with the error details",
        },
        {
          id: "rollback",
          title: "Error Handling",
          content:
            "- If a step fails, provide clear error context\n- Suggest manual resolution steps\n- Don't attempt destructive rollbacks without confirmation",
        },
      ],
      fileLocation: "github",
    },
  },
]
