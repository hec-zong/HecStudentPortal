# Development Guide

## Requirements

- A currently supported Node.js version for the installed Next.js release
- yarn
- Git

Check the exact Node.js requirement in the installed Next.js documentation and `package.json`.

## Install

```bash
yarn install
```

## Start Development

```bash
yarn dev
```

Open the local URL printed by Next.js.

## Validation

```bash
yarn check
```

For a production build:

```bash
yarn build
```

## Environment Variables

Copy `.env.example` to `.env.local` only when variables are introduced.
Never commit `.env.local`.

## Agent Instructions

Coding agents must read `AGENTS.md` and `docs/PROJECT_MEMORY.md` before significant work.

## Project Skills

Canonical shared project skills are stored under `.agents/skills/`.

## Adding a Dependency

Before adding a production dependency:

1. Confirm the platform does not already provide the needed capability.
2. Check maintenance and security status.
3. Explain why the dependency is needed.
4. Install it with yarn.
5. Commit both `package.json` and `yarn.lock`.
6. Run validation.

## Adding an External Skill

1. Identify the exact source repository and skill.
2. Review `SKILL.md`, scripts, references, assets, and package files.
3. Install or copy it into `.agents/skills/`.
4. Record its source and revision in `docs/SKILLS.md`.
5. Review the complete Git diff.
6. Test the skill.
7. Commit the skill files.
8. Do not reinstall committed project skills during every `yarn install`.
