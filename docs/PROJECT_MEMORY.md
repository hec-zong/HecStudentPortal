# Project Memory

Last updated: 2026-11-24

## Product

Name: Hec-e-Portal
Purpose: Enterprise Higher Education Commission Student & Administrative Portal providing unified student registration, degree attestation, scholarship management, and institutional reporting.
Primary users: Students, University Administrators, HEC Reviewers, and Staff.

## Current Stack

- Next.js with the App Router (Turbopack)
- React 19
- TypeScript (Strict Mode)
- Tailwind CSS
- ESLint + Prettier
- TanStack Query
- Zustand
- React Hook Form + Zod
- shadcn/ui
- Vitest + Playwright
- yarn
- Source code under `src/`

## Current Architecture

- Routes and layouts live under `src/app/`.
- Shared components live under `src/components/`.
- Feature-specific code lives under `src/features/`.
- Shared utilities live under `src/lib/`.
- Global client stores live under `src/store/`.
- No database is configured.
- No authentication system is configured.
- No external MCP server is configured.

## Current Conventions

- Server Components are the default.
- Client Components must have a clear browser-side reason.
- External input must be validated before use.
- Secrets remain server-side.
- The `@/*` alias maps to `src/*`.
- Significant changes must include appropriate validation.

## Current Status

### Completed

- Initial Next.js project setup (`Hec-e-Portal`)
- Cross-tool agent instructions (`AGENTS.md`, `opencode.jsonc`)
- Project documentation structure (`docs/`)
- Shared Agent Skills structure (`.agents/skills/`)
- Code quality automation (Prettier, ESLint, Husky, lint-staged)
- Component system (shadcn/ui with crisp HEC emerald/slate theme)
- State management (TanStack Query, Zustand)
- Form infrastructure (React Hook Form + Zod)
- Mock-first architecture & contracts (`src/types/portal.ts`, `src/lib/schemas.ts`, `src/services/portalService.ts`)
- Mock API Route Handlers (`/api/student/bootstrap`, `/api/synapark/form/[serviceId]`, `/api/synapark/applications`, `/api/synapark/applications/[id]/track`, `/api/pqr/universities`, `/api/billing/challan`)
- HEC E-Portal Landing Experience (`/`) with 4 action cards and demo role switcher
- 10-Step Attestation Journey Guide (`/journey`) with printable summary and confirmation gate
- Shared Portal Shell (`PortalShell.tsx`) with left sidebar, HEC branding, user summary, top bar notifications, and quick persona simulation
- Returning Student Dashboard (`/dashboard`) with KPI cards (Total Applications, HEC Wallet details with copyable ID), searchable applications table, quick feature cards (My Degree, Share Proof, Attestation Tracking), and bottom row (My Tasks with priority badges, Profile Status)
- My Degrees & Digital Assets Vault (`/assets`) with cryptographic verification hashes, PDF downloads, and uploaded documents repository
- Student Profile page (`/profile`) with NADRA citizen data, editable contact records, and PQR qualification linkage
- Settings & Security page (`/settings`) with multi-channel notification toggles (SMS, Email, WhatsApp), password management, and active session audit
- JSON-driven dynamic form wizard (`/apply/[serviceId]` and `/apply`) rendering steps, sections, fields, dynamic Zod validation rules, and inline document dropzones dynamically from Synapark JSON schemas (`synapark-attestation-form.json`) with pre-populated demo data across all 5 steps for client showcase, flexible step jump navigation, and automated `DEFAULT_DEMO_FORM_VALUES`
- Step 1 Personal Details with photo upload, CNIC Front & Back dropzones, OCR auto-fill hooks, and conditional disability certificate dropzones
- Step 2 Academic History connected to PQR Master Data (`pqrService`), cascading boards & universities, repeatable qualification cards, and inline parchment & transcript dropzones
- Step 3 Review & Degree Selection (`StepReviewAndDegreeSelection.tsx`) with Personal and Academic summary edit jumps, degree cards (14-Year, 16-Year, etc.) with document checkboxes (Degree, Transcript, Provisional, Equivalence), and sticky real-time E-Challan fee quote
- Step 4 E-Challan & 1-Link PSID Generation (`StepChallanGeneration.tsx`) with 17-digit PSID voucher, itemized statutory fee breakdown table, copyable PSID, payment channels, and 3-part bank voucher printable preview
- Step 5 Paid Challan Submission & Worker Portal Handoff (`StepPaidChallanSubmission.tsx`) with payment reference details, inline dropzone for paid receipt, PPC Section 468/471 solemn declaration, and automated transition into HEC Worker Portal scrutiny queue (`Submitted` -> `Scrutiny`)
- Dynamic Application Tracker confirmation banner on `/applications/[id]/track?submitted=true`
- Dedicated Application Tracking Portal (`/track` and `/track/[applicationId]`) featuring application selector with search & status filters (`ALL`, `IN PROCESS`, `RESUBMIT`, `COMPLETED`, `ARCHIVED`), 6-stage vertical verification timeline with worker portal reviewer handoff (`assignedWorker`), stage-wise comments & rejection trail, and interactive in-place document resubmission (`portalService.resubmitDocument`)
- Next.js Turbopack configuration with `@tailwindcss/turbopack` loader rules for seamless Tailwind CSS v4 institutional design token compilation
- Comprehensive test suite with 41 passing integration and unit tests across 7 test suites (100% passing)

### In Progress

- Backend endpoint integration readiness (zero UI refactoring required)

### Planned

- Live Synapark workflow engine connectivity
- Live PQR database integration
- Live 1-Link billing gateway webhooks

## Known Issues

None recorded.

## External Services

None configured.

## Active Decisions Needed

- Product scope
- Authentication requirements (NextAuth / Better Auth / Clerk)
- Data storage requirements (PostgreSQL / Neon / Prisma / Drizzle)
- Deployment environments (Vercel / AWS / Docker)
- Testing strategy beyond the initial baseline

## Maintenance

Update this file whenever the current state changes. Historical reasoning belongs in `DECISIONS.md`, not here.
