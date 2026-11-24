'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FileCheck,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  Search,
  GraduationCap,
  Share2,
  Compass,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  Edit,
  PlusCircle,
  User,
  CheckCircle2,
  QrCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { PortalShell } from '@/components/layout/PortalShell';
import { useAppStore } from '@/store/use-app-store';
import type { ApplicationSummary, PendingTask } from '@/types/portal';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { studentData, setActiveModal } = useAppStore();

  const [copiedWallet, setCopiedWallet] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [downloadNotice, setDownloadNotice] = React.useState<string | null>(
    null
  );
  const [isDismissed, setIsDismissed] = React.useState(false);

  const submittedParam = searchParams.get('submitted') === 'true';
  const appIdParam = searchParams.get('appId') || '#APP-2026-9981';
  const showSubmissionNotice = submittedParam && !isDismissed;

  const student = studentData?.student;
  const applications: ApplicationSummary[] =
    studentData?.recentApplications || [];
  const pendingTasks: PendingTask[] = studentData?.pendingTasks || [];
  const walletItems = studentData?.hecWallet || [];
  const completionPercentage = studentData?.profileCompletionPercentage || 92;

  const walletId = `HEC-WAL-${student?.cnic?.replace(/-/g, '').slice(0, 5) || '35202'}-9821`;

  const handleCopyWallet = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(walletId);
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2500);
    }
  };

  const handleDownloadReceipt = (appId: string) => {
    setDownloadNotice(
      `Official 1-Link E-Challan receipt for ${appId} generated.`
    );
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  // Filter applications by search text and status
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.currentStage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'pending') {
      return app.status === 'in_progress' || app.status === 'resubmit_required';
    }
    if (statusFilter === 'action_required') {
      return app.status === 'resubmit_required' || app.actionRequired;
    }
    if (statusFilter === 'approved') {
      return app.status === 'approved' || app.status === 'dispatched';
    }

    return true;
  });

  const pendingVerificationCount = applications.filter(
    (a) => a.status === 'in_progress' || a.status === 'resubmit_required'
  ).length;

  return (
    <PortalShell>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Application Submission Confirmation Alert Banner */}
        {showSubmissionNotice && (
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#13c2b6] bg-gradient-to-r from-[#f6fbfe] via-white to-[#f6fbfe] p-5 shadow-[0_10px_28px_rgba(8,27,88,0.12)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3.5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#13c2b6] text-black shadow-md">
                  <CheckCircle2 className="size-6 text-black" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-base font-bold text-black">
                      Application Submitted & Queued!
                    </h3>
                    <Badge className="bg-[#13c2b6] font-mono text-xs font-bold text-black hover:bg-[#13c2b6]">
                      {appIdParam}
                    </Badge>
                  </div>
                  <p className="max-w-2xl text-xs leading-relaxed text-[#666666]">
                    Your attestation application has been successfully logged
                    with HEC Pakistan. Your dossier has entered the Scrutiny &
                    Verification Queue. You can monitor the real-time stage
                    progress or review your submitted documents anytime.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 sm:shrink-0">
                <Link
                  href={`/track/${encodeURIComponent(appIdParam)}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#13c2b6] px-4 py-2.5 text-xs font-bold text-black shadow-sm transition-all hover:bg-[#13c2b6]/90"
                >
                  <Compass className="size-4" />
                  <span>Track Status</span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDismissed(true)}
                  className="rounded-xl border-[#e5e5e5] text-xs font-semibold text-[#666666] hover:bg-[#f6fbfe] hover:text-black"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Download notification alert if triggered */}
        {downloadNotice && (
          <div className="flex items-center gap-2 rounded-xl border border-[#13c2b6]/30 bg-[#f6fbfe] p-3 text-xs text-black">
            <CheckCircle2 className="size-4 shrink-0 text-[#13c2b6]" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* 1. KPI & HEC Wallet Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* KPI Card: Total Applications */}
          <Card className="relative overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white text-black shadow-[0_10px_28px_rgba(8,27,88,0.08)]">
            <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-[#87cbde]/15 blur-2xl" />

            <CardHeader className="p-6 pb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-[#666666] uppercase">
                  Applications Overview
                </span>
                <Badge
                  variant="outline"
                  className="border-[#13c2b6]/40 bg-[#f6fbfe] text-xs text-[#27b2d7]"
                >
                  Active Lifecycle
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-6 pt-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-heading text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
                    0{applications.length || 4}
                  </span>
                  <span className="mt-1 block text-xs text-[#666666]">
                    Total Submitted Attestation Files
                  </span>
                </div>

                <div className="flex size-14 items-center justify-center rounded-2xl border border-[#87cbde]/30 bg-[#f6fbfe] text-[#13c2b6]">
                  <FileCheck className="size-7" />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e5e5] pt-3 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-amber-600">
                  <Clock className="size-3.5" />
                  {pendingVerificationCount} Pending Verification
                </span>

                <Button
                  size="sm"
                  onClick={() => router.push('/apply')}
                  className="h-8 gap-1.5 bg-[#13c2b6] text-xs font-bold text-black hover:bg-[#27b2d7]"
                >
                  <PlusCircle className="size-3.5" />
                  <span>New Attestation</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* HEC-Wallet Details Card */}
          <Card className="relative overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white text-black shadow-[0_10px_28px_rgba(8,27,88,0.08)]">
            <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-[#87cbde]/15 blur-2xl" />

            <CardHeader className="p-6 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold tracking-wider text-[#666666] uppercase">
                    HEC-Wallet Details
                  </span>
                  <Badge
                    variant="approved"
                    className="gap-1 px-1.5 py-0 text-[10px]"
                  >
                    <ShieldCheck className="size-3" />
                    Verified
                  </Badge>
                </div>

                <span className="font-mono text-[11px] text-[#666666]">
                  {walletItems.length} Stored Sanads
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-6 pt-2">
              <div className="space-y-1.5">
                <span className="block text-xs text-[#666666]">
                  Digital Vault Identifier:
                </span>
                <div className="flex items-center justify-between rounded-xl border border-[#e5e5e5] bg-[#f6fbfe] p-3">
                  <span className="font-mono text-sm font-bold tracking-wider text-black sm:text-base">
                    {walletId}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyWallet}
                    className="h-8 gap-1 border border-[#e5e5e5] px-2.5 text-xs text-[#666666] hover:bg-white hover:text-black"
                  >
                    {copiedWallet ? (
                      <>
                        <Check className="size-3.5 text-[#13c2b6]" />
                        <span className="font-bold text-[#13c2b6]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#e5e5e5] pt-3 text-xs">
                <span className="text-[#666666]">
                  Cryptographically Encrypted Vault
                </span>
                <Link
                  href="/assets"
                  className="group inline-flex items-center gap-1 font-bold text-[#27b2d7] hover:text-[#13c2b6]"
                >
                  <span>View Assets</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. Quick Feature Cards Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {/* Feature 1: My Degree */}
          <Card className="group flex flex-col justify-between rounded-2xl border border-[#e5e5e5] bg-white transition-all hover:border-[#13c2b6] hover:shadow-[0_10px_28px_rgba(8,27,88,0.08)]">
            <CardHeader className="space-y-2 p-6 pb-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#87cbde]/15 text-[#27b2d7] transition-transform group-hover:scale-105">
                <GraduationCap className="size-6" />
              </div>
              <CardTitle className="text-base font-bold text-black">
                My Degree
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed text-[#666666]">
                Access digitally verified degree certificates, transcripts, and
                secure archives.
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-6 pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/assets')}
                className="w-full justify-between border-[#e5e5e5] text-xs font-semibold hover:border-[#27b2d7] hover:bg-[#f6fbfe]"
              >
                <span>Access Degree Vault</span>
                <ArrowRight className="size-3.5 text-[#13c2b6]" />
              </Button>
            </CardFooter>
          </Card>

          {/* Feature 2: Share Proof */}
          <Card className="group flex flex-col justify-between rounded-2xl border border-[#e5e5e5] bg-white transition-all hover:border-[#13c2b6] hover:shadow-[0_10px_28px_rgba(8,27,88,0.08)]">
            <CardHeader className="space-y-2 p-6 pb-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#87cbde]/15 text-[#27b2d7] transition-transform group-hover:scale-105">
                <Share2 className="size-6" />
              </div>
              <CardTitle className="text-base font-bold text-black">
                Share Proof
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed text-[#666666]">
                Generate instant tamper-evident public verification links and QR
                badges for employers.
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-6 pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModal('share_proof')}
                className="w-full justify-between border-[#e5e5e5] text-xs font-semibold hover:border-[#27b2d7] hover:bg-[#f6fbfe]"
              >
                <span>Generate Link / QR</span>
                <QrCode className="size-3.5 text-[#13c2b6]" />
              </Button>
            </CardFooter>
          </Card>

          {/* Feature 3: Attestation Tracking */}
          <Card className="group flex flex-col justify-between rounded-2xl border border-[#e5e5e5] bg-white transition-all hover:border-[#13c2b6] hover:shadow-[0_10px_28px_rgba(8,27,88,0.08)]">
            <CardHeader className="space-y-2 p-6 pb-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#87cbde]/15 text-[#27b2d7] transition-transform group-hover:scale-105">
                <Compass className="size-6" />
              </div>
              <CardTitle className="text-base font-bold text-black">
                Attestation Tracking
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed text-[#666666]">
                Real-time tracking through Scrutiny, L1/L2 controllers, and
                physical embossing.
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-6 pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModal('track_lookup')}
                className="w-full justify-between border-[#e5e5e5] text-xs font-semibold hover:border-[#27b2d7] hover:bg-[#f6fbfe]"
              >
                <span>Jump to Live Tracker</span>
                <Search className="size-3.5 text-[#13c2b6]" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* 3. My Applications Table */}
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-black">
                <FileCheck className="size-5 text-[#13c2b6]" />
                <span>My Applications</span>
              </h2>
              <p className="mt-0.5 text-xs text-[#666666]">
                Manage your submitted verification dossiers, track status, and
                view audit comments.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-64">
                <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#666666]" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID or degree..."
                  className="h-9 border-[#e5e5e5] bg-white pl-8 text-xs text-black placeholder:text-[#666666]"
                />
              </div>

              <div className="flex items-center gap-1.5 rounded-xl border border-[#e5e5e5] bg-[#f6fbfe] p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`rounded-lg px-2.5 py-1 transition-all ${
                    statusFilter === 'all'
                      ? 'border border-[#e5e5e5] bg-white font-bold text-black shadow-sm'
                      : 'text-[#666666] hover:text-black'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('pending')}
                  className={`rounded-lg px-2.5 py-1 transition-all ${
                    statusFilter === 'pending'
                      ? 'border border-[#e5e5e5] bg-white font-bold text-black shadow-sm'
                      : 'text-[#666666] hover:text-black'
                  }`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('action_required')}
                  className={`rounded-lg px-2.5 py-1 transition-all ${
                    statusFilter === 'action_required'
                      ? 'border border-[#e5e5e5] bg-white font-bold text-amber-600 shadow-sm'
                      : 'text-[#666666] hover:text-black'
                  }`}
                >
                  Action Required
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('approved')}
                  className={`rounded-lg px-2.5 py-1 transition-all ${
                    statusFilter === 'approved'
                      ? 'border border-[#e5e5e5] bg-white font-bold text-[#0b746d] shadow-sm'
                      : 'text-[#666666] hover:text-black'
                  }`}
                >
                  Approved
                </button>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white shadow-[0_10px_28px_rgba(8,27,88,0.06)]">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#f6fbfe]">
                  <TableRow className="border-b border-[#e5e5e5]">
                    <TableHead className="text-xs font-bold text-black">
                      Application ID
                    </TableHead>
                    <TableHead className="text-xs font-bold text-black">
                      Service Type & Program
                    </TableHead>
                    <TableHead className="text-xs font-bold text-black">
                      Submission Date
                    </TableHead>
                    <TableHead className="text-xs font-bold text-black">
                      Current Stage
                    </TableHead>
                    <TableHead className="text-xs font-bold text-black">
                      Status
                    </TableHead>
                    <TableHead className="text-right text-xs font-bold text-black">
                      Quick Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-28 text-center text-xs text-[#666666]"
                      >
                        No applications found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((app) => {
                      const isActionRequired =
                        app.status === 'resubmit_required' ||
                        app.actionRequired;
                      const badgeVariant =
                        app.status === 'resubmit_required'
                          ? 'resubmit'
                          : app.status === 'approved' ||
                              app.status === 'dispatched'
                            ? 'approved'
                            : app.status === 'in_progress'
                              ? 'inProgress'
                              : 'archived';

                      return (
                        <TableRow
                          key={app.id}
                          className="border-b border-[#e5e5e5] transition-colors hover:bg-[#f6fbfe]/60"
                        >
                          <TableCell className="font-mono text-xs font-bold text-[#27b2d7]">
                            {app.id}
                          </TableCell>

                          <TableCell className="max-w-xs">
                            <span className="text-foreground block text-xs font-semibold sm:text-sm">
                              {app.serviceName}
                            </span>
                            {app.actionMessage && (
                              <span className="mt-0.5 line-clamp-1 block text-[11px] text-amber-600 dark:text-amber-400">
                                {app.actionMessage}
                              </span>
                            )}
                          </TableCell>

                          <TableCell className="text-muted-foreground text-xs">
                            {new Date(app.submittedAt).toLocaleDateString(
                              'en-GB',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </TableCell>

                          <TableCell className="text-foreground text-xs font-medium">
                            {app.currentStage}
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant={badgeVariant}
                              className="text-[10px]"
                            >
                              {app.statusLabel}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Action 1: Track Details */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  router.push(
                                    `/track/${encodeURIComponent(app.id)}`
                                  )
                                }
                                className="h-7 gap-1 border-[#e5e5e5] px-2.5 text-xs text-black hover:border-[#27b2d7] hover:bg-[#f6fbfe]"
                                title="View tracking details"
                              >
                                <Eye className="size-3 text-[#13c2b6]" />
                                <span className="hidden sm:inline">Track</span>
                              </Button>

                              {/* Action 2: Edit / Resubmit Draft */}
                              {isActionRequired && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    router.push(
                                      `/track/${encodeURIComponent(app.id)}`
                                    )
                                  }
                                  className="h-7 gap-1 bg-amber-500 px-2.5 text-xs font-bold text-black hover:bg-amber-600"
                                  title="Fix and resubmit"
                                >
                                  <Edit className="size-3" />
                                  <span className="hidden sm:inline">Fix</span>
                                </Button>
                              )}

                              {/* Action 3: Download Receipt */}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDownloadReceipt(app.id)}
                                className="h-7 px-2 text-[#666666] hover:bg-[#f6fbfe] hover:text-black"
                                title="Download 1-Link Challan Receipt"
                              >
                                <Download className="size-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* 4. Bottom Two-Column Row (My Task + Profile Status) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Card 1: My Task */}
          <Card className="flex flex-col justify-between rounded-2xl border border-[#e5e5e5] bg-white shadow-[0_10px_28px_rgba(8,27,88,0.06)]">
            <CardHeader className="space-y-1 p-6 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-black">
                  <AlertTriangle className="size-4 text-amber-500" />
                  <span>My Tasks & Discrepancies</span>
                </CardTitle>
                <Badge
                  variant="outline"
                  className="border-[#e5e5e5] font-mono text-xs text-[#666666]"
                >
                  {pendingTasks.length} Pending
                </Badge>
              </div>
              <CardDescription className="text-xs text-[#666666]">
                Actionable remarks submitted by HEC L1/L2 desk officers
                requiring applicant response.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-6 pt-0">
              {pendingTasks.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#666666]">
                  No action items pending. All verification documents are clear!
                </div>
              ) : (
                pendingTasks.map((task) => {
                  const isHighPriority = task.priority === 'high';
                  const badgeVariant = isHighPriority
                    ? 'resubmit'
                    : 'inProgress';

                  return (
                    <div
                      key={task.id}
                      className={`rounded-xl border p-4 transition-all ${
                        isHighPriority
                          ? 'border-amber-500/40 bg-amber-500/5'
                          : 'border-[#e5e5e5] bg-[#f6fbfe]'
                      } space-y-2`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant={badgeVariant}
                          className="text-[10px] font-bold uppercase"
                        >
                          {task.priority === 'high'
                            ? 'HIGH PRIORITY'
                            : task.priority.toUpperCase()}
                        </Badge>
                        {task.dueDate && (
                          <span className="flex items-center gap-1 font-mono text-[11px] text-[#666666]">
                            <Clock className="size-3" />
                            Due: {task.dueDate}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-black sm:text-sm">
                        {task.title}
                      </h4>

                      <p className="text-xs leading-relaxed text-[#666666]">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between border-t border-[#e5e5e5] pt-2 text-xs">
                        <span className="font-mono text-[11px] text-[#666666]">
                          Ref: {task.applicationId}
                        </span>

                        <Button
                          size="sm"
                          onClick={() => {
                            if (task.applicationId) {
                              router.push(
                                `/track/${encodeURIComponent(task.applicationId)}`
                              );
                            } else {
                              router.push(task.link);
                            }
                          }}
                          className={
                            isHighPriority
                              ? 'h-7 gap-1 bg-amber-500 text-xs font-bold text-black hover:bg-amber-600'
                              : 'h-7 gap-1 bg-[#13c2b6] text-xs font-bold text-black hover:bg-[#27b2d7]'
                          }
                        >
                          <span>Click to Action</span>
                          <ArrowRight className="size-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>

            <CardFooter className="border-t border-[#e5e5e5] p-6 pt-3 text-[11px] text-[#666666]">
              Timely response ensures faster handoff to L2 Controller
              concurrence.
            </CardFooter>
          </Card>

          {/* Card 2: Profile Status */}
          <Card className="flex flex-col justify-between rounded-2xl border border-[#e5e5e5] bg-white shadow-[0_10px_28px_rgba(8,27,88,0.06)]">
            <CardHeader className="space-y-1 p-6 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-black">
                  <User className="size-4 text-[#13c2b6]" />
                  <span>Profile Status</span>
                </CardTitle>
                <Badge variant="approved" className="gap-1 text-[10px]">
                  <CheckCircle2 className="size-3" />
                  HEC-ID Active
                </Badge>
              </div>
              <CardDescription className="text-xs text-[#666666]">
                Ensure national identity records and qualification credentials
                are completely up to date.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 p-6 pt-0">
              {/* User Bio Header */}
              <div className="flex items-center gap-4 rounded-xl border border-[#e5e5e5] bg-[#f6fbfe] p-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#13c2b6] to-[#27b2d7] text-base font-bold text-black shadow-sm">
                  {student?.fullName
                    ? student.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                    : 'HM'}
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <span className="block truncate text-sm font-bold text-black">
                    {student?.fullName || 'Hamza Tariq Malik'}
                  </span>
                  <span className="block truncate font-mono text-xs text-[#666666]">
                    HEC-ID: {student?.id?.toUpperCase() || 'STD-98214'} • CNIC:{' '}
                    {student?.cnic || '35202-1928374-1'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#666666]">
                    Completion Progress
                  </span>
                  <span className="font-extrabold text-[#13c2b6]">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#e5e5e5] bg-[#f6fbfe]">
                  <div
                    className="h-2.5 rounded-full bg-[#13c2b6] transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Verification Checklist */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl border border-[#e5e5e5] bg-white p-2.5">
                  <span className="text-[#666666]">
                    NADRA CNIC Verification
                  </span>
                  <Badge variant="approved" className="text-[10px]">
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#e5e5e5] bg-white p-2.5">
                  <span className="text-[#666666]">PQR Academic Linkage</span>
                  <Badge variant="approved" className="text-[10px]">
                    2 Universities Linked
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#e5e5e5] bg-white p-2.5">
                  <span className="text-[#666666]">
                    Emergency Contact & Domicile
                  </span>
                  <span className="text-[11px] font-semibold text-amber-600">
                    8% Pending
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t border-[#e5e5e5] p-6 pt-3">
              <Button
                onClick={() => router.push('/profile')}
                className="w-full gap-1.5 bg-[#13c2b6] text-xs font-bold text-black hover:bg-[#27b2d7]"
              >
                <span>Finish Profile Setup</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}

export default function DashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="bg-background text-muted-foreground flex min-h-screen items-center justify-center text-sm">
          Loading student dashboard...
        </div>
      }
    >
      <DashboardContent />
    </React.Suspense>
  );
}
