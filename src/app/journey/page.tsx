'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Compass,
  UserCheck,
  GraduationCap,
  FileUp,
  CreditCard,
  Building2,
  Search,
  ShieldCheck,
  Lock,
  Share2,
  Truck,
  CheckCircle2,
  ArrowRight,
  Printer,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/modals/AuthModal';
import { useAppStore } from '@/store/use-app-store';

interface JourneyStep {
  number: number;
  title: string;
  stageName: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  requirements: string[];
  turnaroundTime: string;
  actor: string;
  badge: {
    label: string;
    variant:
      | 'default'
      | 'secondary'
      | 'outline'
      | 'approved'
      | 'inProgress'
      | 'resubmit'
      | 'archived';
  };
}

const journeySteps: JourneyStep[] = [
  {
    number: 1,
    title: 'Identity Creation',
    stageName: 'Prerequisite & Registration',
    icon: UserCheck,
    description:
      'Register on HEC E-Portal with your 13-digit National CNIC / NICOP or Passport number. Biometric details and full name are matched against official identity registers.',
    requirements: [
      'Valid CNIC Front & Back scan (Color, max 5MB)',
      'Active Email & Mobile Number',
      'Domicile Province & District',
    ],
    turnaroundTime: '5 - 10 Minutes',
    actor: 'Student (Self)',
    badge: { label: 'Step 1: Identity', variant: 'outline' },
  },
  {
    number: 2,
    title: 'Academic Profile',
    stageName: 'Educational Lineage Linkage',
    icon: GraduationCap,
    description:
      'Enter your educational lineage in chronological sequence (SSC/Matric -> HSSC/Inter -> Bachelor -> Master -> PhD). Every degree title must match your official transcript.',
    requirements: [
      'Registration & Roll Numbers',
      'Year of Passing & CGPA / Marks',
      'Accredited Awarding Institution Name',
    ],
    turnaroundTime: '15 Minutes',
    actor: 'Student (Self)',
    badge: { label: 'Step 2: Lineage', variant: 'outline' },
  },
  {
    number: 3,
    title: 'Document Upload',
    stageName: 'High-Resolution Scan Ingestion',
    icon: FileUp,
    description:
      'Upload high-resolution color scans (300-600 DPI) of both front and back sides of original degrees, transcripts, and mark sheets. Ensure the Controller signature is sharp.',
    requirements: [
      'Original Degree Scan (PDF/JPG)',
      'Full Official Transcript with Grading Key',
      'Disability Accommodations Scan (if applicable)',
    ],
    turnaroundTime: '10 Minutes',
    actor: 'Student (Self)',
    badge: { label: 'Step 3: Documents', variant: 'outline' },
  },
  {
    number: 4,
    title: 'Fee Settlement',
    stageName: '1-Link PSID & Payment Generation',
    icon: CreditCard,
    description:
      'An automated 17-digit 1-Link PSID challan is calculated based on document count. Settle instantly via Mobile Banking App, ATM, Kuickpay, or Bank Counter.',
    requirements: [
      'PKR 1,000 per Original Degree/Transcript',
      'PKR 700 per Photocopy',
      'Upload stamped challan / transaction screenshot',
    ],
    turnaroundTime: 'Instant to 24 Hours',
    actor: 'Student & 1-Link System',
    badge: { label: 'Step 4: Billing', variant: 'inProgress' },
  },
  {
    number: 5,
    title: 'Registrar Audit',
    stageName: 'PQR Database Cross-Reference',
    icon: Building2,
    description:
      'HEC systems cross-check your degree program and admission year against the official Pakistan Qualification Register (PQR) and professional council accreditation (PEC, PMDC, NBEAC).',
    requirements: [
      'Accredited Program Status in PQR',
      'Approved Intake Batch',
      'University Recognized Charter',
    ],
    turnaroundTime: '1 - 2 Business Days',
    actor: 'HEC PQR Engine',
    badge: { label: 'Step 5: PQR Check', variant: 'outline' },
  },
  {
    number: 6,
    title: 'Physical Appraisal',
    stageName: 'Desk Scrutiny & L1 Controller',
    icon: Search,
    description:
      'An assigned HEC Scrutiny Officer and Assistant Director (L1 Controller) conduct forensic scrutiny of transcripts, security watermarks, and grading scales.',
    requirements: [
      'Legible Controller of Examinations Signature',
      'Clear Institutional Seal',
      'No Unapproved Corrections',
    ],
    turnaroundTime: '2 - 3 Business Days',
    actor: 'HEC Scrutiny Desk & L1 Controller',
    badge: { label: 'Step 6: Scrutiny', variant: 'inProgress' },
  },
  {
    number: 7,
    title: 'Digital Embossing',
    stageName: 'L2 Controller Executive Concurrence',
    icon: ShieldCheck,
    description:
      'Executive concurrence by the Deputy Director (L2 Controller). A unique holographic barcode serial and cryptographic QR verification seal are authorized.',
    requirements: [
      'Executive Officer Sign-off',
      'Holographic Barcode Serial Number Generated',
    ],
    turnaroundTime: '1 Business Day',
    actor: 'L2 Controller (Deputy Director)',
    badge: { label: 'Step 7: Authorization', variant: 'approved' },
  },
  {
    number: 8,
    title: 'Vault Storage',
    stageName: 'HEC Digital Wallet Minting',
    icon: Lock,
    description:
      'The attested credential is permanently minted into your personal HEC Digital Wallet with an immutable SHA-256 verification hash, accessible anytime.',
    requirements: [
      'Permanent Digital Archive Record',
      'Zero Risk of Certificate Loss or Degradation',
    ],
    turnaroundTime: 'Instant upon L2 Approval',
    actor: 'HEC Digital Vault',
    badge: { label: 'Step 8: Digital Vault', variant: 'approved' },
  },
  {
    number: 9,
    title: 'Credential Sharing',
    stageName: 'Public Verification Link & QR',
    icon: Share2,
    description:
      'Generate instant, tamper-proof verification links and QR badges that allow foreign embassies, WES, immigration bodies, and employers to confirm authenticity.',
    requirements: [
      'Direct Link Sharing',
      'Instant Global Verification without Physical Mail',
    ],
    turnaroundTime: 'Immediate Access',
    actor: 'Student & Verified Third Parties',
    badge: { label: 'Step 9: Sharing', variant: 'approved' },
  },
  {
    number: 10,
    title: 'Journey Completion',
    stageName: 'Courier Dispatch or Counter Pickup',
    icon: Truck,
    description:
      'Physical attested documents with affixed holographic stickers and stamps are sealed in tamper-evident envelopes and dispatched via Leopard/TCS to your doorstep.',
    requirements: [
      'Courier Tracking Number (SMS/Email)',
      'CNIC Verification on Delivery',
    ],
    turnaroundTime: '2 - 4 Business Days',
    actor: 'Authorized Courier / Regional Counter',
    badge: { label: 'Step 10: Complete', variant: 'approved' },
  },
];

