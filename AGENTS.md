<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Instructions

## Project Overview

This is a Next.js application built with the App Router, TypeScript, Tailwind CSS, and source code under `src/`.

The repository is designed for agentic development with OpenCode. All shared knowledge lives in committed files, not conversation history.

Before making a significant change, read:

1. `docs/PROJECT_MEMORY.md`
2. `docs/ARCHITECTURE.md`
3. `docs/DECISIONS.md`
4. `docs/FEATURES.md`
5. Any relevant skill under `.agents/skills/`

## Source of Truth

| File                     | Purpose                                         |
| ------------------------ | ----------------------------------------------- |
| `AGENTS.md`              | Durable project rules for coding agents         |
| `docs/PROJECT_MEMORY.md` | Current project state, conventions, active work |
| `docs/ARCHITECTURE.md`   | Current system architecture                     |
| `docs/DECISIONS.md`      | Historical architectural decisions              |
| `docs/FEATURES.md`       | Feature inventory and status                    |
| `docs/DEVELOPMENT.md`    | Local setup and development workflow            |
| `docs/MCP.md`            | MCP server inventory and setup guidance         |
| `docs/SKILLS.md`         | Installed skill inventory and provenance        |
| `.agents/skills/`        | Canonical project-specific reusable workflows   |

Do not repeat detailed information across multiple files. Link to the source of truth instead.

## Application Structure

- `src/app/`: Routes, layouts, route handlers, loading states, error boundaries
- `src/components/`: Shared React components
- `src/components/ui/`: Reusable low-level UI components (shadcn/ui)
- `src/features/`: Feature-specific components, actions, schemas, and services
- `src/hooks/`: Shared React hooks
- `src/lib/`: Framework-independent utilities and server-side infrastructure
- `src/store/`: Zustand client state stores
- `src/types/`: Shared TypeScript types
- `src/config/`: Typed application configuration
- `tests/`: Tests that do not belong beside a specific module
- `docs/`: Project knowledge and decisions

## Next.js Rules

- Use the App Router only. Never use the Pages Router.
- Prefer Server Components by default.
- Add `"use client"` only when client state, effects, event handlers, or browser APIs are required.
- Keep client component boundaries as small as practical.
- Do not access databases, private services, or secrets from Client Components.
- Use Route Handlers for APIs and Server Actions for mutations when appropriate.
- Validate all untrusted input at the application boundary.
- Handle loading, empty, error, and unauthorized states where relevant.
- Use Next.js metadata APIs for page metadata.
- Use `next/image` for application images when appropriate.
- Use `next/link` for internal navigation.
- Do not introduce caching or revalidation behavior without documenting the intended semantics.

## TypeScript Rules

- Keep strict TypeScript enabled.
- Do not use `any` unless there is a documented and unavoidable reason.
- Prefer explicit domain types at system boundaries.
- Avoid unsafe type assertions.
- Validate external data before treating it as a trusted TypeScript type.
- Use the `@/*` alias for imports from `src/`.

## Code Quality Rules

- Keep components and functions focused.
- Keep business logic outside presentation components.
- Prefer clear names over comments that restate the code.
- Remove dead code instead of commenting it out.
- Do not add a production dependency without explaining its purpose.
- Follow existing project conventions before introducing new patterns.
- Make the smallest coherent change that fully solves the task.
- Do not modify unrelated files.

## Security Rules

- Never commit credentials or secrets.
- Never expose server-only environment variables to the browser.
- Variables intended for the browser must use the `NEXT_PUBLIC_` prefix and contain no secrets.
- Treat external input, URL parameters, headers, cookies, form data, webhook data, and API responses as untrusted.
- Check authentication and authorization separately when protected functionality is introduced.
- Do not log credentials, tokens, private user data, or full sensitive payloads.

## Documentation Rules

- Update `docs/PROJECT_MEMORY.md` when conventions, integrations, active work, known issues, or project status change.
- Update `docs/ARCHITECTURE.md` when system boundaries, data flow, infrastructure, or major components change.
- Add an entry to `docs/DECISIONS.md` when making a significant architectural or technology decision.
- Update `docs/FEATURES.md` when a feature is added or its status changes.
- Update `docs/MCP.md` when an MCP server is added, removed, or changed.
- Update `docs/SKILLS.md` when a project skill is added, removed, updated, or locally modified.

## Validation

Before declaring work complete, run the checks relevant to the change.

The standard full validation command is:

```bash
yarn check
```

For a major change, also run:

```bash
yarn build
```

Do not claim a check passed unless it was actually executed successfully.
If a check cannot be executed, state exactly which check was skipped and why.

## Git Behavior

- Do not commit automatically unless explicitly requested.
- Do not rewrite Git history.
- Do not discard user changes.
- Review downloaded skills and executable scripts before using them.
- Keep project skills committed to Git.
- Keep personal global skills outside this repository.
