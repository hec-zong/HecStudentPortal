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

      {/* Hero Section with Dark Architectural Backdrop */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 text-slate-100">
        {/* Subtle Architectural Pattern & Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.18),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:4rem_4rem]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/80 px-3 py-1 text-xs font-semibold text-emerald-300 shadow-inner">
              <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
              <span>Higher Education Commission of Pakistan</span>
            </div>

            <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                HEC E-Portal
              </span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              The unified national gateway for Pakistani university degrees,
              transcripts, and diplomas. Backed by the{' '}
              <strong>Synapark Workflow Engine</strong>, Pakistan Qualification
              Register (PQR), and automated{' '}
              <strong>1-Link 17-digit PSID</strong> challan settlements.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                size="lg"
                onClick={handleStartAttestation}
                className="h-12 cursor-pointer gap-2 bg-emerald-600 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 sm:text-base"
              >
                <span>Start Degree Attestation</span>
                <ArrowRight className="size-4" />
              </Button>

              <Link
                href="/journey"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'inline-flex h-12 items-center gap-2 border-slate-700 bg-slate-900/60 px-6 text-sm font-semibold text-slate-200 hover:bg-slate-800 sm:text-base'
                )}
              >
                <Compass className="size-4 text-emerald-400" />
                <span>View 10-Step Journey</span>
              </Link>
            </div>
          </div>

          {/* 4 Primary Action Cards Grid */}
          <div
            id="services"
            className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
          >
            {/* Card 1: Degree Attestation */}
            <Card className="group flex flex-col justify-between border-slate-800 bg-slate-900/80 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/20">
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 transition-transform group-hover:scale-110">
                    <FileCheck className="size-6 text-emerald-400" />
                  </div>
                  <Badge variant="approved" className="text-[10px]">
                    Primary Service
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-white transition-colors group-hover:text-emerald-300">
                    Degree Attestation
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs leading-normal text-slate-400">
                    Original Degrees, Detailed Marks Certificates (DMCs), and
                    Transcripts with security QR seal.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="size-3.5 shrink-0 text-emerald-400" />
                  <span>PKR 1,000 / Original Degree</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="size-3.5 shrink-0 text-emerald-400" />
                  <span>Courier & Urgent Walk-in</span>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-800/80 pt-2">
                <button
                  type="button"
                  onClick={handleStartAttestation}
                  className="flex w-full items-center justify-between text-xs font-semibold text-emerald-400 transition-all group-hover:translate-x-1 hover:text-emerald-300"
                >
                  <span>Start Application</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </CardFooter>
            </Card>

            {/* Card 2: Attestation Renewal */}
            <Card className="group flex flex-col justify-between border-slate-800 bg-slate-900/80 transition-all duration-300 hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-950/20">
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 transition-transform group-hover:scale-110">
                    <RefreshCw className="size-6 text-teal-400" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-teal-500/30 text-[10px] text-teal-300"
                  >
                    Duplicate / Renewal
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-white transition-colors group-hover:text-teal-300">
                    Attestation Renewal
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs leading-normal text-slate-400">
                    Re-issue or duplicate verification tickets for damaged,
                    updated, or additional degree copies.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="size-3.5 shrink-0 text-teal-400" />
                  <span>Fast-Track Prior Scrutiny</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="size-3.5 shrink-0 text-teal-400" />
                  <span>Retained PQR Records</span>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-800/80 pt-2">
                <button
                  type="button"
                  onClick={handleRenewal}
                  className="flex w-full items-center justify-between text-xs font-semibold text-teal-400 transition-all group-hover:translate-x-1 hover:text-teal-300"
                >
                  <span>Renew Now</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </CardFooter>
            </Card>

            {/* Card 3: Track Progress */}
            <Card className="group flex flex-col justify-between border-slate-800 bg-slate-900/80 transition-all duration-300 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-950/20">
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 transition-transform group-hover:scale-110">
                    <Search className="size-6 text-amber-400" />
                  </div>
                  <Badge variant="inProgress" className="text-[10px]">
                    Live Synapark
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-white transition-colors group-hover:text-amber-300">
                    Track Progress
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs leading-normal text-slate-400">
                    Real-time stage transparency, controller remarks, and
                    rejection/resubmit instructions.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="size-3.5 shrink-0 text-amber-400" />
                  <span>6 Scrutiny Stages Tracked</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="size-3.5 shrink-0 text-amber-400" />
                  <span>Reviewer Remarks & Resubmit</span>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-800/80 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal('track_lookup')}
                  className="flex w-full items-center justify-between text-xs font-semibold text-amber-400 transition-all group-hover:translate-x-1 hover:text-amber-300"
                >
                  <span>Track Status</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </CardFooter>
            </Card>

            {/* Card 4: Share Proof */}
            <Card className="group flex flex-col justify-between border-slate-800 bg-slate-900/80 transition-all duration-300 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-950/20">
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 transition-transform group-hover:scale-110">
                    <Share2 className="size-6 text-sky-400" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-sky-500/30 text-[10px] text-sky-300"
                  >
                    Digital Wallet
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-white transition-colors group-hover:text-sky-300">
                    Share Proof
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs leading-normal text-slate-400">
                    Generate instant, tamper-proof verification links & QR codes
                    for employers and foreign embassies.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="size-3.5 shrink-0 text-sky-400" />
                  <span>Cryptographic QR Validation</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="size-3.5 shrink-0 text-sky-400" />
                  <span>Embassies & WES Compatible</span>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-800/80 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal('share_proof')}
                  className="flex w-full items-center justify-between text-xs font-semibold text-sky-400 transition-all group-hover:translate-x-1 hover:text-sky-300"
                >
                  <span>Generate Link</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Attestation Journey Roadmap Teaser */}
      <section className="bg-muted/40 border-border/70 border-b py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-card border-border flex flex-col items-center justify-between gap-8 rounded-xl border p-8 shadow-xs sm:p-10 md:flex-row">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Compass className="text-primary size-5" />
                <span className="text-primary text-xs font-bold tracking-wider uppercase">
                  10-Step Verification Roadmap
                </span>
              </div>
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                Understand The Attestation Journey Before You Begin
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
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
                'bg-primary hover:bg-primary/90 text-primary-foreground inline-flex shrink-0 items-center gap-2 font-semibold'
              )}
            >
              <span>Explore 10-Step Guide</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Standards & Highlights */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
            <Badge
              variant="outline"
              className="text-primary border-primary/30 text-xs font-semibold"
            >
              National Infrastructure
            </Badge>
            <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              Engineered for Integrity and Trust
            </h2>
            <p className="text-muted-foreground text-sm">
              Every qualification submitted through the HEC E-Portal is
              cross-verified against the official Pakistan Qualification
              Register (PQR) under strict regulatory compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="border-border bg-card/60 space-y-3 rounded-xl border p-6">
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                <Building2 className="size-5" />
              </div>
              <h3 className="text-foreground text-base font-bold">
                240+ Accredited Universities
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Direct integration with university registrar archives and
                professional councils (PEC, PMDC, NBEAC, NCEAC).
              </p>
            </div>

            <div className="border-border bg-card/60 space-y-3 rounded-xl border p-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                <Lock className="size-5" />
              </div>
              <h3 className="text-foreground text-base font-bold">
                1-Link 17-Digit PSID
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Real-time fee verification through mobile banking, ATMs, and
                counter vouchers without physical token queues.
              </p>
            </div>

            <div className="border-border bg-card/60 space-y-3 rounded-xl border p-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">
                <Clock className="size-5" />
              </div>
              <h3 className="text-foreground text-base font-bold">
                Transparent Review Audit
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Complete stage-by-stage reviewer log with clear reasons and
                one-click document re-upload for flagged scans.
              </p>
            </div>

            <div className="border-border bg-card/60 space-y-3 rounded-xl border p-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-300">
                <QrCode className="size-5" />
              </div>
              <h3 className="text-foreground text-base font-bold">
                Cryptographic QR Verification
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
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
