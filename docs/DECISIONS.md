# Architecture Decisions

This file is an append-only record of significant project decisions.
Do not rewrite old decisions to match the current state. Add a new decision that supersedes the old one.

## 2026-11-24: Use Next.js App Router with a `src` directory

### Status

Accepted

### Context

The project needs a modern Next.js structure that separates application source code from repository configuration and documentation.

### Decision

Use the latest stable Next.js release available through `create-next-app`.
Use the App Router.
Store application code under `src/`.
Use TypeScript, Tailwind CSS, ESLint, and the `@/*` import alias.

### Consequences

Routes are created under `src/app/`.
Repository-level agent configuration, documentation, and scripts remain outside `src/`.
The Pages Router is not used.

## 2026-11-24: Use OpenCode for agentic development

### Status

Accepted

### Context

The project will be developed using OpenCode with a focus on repository-based agent instructions.

### Decision

Use `AGENTS.md` and files under `docs/` as the shared source of truth.
Use OpenCode-specific configuration in `opencode.jsonc`.
Store canonical shared skills under `.agents/skills/`.

### Consequences

Shared knowledge is not duplicated across every tool configuration.
Tool-specific syntax remains isolated.
Project instructions and skills are committed to Git.
Personal preferences and credentials remain outside the repository.
