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
- Component system (shadcn/ui modernized with CEGA-inspired institutional design system)
- State management (TanStack Query, Zustand)
- Form infrastructure (React Hook Form + Zod)
- Mock-first architecture & contracts (`src/types/portal.ts`, `src/lib/schemas.ts`, `src/services/portalService.ts`)
- Mock API Route Handlers (`/api/student/bootstrap`, `/api/synapark/form/[serviceId]`, `/api/synapark/applications`, `/api/synapark/applications/[id]/track`, `/api/pqr/universities`, `/api/billing/challan`)
- CEGA-inspired design system rollout across all 16 application routes and components:
  - Typography: Google Font `Orbitron` (weights 600, 700, 900) attached to `--font-heading` for all `h1`-`h4` and headings, paired with clean `ui-sans-serif` for body copy, data tables, and input fields
  - Color Tokens: Primary canvas `#ffffff`, secondary accents `#87cbde` / `#27b2d7`, primary brand action `#13c2b6` with high-contrast `#000000` text (8.2:1 contrast ratio, WCAG AAA), secondary text `#666666`, borders `#e5e5e5`
  - Spacing & Shapes: 12px base layout grid (`gap-3`, `gap-6`, `p-6`, etc.), `rounded-2xl` containers/cards, `rounded-[12px]` buttons, min touch targets >= 44x44px for mobile
  - Shadows: Soft chromatic tinted shadows `0 10px 28px rgba(8, 27, 88, 0.08)` and `0 12px 30px rgba(8, 27, 88, 0.08)` replacing dark backgrounds
- HEC E-Portal Landing Experience (`/`) with 4 action cards and demo role switcher
- 10-Step Attestation Journey Guide (`/journey`) with printable summary and confirmation gate
- Shared Portal Shell (`PortalShell.tsx`) with left sidebar, HEC branding, user summary, top bar notifications, and quick persona simulation
- Returning Student Dashboard (`/dashboard`) with light-theme KPI cards (Total Applications, HEC Wallet details with copyable ID), searchable applications table, quick feature cards (My Degree, Share Proof, Attestation Tracking), and bottom row (My Tasks with priority badges, Profile Status)
- My Degrees & Digital Assets Vault (`/assets`) with cryptographic verification hashes, PDF downloads, and uploaded documents repository
- Student Profile page (`/profile`) with NADRA citizen data, editable contact records, and PQR qualification linkage
- Settings & Security page (`/settings`) with multi-channel notification toggles (SMS, Email, WhatsApp), password management, and active session audit
- JSON-driven dynamic form wizard (`/apply/[serviceId]` and `/apply`) rendering steps, sections, fields, dynamic Zod validation rules, and inline document dropzones dynamically from Synapark JSON schemas (`synapark-attestation-form.json`) with pre-populated demo data across all 5 steps for client showcase, flexible step jump navigation, and automated `DEFAULT_DEMO_FORM_VALUES`
- Step 1 Personal Details with photo upload, CNIC Front & Back dropzones, OCR auto-fill hooks, and conditional disability certificate dropzones
- Step 2 Academic History connected to PQR Master Data (`pqrService`), cascading boards & universities, repeatable qualification cards, and inline parchment & transcript dropzones
- Step 3 Review & Degree Selection (`StepReviewAndDegreeSelection.tsx`) with Personal and Academic summary edit jumps, degree cards (14-Year, 16-Year, etc.) with document checkboxes (Degree, Transcript, Provisional, Equivalence), and sticky real-time E-Challan fee quote
- Step 4 E-Challan & 1-Link PSID Generation (`StepChallanGeneration.tsx`) with 17-digit PSID voucher, itemized statutory fee breakdown table, copyable PSID, payment channels, and 3-part bank voucher printable preview
- Step 5 Paid Challan Submission & Worker Portal Handoff (`StepPaidChallanSubmission.tsx`) with payment reference details, inline dropzone for paid receipt, PPC Section 468/471 solemn declaration, and automated transition into HEC Worker Portal scrutiny queue (`Submitted` -> `Scrutiny`)
- Prevented React maximum update depth loops by wrapping form change handlers in `React.useCallback` with value equality guards in `DynamicFormWizard.tsx` and eliminating redundant sync effects in `StepPaidChallanSubmission.tsx`
- Minimizable Navigation Bars:
  - Added desktop sidebar collapse/minimize in `PortalShell.tsx` between full width (`lg:w-64`) and compact icon-only mode (`lg:w-20`) with tooltips and toggle controls (`PanelLeftClose`/`PanelLeftOpen`) in both the sidebar and top bar
  - Added collapsible mobile navigation drawer in `Navbar.tsx` with hamburger toggle (`Menu`/`X`) and mobile persona switcher
- Seamless post-submission redirection to student dashboard (`/dashboard?submitted=true&appId=...`) with an eye-catching CEGA-styled scrutiny queue confirmation banner in `src/app/dashboard/page.tsx`
- Dynamic Application Tracker confirmation banner on `/applications/[id]/track?submitted=true`
- Dedicated Application Tracking Portal (`/track` and `/track/[applicationId]`) featuring application selector with search & status filters (`ALL`, `IN PROCESS`, `RESUBMIT`, `COMPLETED`, `ARCHIVED`), 6-stage vertical verification timeline with worker portal reviewer handoff (`assignedWorker`), stage-wise comments & rejection trail, and interactive in-place document resubmission (`portalService.resubmitDocument`)
- Next.js Turbopack configuration with `@tailwindcss/turbopack` loader rules for seamless Tailwind CSS v4 institutional design token compilation
- Comprehensive test suite with 42 passing integration and unit tests across 7 test suites (100% passing)

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
