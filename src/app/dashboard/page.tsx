'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

export default function DashboardPage() {
  const router = useRouter();
  const { studentData, setActiveModal } = useAppStore();

  const [copiedWallet, setCopiedWallet] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [downloadNotice, setDownloadNotice] = React.useState<string | null>(
    null
  );

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
        {/* Download notification alert if triggered */}
        {downloadNotice && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* 1. KPI & HEC Wallet Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* KPI Card: Total Applications */}
          <Card className="relative overflow-hidden border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white shadow-lg">
            <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl" />

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Applications Overview
                </span>
                <Badge
                  variant="outline"
                  className="border-emerald-500/40 text-xs text-emerald-400"
                >
                  Active Lifecycle
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-mono text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    0{applications.length || 4}
                  </span>
                  <span className="mt-1 block text-xs text-slate-400">
                    Total Submitted Attestation Files
                  </span>
                </div>

                <div className="flex size-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <FileCheck className="size-7" />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-amber-400">
                  <Clock className="size-3.5" />
                  {pendingVerificationCount} Pending Verification
                </span>

                <Button
                  size="sm"
                  onClick={() => router.push('/apply')}
                  className="h-8 gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-500"
                >
                  <PlusCircle className="size-3.5" />
                  <span>New Attestation</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* HEC-Wallet Details Card */}
          <Card className="relative overflow-hidden border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white shadow-lg">
            <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-teal-500/10 blur-2xl" />

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
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

                <span className="font-mono text-[11px] text-slate-400">
                  {walletItems.length} Stored Sanads
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <span className="block text-xs text-slate-400">
                  Digital Vault Identifier:
                </span>
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-2.5">
                  <span className="font-mono text-sm font-bold tracking-wider text-emerald-400 sm:text-base">
                    {walletId}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyWallet}
                    className="h-7 gap-1 px-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    {copiedWallet ? (
                      <>
                        <Check className="size-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
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

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
                <span className="text-slate-400">
                  Cryptographically Encrypted Vault
                </span>
                <Link
                  href="/assets"
                  className="group inline-flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300"
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
          <Card className="bg-card border-border group flex flex-col justify-between transition-all hover:border-emerald-500/40 hover:shadow-md">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-transform group-hover:scale-105 dark:text-emerald-400">
                <GraduationCap className="size-6" />
              </div>
              <CardTitle className="text-foreground text-base font-bold">
                My Degree
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs leading-relaxed">
                Access digitally verified degree certificates, transcripts, and
                secure archives.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/assets')}
                className="w-full justify-between text-xs font-semibold group-hover:border-emerald-500/50"
              >
                <span>Access Degree Vault</span>
                <ArrowRight className="text-primary size-3.5" />
              </Button>
            </CardFooter>
          </Card>

          {/* Feature 2: Share Proof */}
          <Card className="bg-card border-border group flex flex-col justify-between transition-all hover:border-emerald-500/40 hover:shadow-md">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 transition-transform group-hover:scale-105 dark:text-blue-400">
                <Share2 className="size-6" />
              </div>
              <CardTitle className="text-foreground text-base font-bold">
                Share Proof
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs leading-relaxed">
                Generate instant tamper-evident public verification links and QR
                badges for employers.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModal('share_proof')}
                className="w-full justify-between text-xs font-semibold group-hover:border-emerald-500/50"
              >
                <span>Generate Link / QR</span>
                <QrCode className="text-primary size-3.5" />
              </Button>
            </CardFooter>
          </Card>

          {/* Feature 3: Attestation Tracking */}
          <Card className="bg-card border-border group flex flex-col justify-between transition-all hover:border-emerald-500/40 hover:shadow-md">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 transition-transform group-hover:scale-105 dark:text-purple-400">
                <Compass className="size-6" />
              </div>
              <CardTitle className="text-foreground text-base font-bold">
                Attestation Tracking
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs leading-relaxed">
                Real-time tracking through Scrutiny, L1/L2 controllers, and
                physical embossing.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModal('track_lookup')}
                className="w-full justify-between text-xs font-semibold group-hover:border-emerald-500/50"
              >
                <span>Jump to Live Tracker</span>
                <Search className="text-primary size-3.5" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* 3. My Applications Table */}
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-foreground flex items-center gap-2 text-xl font-bold tracking-tight">
                <FileCheck className="text-primary size-5" />
                <span>My Applications</span>
              </h2>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Manage your submitted verification dossiers, track status, and
                view audit comments.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-64">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID or degree..."
                  className="bg-card h-9 pl-8 text-xs"
                />
              </div>

              <div className="bg-muted flex items-center gap-1.5 rounded-lg p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`rounded-md px-2.5 py-1 transition-all ${
                    statusFilter === 'all'
                      ? 'bg-background text-foreground font-semibold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('pending')}
                  className={`rounded-md px-2.5 py-1 transition-all ${
                    statusFilter === 'pending'
                      ? 'bg-background text-foreground font-semibold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('action_required')}
                  className={`rounded-md px-2.5 py-1 transition-all ${
                    statusFilter === 'action_required'
                      ? 'bg-background font-semibold text-amber-600 shadow-sm dark:text-amber-400'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Action Required
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('approved')}
                  className={`rounded-md px-2.5 py-1 transition-all ${
                    statusFilter === 'approved'
                      ? 'bg-background font-semibold text-emerald-600 shadow-sm dark:text-emerald-400'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Approved
                </button>
              </div>
            </div>
          </div>

          <Card className="border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">
                      Application ID
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Service Type & Program
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Submission Date
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Current Stage
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="text-right text-xs font-semibold">
                      Quick Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-muted-foreground h-28 text-center text-xs"
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
                          className="hover:bg-muted/40 transition-colors"
                        >
                          <TableCell className="text-primary font-mono text-xs font-bold">
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
                                className="h-7 gap-1 px-2 text-xs"
                                title="View tracking details"
                              >
                                <Eye className="text-primary size-3" />
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
                                  className="h-7 gap-1 bg-amber-600 px-2 text-xs text-white hover:bg-amber-500"
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
                                className="text-muted-foreground hover:text-foreground h-7 px-2"
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
          <Card className="border-border flex flex-col justify-between shadow-sm">
            <CardHeader className="space-y-1 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground flex items-center gap-2 text-base font-bold">
                  <AlertTriangle className="size-4 text-amber-500" />
                  <span>My Tasks & Discrepancies</span>
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  {pendingTasks.length} Pending
                </Badge>
              </div>
              <CardDescription className="text-muted-foreground text-xs">
                Actionable remarks submitted by HEC L1/L2 desk officers
                requiring applicant response.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {pendingTasks.length === 0 ? (
                <div className="text-muted-foreground p-6 text-center text-xs">
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
                          ? 'border-amber-500/50 bg-amber-500/5'
                          : 'border-border bg-muted/40'
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
                          <span className="text-muted-foreground flex items-center gap-1 font-mono text-[11px]">
                            <Clock className="size-3" />
                            Due: {task.dueDate}
                          </span>
                        )}
                      </div>

                      <h4 className="text-foreground text-xs font-bold sm:text-sm">
                        {task.title}
                      </h4>

                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {task.description}
                      </p>

                      <div className="border-border/50 flex items-center justify-between border-t pt-2 text-xs">
                        <span className="text-muted-foreground font-mono text-[11px]">
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
                              ? 'h-7 gap-1 bg-amber-600 text-xs font-semibold text-white hover:bg-amber-500'
                              : 'bg-primary text-primary-foreground h-7 gap-1 text-xs'
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

            <CardFooter className="text-muted-foreground border-border/50 border-t pt-0 text-[11px]">
              Timely response ensures faster handoff to L2 Controller
              concurrence.
            </CardFooter>
          </Card>

          {/* Card 2: Profile Status */}
          <Card className="border-border flex flex-col justify-between shadow-sm">
            <CardHeader className="space-y-1 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground flex items-center gap-2 text-base font-bold">
                  <User className="size-4 text-emerald-500" />
                  <span>Profile Status</span>
                </CardTitle>
                <Badge variant="approved" className="gap-1 text-[10px]">
                  <CheckCircle2 className="size-3" />
                  HEC-ID Active
                </Badge>
              </div>
              <CardDescription className="text-muted-foreground text-xs">
                Ensure national identity records and qualification credentials
                are completely up to date.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* User Bio Header */}
              <div className="bg-muted/50 border-border flex items-center gap-4 rounded-xl border p-3">
                <div className="flex size-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-gradient-to-br from-emerald-600 to-teal-800 text-base font-bold text-white shadow">
                  {student?.fullName
                    ? student.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                    : 'HM'}
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <span className="text-foreground block truncate text-sm font-bold">
                    {student?.fullName || 'Hamza Tariq Malik'}
                  </span>
                  <span className="text-muted-foreground block truncate font-mono text-xs">
                    HEC-ID: {student?.id?.toUpperCase() || 'STD-98214'} • CNIC:{' '}
                    {student?.cnic || '35202-1928374-1'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">
                    Completion Progress
                  </span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="bg-muted border-border/50 h-2.5 w-full overflow-hidden rounded-full border">
                  <div
                    className="h-2.5 rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Verification Checklist */}
              <div className="space-y-2 text-xs">
                <div className="bg-card border-border flex items-center justify-between rounded-lg border p-2">
                  <span className="text-muted-foreground">
                    NADRA CNIC Verification
                  </span>
                  <Badge variant="approved" className="text-[10px]">
                    Verified
                  </Badge>
                </div>
                <div className="bg-card border-border flex items-center justify-between rounded-lg border p-2">
                  <span className="text-muted-foreground">
                    PQR Academic Linkage
                  </span>
                  <Badge variant="approved" className="text-[10px]">
                    2 Universities Linked
                  </Badge>
                </div>
                <div className="bg-card border-border flex items-center justify-between rounded-lg border p-2">
                  <span className="text-muted-foreground">
                    Emergency Contact & Domicile
                  </span>
                  <span className="text-[11px] font-medium text-amber-500">
                    8% Pending
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-border/50 border-t pt-2">
              <Button
                onClick={() => router.push('/profile')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full gap-1.5 text-xs font-semibold"
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
