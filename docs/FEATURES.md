# Features

## Status Definitions

- Planned: Approved but not started
- In progress: Currently being implemented
- Complete: Implemented and validated
- Paused: Intentionally deferred
- Removed: No longer part of the product

## Foundation

### Application Shell

Status: Complete

Includes:

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint + Prettier
- shadcn/ui
- TanStack Query + Zustand
- React Hook Form + Zod
- Vitest + Playwright
- Cross-tool agent configuration

## Product Features

### HEC E-Portal Landing & Demo Role Switcher

Status: Complete
Routes: `/`
Components: `Navbar.tsx`, `Footer.tsx`, `AuthModal.tsx`, `TrackLookupModal.tsx`, `ShareProofModal.tsx`
Description: Public gateway with dark architectural hero, 4 primary action cards (Degree Attestation, Renewal, Track, Share Proof), trust metrics, and an interactive Demo Role Switcher to toggle between First-Time Student, Returning Student, and Logged-Out states.

### 10-Step Attestation Journey Guide

Status: Complete
Routes: `/journey`
Description: Interactive roadmap detailing the 10 sequential milestones from NADRA ID creation to Credential Vault storage, featuring prerequisite checklists, estimated turnaround times, and statutory acknowledgment gate.

### Returning Student Dashboard & Shared Portal Shell

Status: Complete
Routes: `/dashboard`
Components: `PortalShell.tsx`, `dashboard/page.tsx`
Description: Features an institutional left sidebar with HEC Attestation branding, navigation items, and bottom user summary card. Top bar provides welcome greeting, active notifications trigger, and demo persona switcher. Dashboard page delivers KPI cards (Total Applications & HEC-Wallet details with copy button), searchable My Applications table with quick action icons, Quick Feature cards row (My Degree, Share Proof, Attestation Tracking), and a bottom row displaying prioritized tasks (`HIGH PRIORITY`, `MEDIUM`) and Profile Status with completion progress bar.

### My Degrees & Digital Assets Vault

Status: Complete
Routes: `/assets`
Components: `assets/page.tsx`
Description: Central repository displaying forensically attested degrees with serial numbers, QR verification codes, and cryptographic verification hashes, along with an uploaded documents repository (NADRA CNIC front/back, Matric and Intermediate Sanads, BS Degree & Transcript scans) with encrypted download actions.

### Student Profile & Account Settings

Status: Complete
Routes: `/profile`, `/settings`
Components: `profile/page.tsx`, `settings/page.tsx`
Description: `/profile` allows students to review NADRA-verified identification, update contact and postal addresses, and inspect PQR qualification records. `/settings` enables toggling communication preferences (SMS alerts, Email invoices, WhatsApp courier updates), changing passwords, and monitoring active device sessions.

### JSON-Driven Dynamic Form Wizard & PQR Academic Register

Status: Complete
Routes: `/apply`, `/apply/[serviceId]`
Components: `DynamicFormWizard.tsx`, `StepPersonalDetails.tsx`, `StepAcademicHistory.tsx`, `StepReviewAndDegreeSelection.tsx`, `StepChallanGeneration.tsx`, `StepPaidChallanSubmission.tsx`, `InlineFileDropzone.tsx`, `DynamicFieldRenderer.tsx`
Services: `pqrService.ts`, `portalService.ts`
Description: Complete JSON-driven 5-step form wizard rendered dynamically from Synapark schema specifications (`synapark-attestation-form.json`). Features top horizontal milestone indicator, sticky left vertical application sidebar with Dossier ID, step progress %, and Save Draft button with timestamp feedback. Compiles JSON field rules into dynamic Zod schemas with conditional field visibility. Step 1 handles personal information with inline CNIC front/back dropzones and OCR auto-fill hooks. Step 2 integrates with the Pakistan Qualification Register (PQR) for accredited universities, degree levels, programs, and examination boards, supporting repeatable degree cards with inline degree parchment and transcript dropzones. Step 3 provides a review summary with quick jump/edit links, degree cards with document checkboxes (Degree, Transcript, Provisional, Equivalence), and a sticky real-time E-Challan fee quote. Step 4 generates official itemized 1-Link 17-digit PSID fee vouchers with fee breakdown tables and a 3-part bank voucher printable preview. Step 5 records transaction proof, provides an inline dropzone for paid challan receipts, enforces PPC Section 468/471 solemn declarations, and transitions the dossier directly into the HEC Worker Portal scrutiny queue (`Submitted` -> `Scrutiny`) with instant redirection to the tracker confirmation banner.

### Dynamic Application Tracking & Comments / Rejection Trail

Status: Complete
Routes: `/track`, `/track/[applicationId]`, `/applications/[id]/track`
Components: `ApplicationTrackerView.tsx`, `track/page.tsx`, `track/[applicationId]/page.tsx`, `applications/[id]/track/page.tsx`, `InlineFileDropzone.tsx`
Services: `portalService.ts` (`getApplications`, `getApplicationTrack`, `resubmitDocument`)
Description: Comprehensive tracking center matching the HEC Worker Portal timeline layout. Features an interactive Application Selector with search and status filter tabs (`ALL`, `IN PROCESS`, `RESUBMIT`, `COMPLETED`, `ARCHIVED`), collapsible application cards with submission dates and status pills, and deep-linkable views (`/track/[applicationId]`). Displays a 6-stage vertical verification timeline (`Submitted & Logged`, `Preliminary Scrutiny & NADRA Check`, `L1 Controller Review`, `L2 Controller Endorsement`, `Physical Embossing & QR Affixing`, and `Courier Dispatch / Minted`) with status pills (`COMPLETED`, `PAID / SUBMITTED`, `MINTED`, `IN PROGRESS`, `REJECTED / RESUBMIT`, `PENDING`), completed and started timestamps, and assigned worker cards (`name`, `role`, `department`). Stage-Wise Comments & Rejection Trail renders official reviewer remarks, rejection reasons, and highlighted defect notices from the HEC Worker Portal. When marked for resubmission (`isReuploadAllowed`), provides an interactive in-place document re-upload dropzone (`InlineFileDropzone`) with student explanation textarea and dynamic resolution via `portalService.resubmitDocument(...)`, automatically returning the stage to `in_progress`. Displays attached degree qualifications summary and 1-Link PSID fee settlement record.
