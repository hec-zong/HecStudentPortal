---
name: create-nextjs-feature
description: Create or extend a feature in this Next.js App Router project. Use when adding routes, UI, server actions, route handlers, validation, feature services, or tests. Do not use for a tiny isolated typo fix.
---

# Create a Next.js Feature

1. Read `AGENTS.md`.
2. Read `docs/PROJECT_MEMORY.md`.
3. Read `docs/ARCHITECTURE.md`.
4. Inspect similar existing features before choosing a structure.
5. Define the feature boundary, routes, data flow, trust boundaries, and validation needs.
6. Prefer Server Components.
7. Introduce Client Components only where browser-side behavior is required.
8. Keep business logic outside presentation components.
9. Validate untrusted input at the boundary.
10. Add authentication and authorization checks when the feature requires them.
11. Implement loading, empty, error, and unauthorized states where applicable.
12. Add focused tests appropriate to the change.
13. Run `yarn check`.
14. Run `yarn build` for significant routing, rendering, configuration, or dependency changes.
15. Update the relevant project documentation.
16. Summarize changed files, design decisions, and validation results.
