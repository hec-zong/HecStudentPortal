'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileCheck,
  RefreshCw,
  Search,
  Share2,
  ArrowRight,
  Compass,
  CheckCircle2,
  Clock,
  Building2,
  Lock,
  QrCode,
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/modals/AuthModal';
import { TrackLookupModal } from '@/components/modals/TrackLookupModal';
import { ShareProofModal } from '@/components/modals/ShareProofModal';
import { useAppStore } from '@/store/use-app-store';
import { cn } from 'cn';

export default function LandingPage() {
  const router = useRouter();
  const { authStatus, setActiveModal, getSmartRoute } = useAppStore();

  const handleStartAttestation = () => {
    if (authStatus === 'logged_out') {
      setActiveModal('login');
    } else {
      router.push(getSmartRoute());
    }
  };

  const handleRenewal = () => {
    if (authStatus === 'logged_out') {
      setActiveModal('login');
    } else {
      router.push('/apply?service=renewal');
    }
  };

  return (
    <div className="bg-background text-foreground selection:bg-primary/20 selection:text-primary flex min-h-screen flex-col antialiased">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section with CEGA Light Canvas Backdrop */}
      <section className="relative overflow-hidden border-b border-[#e5e5e5] bg-white text-black">
        {/* Subtle CEGA Chromatic Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(135,203,222,0.22),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e525_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e525_1px,transparent_1px)] bg-[size:3rem_3rem]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#87cbde] bg-[#f6fbfe] px-3.5 py-1 text-xs font-semibold text-black shadow-xs">
              <span className="size-2 animate-pulse rounded-full bg-[#13c2b6]" />
              <span>Higher Education Commission of Pakistan</span>
            </div>

            <h1 className="font-heading text-4xl leading-[1.15] font-bold tracking-tight text-black sm:text-5xl lg:text-6xl">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-[#13c2b6] via-[#27b2d7] to-[#13c2b6] bg-clip-text text-transparent">
                HEC E-Portal
              </span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-[#666666] sm:text-lg">
              The unified national gateway for Pakistani university degrees,
              transcripts, and diplomas. Backed by the{' '}
              <strong className="text-black">Synapark Workflow Engine</strong>,
              Pakistan Qualification Register (PQR), and automated{' '}
              <strong className="text-black">1-Link 17-digit PSID</strong>{' '}
              challan settlements.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                size="lg"
                onClick={handleStartAttestation}
                className="h-12 cursor-pointer gap-2 rounded-[12px] bg-[#13c2b6] px-6 text-sm font-bold text-black shadow-[0_4px_16px_rgba(19,194,182,0.28)] hover:bg-[#27b2d7] sm:text-base"
              >
                <span>Start Degree Attestation</span>
                <ArrowRight className="size-4" />
              </Button>

              <Link
                href="/journey"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'inline-flex h-12 items-center gap-2 rounded-[12px] border-[#e5e5e5] bg-white px-6 text-sm font-semibold text-black shadow-xs hover:border-[#27b2d7] hover:bg-[#f6fbfe] sm:text-base'
                )}
              >
                <Compass className="size-4 text-[#13c2b6]" />
                <span>View 10-Step Journey</span>
              </Link>
            </div>
          </div>

          {/* 4 Primary Action Cards Grid */}
          <div
            id="services"
            className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Card 1: Degree Attestation */}
            <Card
              role="button"
              tabIndex={0}
              onClick={handleStartAttestation}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStartAttestation();
                }
              }}
              className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_28px_rgba(8,27,88,0.08)] transition-all duration-300 select-none hover:-translate-y-1 hover:border-[#13c2b6] hover:shadow-[0_16px_36px_rgba(8,27,88,0.14)] focus-visible:outline-2 focus-visible:outline-[#13c2b6]"
            >
              <CardHeader className="space-y-3 p-0 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-[12px] bg-[#13c2b6]/15 text-[#13c2b6] transition-transform group-hover:scale-110">
                    <FileCheck className="size-6 text-[#13c2b6]" />
                  </div>
                  <Badge variant="approved" className="text-[10px]">
                    Primary Service
                  </Badge>
                </div>
                <div>
                  <CardTitle className="font-heading text-lg font-bold text-black transition-colors group-hover:text-[#13c2b6]">
                    Degree Attestation
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs leading-normal text-[#666666]">
                    Original Degrees, Detailed Marks Certificates (DMCs), and
                    Transcripts with security QR seal.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 p-0 pt-2 text-xs text-[#666666]">
                <div className="flex items-center gap-1.5 text-black">
                  <CheckCircle2 className="size-3.5 shrink-0 text-[#13c2b6]" />
                  <span>PKR 1,000 / Original Degree</span>
                </div>
                <div className="flex items-center gap-1.5 text-black">
                  <CheckCircle2 className="size-3.5 shrink-0 text-[#13c2b6]" />
                  <span>Courier & Urgent Walk-in</span>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#e5e5e5] bg-transparent p-0 pt-4 pb-5">
                <div className="flex w-full items-center justify-between text-xs font-bold text-[#13c2b6] transition-all group-hover:translate-x-1 group-hover:text-[#27b2d7]">
                  <span>Start Application</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </CardFooter>
            </Card>

            {/* Card 2: Attestation Renewal */}
            <Card
              role="button"
              tabIndex={0}
              onClick={handleRenewal}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRenewal();
                }
              }}
              className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_28px_rgba(8,27,88,0.08)] transition-all duration-300 select-none hover:-translate-y-1 hover:border-[#27b2d7] hover:shadow-[0_16px_36px_rgba(8,27,88,0.14)] focus-visible:outline-2 focus-visible:outline-[#27b2d7]"
            >
              <CardHeader className="space-y-3 p-0 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-[12px] bg-[#87cbde]/25 text-[#27b2d7] transition-transform group-hover:scale-110">
                    <RefreshCw className="size-6 text-[#27b2d7]" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-[#87cbde] bg-[#87cbde]/20 text-[10px] font-bold text-black"
                  >
                    Duplicate / Renewal
                  </Badge>
                </div>
                <div>
                  <CardTitle className="font-heading text-lg font-bold text-black transition-colors group-hover:text-[#27b2d7]">
                    Attestation Renewal
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs leading-normal text-[#666666]">
                    Re-issue or duplicate verification tickets for damaged,
                    updated, or additional degree copies.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 p-0 pt-2 text-xs text-[#666666]">
                <div className="flex items-center gap-1.5 text-black">
                  <CheckCircle2 className="size-3.5 shrink-0 text-[#27b2d7]" />
                  <span>Fast-Track Prior Scrutiny</span>
                </div>
                <div className="flex items-center gap-1.5 text-black">
                  <CheckCircle2 className="size-3.5 shrink-0 text-[#27b2d7]" />
                  <span>Retained PQR Records</span>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#e5e5e5] bg-transparent p-0 pt-4 pb-5">
                <div className="flex w-full items-center justify-between text-xs font-bold text-[#27b2d7] transition-all group-hover:translate-x-1 group-hover:text-[#13c2b6]">
                  <span>Renew Now</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </CardFooter>
            </Card>

            {/* Card 3: Track Progress */}
            <Card
              role="button"
              tabIndex={0}
              onClick={() => setActiveModal('track_lookup')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveModal('track_lookup');
                }
              }}
              className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_28px_rgba(8,27,88,0.08)] transition-all duration-300 select-none hover:-translate-y-1 hover:border-[#13c2b6] hover:shadow-[0_16px_36px_rgba(8,27,88,0.14)] focus-visible:outline-2 focus-visible:outline-[#13c2b6]"
            >
              <CardHeader className="space-y-3 p-0 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-[12px] bg-[#13c2b6]/15 text-[#13c2b6] transition-transform group-hover:scale-110">
                    <Search className="size-6 text-[#13c2b6]" />
                  </div>
                  <Badge variant="inProgress" className="text-[10px]">
                    Live Synapark
                  </Badge>
                </div>
                <div>
                  <CardTitle className="font-heading text-lg font-bold text-black transition-colors group-hover:text-[#13c2b6]">
                    Track Progress
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs leading-normal text-[#666666]">
                    Real-time stage transparency, controller remarks, and
                    rejection/resubmit instructions.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 p-0 pt-2 text-xs text-[#666666]">
                <div className="flex items-center gap-1.5 text-black">
                  <CheckCircle2 className="size-3.5 shrink-0 text-[#13c2b6]" />
                  <span>6 Scrutiny Stages Tracked</span>
                </div>
                <div className="flex items-center gap-1.5 text-black">
                  <CheckCircle2 className="size-3.5 shrink-0 text-[#13c2b6]" />
                  <span>Reviewer Remarks & Resubmit</span>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#e5e5e5] bg-transparent p-0 pt-4 pb-5">
                <div className="flex w-full items-center justify-between text-xs font-bold text-[#13c2b6] transition-all group-hover:translate-x-1 group-hover:text-[#27b2d7]">
                  <span>Track Status</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </CardFooter>
            </Card>

            {/* Card 4: Share Proof */}
            <Card
              role="button"
              tabIndex={0}
              onClick={() => setActiveModal('share_proof')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveModal('share_proof');
                }
              }}
              className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_28px_rgba(8,27,88,0.08)] transition-all duration-300 select-none hover:-translate-y-1 hover:border-[#27b2d7] hover:shadow-[0_16px_36px_rgba(8,27,88,0.14)] focus-visible:outline-2 focus-visible:outline-[#27b2d7]"
            >
              <CardHeader className="space-y-3 p-0 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-[12px] bg-[#87cbde]/25 text-[#27b2d7] transition-transform group-hover:scale-110">
                    <Share2 className="size-6 text-[#27b2d7]" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-[#87cbde] bg-[#87cbde]/20 text-[10px] font-bold text-black"
                  >
                    Digital Wallet
                  </Badge>
                </div>
                <div>
                  <CardTitle className="font-heading text-lg font-bold text-black transition-colors group-hover:text-[#27b2d7]">
                    Share Proof
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs leading-normal text-[#666666]">
                    Generate instant, tamper-proof verification links & QR codes
                    for employers and foreign embassies.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 p-0 pt-2 text-xs text-[#666666]">
                <div className="flex items-center gap-1.5 text-black">
                  <CheckCircle2 className="size-3.5 shrink-0 text-[#27b2d7]" />
                  <span>Cryptographic QR Validation</span>
                </div>
                <div className="flex items-center gap-1.5 text-black">
                  <CheckCircle2 className="size-3.5 shrink-0 text-[#27b2d7]" />
                  <span>Embassies & WES Compatible</span>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#e5e5e5] bg-transparent p-0 pt-4 pb-5">
                <div className="flex w-full items-center justify-between text-xs font-bold text-[#27b2d7] transition-all group-hover:translate-x-1 group-hover:text-[#13c2b6]">
                  <span>Generate Link</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Attestation Journey Roadmap Teaser */}
      <section className="border-b border-[#e5e5e5] bg-[#f6fbfe] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 rounded-2xl border border-[#e5e5e5] bg-white p-8 shadow-[0_10px_28px_rgba(8,27,88,0.08)] sm:p-10 md:flex-row">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Compass className="size-5 text-[#13c2b6]" />
                <span className="text-xs font-bold tracking-wider text-[#13c2b6] uppercase">
                  10-Step Verification Roadmap
                </span>
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-black sm:text-3xl">
                Understand The Attestation Journey Before You Begin
              </h2>
              <p className="text-sm leading-relaxed text-[#666666]">
                From initial national ID creation, PQR academic linkage, and
                1-Link PSID billing to L1/L2 forensic audits, holographic
                stamping, and HEC Digital Wallet storage. Review prerequisites,
                checklist items, and estimated turnaround times.
              </p>
            </div>

            <Link
              href="/journey"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'inline-flex shrink-0 items-center gap-2 rounded-[12px] bg-[#13c2b6] font-bold text-black shadow-sm hover:bg-[#27b2d7]'
              )}
            >
              <span>Explore 10-Step Guide</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Standards & Highlights */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
            <Badge
              variant="outline"
              className="border-[#87cbde] bg-[#87cbde]/20 text-xs font-bold text-black"
            >
              National Infrastructure
            </Badge>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Engineered for Integrity and Trust
            </h2>
            <p className="text-sm text-[#666666]">
              Every qualification submitted through the HEC E-Portal is
              cross-verified against the official Pakistan Qualification
              Register (PQR) under strict regulatory compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3 rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_28px_rgba(8,27,88,0.08)] transition-all hover:border-[#13c2b6]">
              <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#13c2b6]/15 text-[#13c2b6]">
                <Building2 className="size-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-black">
                240+ Accredited Universities
              </h3>
              <p className="text-xs leading-relaxed text-[#666666]">
                Direct integration with university registrar archives and
                professional councils (PEC, PMDC, NBEAC, NCEAC).
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_28px_rgba(8,27,88,0.08)] transition-all hover:border-[#27b2d7]">
              <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#87cbde]/25 text-[#27b2d7]">
                <Lock className="size-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-black">
                1-Link 17-Digit PSID
              </h3>
              <p className="text-xs leading-relaxed text-[#666666]">
                Real-time fee verification through mobile banking, ATMs, and
                counter vouchers without physical token queues.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_28px_rgba(8,27,88,0.08)] transition-all hover:border-[#13c2b6]">
              <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#13c2b6]/15 text-[#13c2b6]">
                <Clock className="size-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-black">
                Transparent Review Audit
              </h3>
              <p className="text-xs leading-relaxed text-[#666666]">
                Complete stage-by-stage reviewer log with clear reasons and
                one-click document re-upload for flagged scans.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_28px_rgba(8,27,88,0.08)] transition-all hover:border-[#27b2d7]">
              <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#87cbde]/25 text-[#27b2d7]">
                <QrCode className="size-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-black">
                Cryptographic QR Verification
              </h3>
              <p className="text-xs leading-relaxed text-[#666666]">
                Attested credentials are securely vaulted in your HEC Digital
                Wallet, instantly verifiable anywhere on earth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Interactive Demo Modals */}
      <AuthModal />
      <TrackLookupModal />
      <ShareProofModal />
    </div>
  );
}
