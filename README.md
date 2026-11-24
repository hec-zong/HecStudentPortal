# Hec-e-Portal

Enterprise Higher Education Commission (HEC) Student & Administrative Portal built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.

## Current Stack

- Next.js 16 (App Router + Turbopack)
- React 19
- TypeScript (Strict Mode)
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form + Zod
- Vitest + Playwright
- ESLint + Prettier + Husky

## Requirements

- Node.js 20+
- yarn
- Git

## Installation

```bash
yarn install
```

## Development

```bash
yarn dev
```

Open the local URL printed by Next.js (default: [http://localhost:3000](http://localhost:3000)).

## Validation

```bash
yarn run check
```

## Production Build

```bash
yarn build
```

## Directory Overview

| Directory            | Purpose                                                 |
| -------------------- | ------------------------------------------------------- |
| `src/app/`           | Routes, layouts, error boundaries, health API           |
| `src/components/`    | Shared React components and global providers            |
| `src/components/ui/` | shadcn/ui primitives                                    |
| `src/features/`      | Feature-specific domain code                            |
| `src/lib/`           | Utilities, API client, query client, logger, form utils |
| `src/store/`         | Zustand client state stores                             |
| `src/config/`        | Typed application configuration                         |
| `tests/`             | Unit, integration, and E2E tests                        |
| `docs/`              | Project knowledge, architecture, decisions, and memory  |
| `.agents/skills/`    | Canonical agent skills                                  |

## Agentic Development

This project is configured for OpenCode agentic coding.

- `AGENTS.md` — Primary instruction file for all coding agents
- `opencode.jsonc` — OpenCode configuration
- `.agents/skills/` — Reusable agent workflows (committed to Git)
- `docs/` — Project memory, architecture, and decisions

Project skills are committed to Git and are not reinstalled by `yarn install`.

## Security

Secrets belong in `.env.local` or the deployment environment and must not be committed.
See `.env.example` for documented variable names.

## Documentation

- [Project Memory](docs/PROJECT_MEMORY.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Decisions](docs/DECISIONS.md)
- [Features](docs/FEATURES.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [MCP Setup](docs/MCP.md)
- [Skills](docs/SKILLS.md)
