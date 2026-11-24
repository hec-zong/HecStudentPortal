---
name: review-nextjs-change
description: Review a Next.js code change for correctness, security, server and client boundaries, performance, accessibility, maintainability, and test coverage. Use for pull request reviews or pre-commit reviews.
---

# Review a Next.js Change

Review the requested diff or files.

Prioritize findings in this order:

1. Security vulnerabilities
2. Data loss or correctness problems
3. Authentication and authorization failures
4. Server and client boundary violations
5. Broken routing, caching, or rendering behavior
6. Missing input validation
7. Performance regressions
8. Accessibility problems
9. Maintainability problems
10. Missing or weak tests

For each finding:

1. State the severity.
2. Name the affected file and relevant code location.
3. Explain the concrete impact.
4. Provide a practical fix.
5. Avoid speculative findings without evidence.

Check whether documentation must be updated.

Run relevant validation when permitted.

Finish with a concise summary of findings and executed checks.