export default function AttestationJourneyPage() {
  const router = useRouter();
  const {
    authStatus,
    setActiveModal,
    journeyAgreementAccepted,
    setJourneyAgreementAccepted,
    getSmartRoute,
  } = useAppStore();

  const [activeStep, setActiveStep] = React.useState<number>(1);

  const handleProceed = () => {
    if (authStatus === 'logged_out') {
      setActiveModal('login');
    } else {
      router.push(getSmartRoute());
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col antialiased">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-primary border-primary/30 text-xs font-semibold"
              >
                Official Verification Roadmap
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Synapark Engine v2.4
              </Badge>
            </div>

            <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              The Attestation Journey.
            </h1>

            <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
              A transparent, 10-step institutional pathway from initial identity
              onboarding and PQR accreditation to forensic scrutiny, digital QR
              embossing, and tracked dispatch.
            </p>
          </div>

          {/* Quick Summary Strip */}
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[#e5e5e5] bg-[#f6fbfe] p-6 shadow-[0_10px_28px_rgba(8,27,88,0.06)] sm:grid-cols-4">
            <div className="space-y-1">
              <span className="block text-xs font-medium text-[#666666]">
                Total Journey Steps
              </span>
              <span className="font-heading text-2xl font-bold text-black">
                10 Milestones
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-xs font-medium text-[#666666]">
                Average Processing
              </span>
              <span className="font-heading text-2xl font-bold text-[#13c2b6]">
                5 - 7 Days
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-xs font-medium text-[#666666]">
                Payment Channel
              </span>
              <span className="font-heading text-2xl font-bold text-black">
                1-Link 17-Digit PSID
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-xs font-medium text-[#666666]">
                Credential Output
              </span>
              <span className="font-heading text-2xl font-bold text-black">
                Physical + Digital QR
              </span>
            </div>
          </div>

          {/* 10-Step Interactive Timeline Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-black">
                <Compass className="size-5 text-[#13c2b6]" />
                <span>Roadmap Milestones</span>
              </h2>
              <span className="font-mono text-xs text-[#666666]">
                Click any step to inspect forensic requirements
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
              {journeySteps.map((step) => {
                const IconComponent = step.icon;
                const isSelected = activeStep === step.number;

                return (
                  <Card
                    key={step.number}
                    onClick={() => setActiveStep(step.number)}
                    className={`cursor-pointer rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? 'border-[#13c2b6] bg-white shadow-[0_10px_28px_rgba(8,27,88,0.1)] ring-2 ring-[#13c2b6]/25'
                        : 'border-[#e5e5e5] bg-white hover:border-[#87cbde] hover:shadow-[0_10px_28px_rgba(8,27,88,0.06)]'
                    }`}
                  >
                    <CardHeader className="space-y-2 p-6 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex size-10 items-center justify-center rounded-xl transition-colors ${
                              isSelected
                                ? 'bg-[#13c2b6] font-bold text-black'
                                : 'border border-[#e5e5e5] bg-[#f6fbfe] text-[#27b2d7]'
                            }`}
                          >
                            <IconComponent className="size-5" />
                          </div>
                          <div>
                            <span className="mb-1 block font-mono text-xs leading-none font-semibold text-[#27b2d7]">
                              STEP {step.number.toString().padStart(2, '0')}
                            </span>
                            <CardTitle className="text-base font-bold text-black">
                              {step.title}
                            </CardTitle>
                          </div>
                        </div>
                        <Badge
                          variant={step.badge.variant}
                          className="text-[10px]"
                        >
                          {step.badge.label}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs leading-normal text-[#666666]">
                        {step.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3 p-6 pt-0 text-xs">
                      {/* Requirements List */}
                      <div className="space-y-1.5 rounded-xl border border-[#e5e5e5] bg-[#f6fbfe] p-3">
                        <span className="block text-[11px] font-semibold text-black">
                          Key Prerequisites:
                        </span>
                        <ul className="space-y-1">
                          {step.requirements.map((req, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-1.5 text-[#666666]"
                            >
                              <CheckCircle2 className="size-3.5 shrink-0 text-[#13c2b6]" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#e5e5e5] pt-2 text-[11px] text-[#666666]">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5 text-[#27b2d7]" />
                          <span>Turnaround: {step.turnaroundTime}</span>
                        </span>
                        <span className="font-medium text-black">
                          Actor: {step.actor}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Confirmation Checkbox & Actions Box */}
          <div className="space-y-6 rounded-2xl border border-[#e5e5e5] bg-[#f6fbfe] p-6 shadow-[0_10px_28px_rgba(8,27,88,0.06)] sm:p-8">
            <div className="flex items-start gap-3.5">
              <div className="pt-0.5">
                <Checkbox
                  id="journey-confirmation"
                  checked={journeyAgreementAccepted}
                  onCheckedChange={(checked) =>
                    setJourneyAgreementAccepted(Boolean(checked))
                  }
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="journey-confirmation"
                  className="block cursor-pointer text-sm leading-snug font-semibold text-black select-none"
                >
                  I confirm that I have reviewed the attestation roadmap,
                  document prerequisites, and legal requirements under the
                  Higher Education Commission Ordinance.
                </label>
                <p className="text-xs leading-normal text-[#666666]">
                  Submitting forged or tampered academic documents is a
                  non-bailable offense under Sections 468 & 471 of the Pakistan
                  Penal Code (PPC), resulting in permanent blacklisting and
                  legal prosecution.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e5e5e5] pt-4">
              <div className="flex items-center gap-2 text-xs text-[#666666]">
                <ShieldCheck className="size-4 text-[#13c2b6]" />
                <span>HEC Synapark Scrutiny Compliance Verified</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrint}
                  className="h-10 gap-2 border-[#e5e5e5] bg-white text-xs font-semibold text-black hover:border-[#27b2d7] hover:bg-[#f6fbfe]"
                >
                  <Printer className="size-4 text-[#666666]" />
                  <span>Download Guide PDF / Print</span>
                </Button>

                <Button
                  type="button"
                  size="default"
                  disabled={!journeyAgreementAccepted}
                  onClick={handleProceed}
                  className="h-10 cursor-pointer gap-2 bg-[#13c2b6] text-xs font-bold text-black shadow-[0_10px_28px_rgba(8,27,88,0.08)] hover:bg-[#27b2d7] disabled:opacity-50 sm:text-sm"
                >
                  <span>Proceed to Application</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}
