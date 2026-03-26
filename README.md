# SkillBoiler — VS Code Agent Skill Builder

A single-page application that helps you build, validate, and export VS Code agent skills (SKILL.md files) with a structured, wizard-like UX.

**Live Demo:** [https://ludthor.github.io/SkillBoiler/](https://ludthor.github.io/SkillBoiler/)

## Features

- **5-Step Skill Builder Wizard** — Identity, Purpose & Usage, Guidelines, Configuration, Preview & Export
- **Description Quality Analyzer** — Real-time scoring of your skill's discoverability (the #1 factor for agent discovery)
- **Quick Start Templates** — 4 pre-built templates (Summarizer, Code Generator, Code Reviewer, Workflow Automation)
- **Import / Export** — Import existing SKILL.md files (upload or paste), export as download or clipboard copy
- **Persistent Library** — Skills saved to localStorage, survive page refreshes
- **Dark / Light Theme** — Toggle with one click, respects system preference
- **Progressive Disclosure** — Essential fields by default, advanced configuration (applyTo, tools) optionally revealed

## Tech Stack

- React 19 + TypeScript + Vite 8
- TailwindCSS v4
- Zustand (state management with localStorage persistence)
- react-markdown + remark-gfm (live markdown preview)
- Zod (runtime validation)
- Lucide React (icons)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── lib/                  # Core logic
│   ├── skill-schema.ts   # Zod types + validation
│   ├── skill-generator.ts # Skill → SKILL.md markdown
│   ├── skill-parser.ts   # SKILL.md → Skill object (import)
│   ├── description-analyzer.ts # Quality scoring
│   └── utils.ts          # cn() utility
├── store/
│   └── skill-store.ts    # Zustand store with CRUD + persistence
├── components/
│   ├── ui/               # Reusable UI primitives (Button, Card, etc.)
│   ├── layout/           # Header
│   ├── dashboard/        # Skill cards, grid, templates, empty state
│   ├── builder/          # Wizard steps + shell
│   └── shared/           # Markdown preview, import dialog
├── pages/                # Route pages (Dashboard, Create, Edit, Preview)
├── data/                 # Skill templates
└── hooks/                # useTheme
```

## Credits

Created by **Ariel Ortiz-Beltrán** ([ludthor](https://github.com/ludthor)) and powered by **Claude 4.6**.

## License

This work is licensed under a [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

You are free to share and adapt this material for any purpose, including commercially, as long as you give appropriate credit to the original author.
