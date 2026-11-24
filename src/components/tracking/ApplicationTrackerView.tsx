'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Building2,
  ShieldCheck,
  Send,
  ChevronDown,
  ChevronUp,
  Receipt,
  GraduationCap,
  RefreshCw,
  FileText,
  AlertCircle,
  Copy,
  Check,
  Eye,
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
import { Input } from '@/components/ui/input';
import { InlineFileDropzone } from '@/components/dynamic-form/InlineFileDropzone';
import { portalService } from '@/services/portalService';
import type {
  ApplicationDetail,
  ApplicationSummary,
  ApplicationStage,
  StageStatus,
} from '@/types/portal';

export interface ApplicationTrackerViewProps {
  initialApplicationId?: string;
  isJustSubmitted?: boolean;
}

type StatusFilterType =
  'ALL' | 'IN_PROCESS' | 'COMPLETED' | 'RESUBMIT' | 'ARCHIVED';

export function ApplicationTrackerView({
  initialApplicationId = '#APP-2024-9981',
  isJustSubmitted = false,
}: ApplicationTrackerViewProps) {
  const router = useRouter();

  // Applications list & active selection
  const [applications, setApplications] = React.useState<ApplicationSummary[]>(
    []
  );
  const [selectedAppId, setSelectedAppId] =
    React.useState<string>(initialApplicationId);
  const [activeAppDetail, setActiveAppDetail] =
    React.useState<ApplicationDetail | null>(null);
  const isLoadingDetail =
    !activeAppDetail || activeAppDetail.id !== selectedAppId;

  // Filters & Search
  const [statusFilter, setStatusFilter] =
    React.useState<StatusFilterType>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [collapsedCards, setCollapsedCards] = React.useState<
    Record<string, boolean>
  >({});

  // Interactive Re-upload State for active objection
  const [reuploadFileUrl, setReuploadFileUrl] = React.useState<string>(
    'https://storage.hec.gov.pk/mock/bs_transcript_page2_600dpi_flatbed.pdf'
  );
  const [studentNote, setStudentNote] = React.useState<string>(
    'Attached 600 DPI flatbed scan of Transcript Page 2. Grading criteria table and Controller stamp are clearly visible.'
  );
  const [activeTrailId, setActiveTrailId] = React.useState<string>('cm-02');
  const [isSubmittingResubmit, setIsSubmittingResubmit] = React.useState(false);
  const [resubmitSuccessMessage, setResubmitSuccessMessage] = React.useState<
    string | null
  >(null);
  const [copiedTracking, setCopiedTracking] = React.useState(false);

  // Load application summaries list
  React.useEffect(() => {
    let isMounted = true;
    portalService.getApplications().then((data) => {
      if (isMounted) {
        setApplications(data);
        if (!selectedAppId && data.length > 0) {
          setSelectedAppId(data[0].id);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedAppId]);

  // Load detailed tracking timeline for active application
  React.useEffect(() => {
    let isMounted = true;

    portalService
      .getApplicationTrack(selectedAppId)
      .then((detail) => {
        if (isMounted) {
          setActiveAppDetail(detail);
          // Set first actionable trail if available
          const actionable = detail.commentsTrail.find(
            (c) => c.isReuploadAllowed && !c.resolvedAt
          );
          if (actionable) {
            setActiveTrailId(actionable.id);
          }
        }
      })
      .catch((err) => {
        console.warn(
          `Application ${selectedAppId} not found, falling back to default:`,
          err
        );
        portalService.getApplicationTrack('#APP-2024-9981').then((fallback) => {
          if (isMounted) {
            setActiveAppDetail({
              ...fallback,
              id: selectedAppId,
            });
          }
        });
      });

    return () => {
      isMounted = false;
    };
  }, [selectedAppId]);

  // Handle application card click
  const handleSelectApplication = (id: string) => {
    setSelectedAppId(id);
    setResubmitSuccessMessage(null);
  };

  // Toggle card collapse
  const toggleCardCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle interactive document resubmission
  const handleResubmitDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppDetail) return;

    setIsSubmittingResubmit(true);

    try {
      const result = await portalService.resubmitDocument({
        applicationId: activeAppDetail.id,
        rejectionTrailId: activeTrailId,
        documentType: 'Transcript',
        newDocumentUrl: reuploadFileUrl,
        studentNote,
      });

      if (result.success) {
        setActiveAppDetail(result.application);
        setResubmitSuccessMessage(
          'Document correction successfully transmitted to Scrutiny Desk. Controller review has resumed.'
        );
      }
    } catch (err) {
      console.error('Failed to resubmit document:', err);
    } finally {
      setIsSubmittingResubmit(false);
    }
  };

  const copyTrackingId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  // Filter applications list
  const filteredApplications = React.useMemo(() => {
    return applications.filter((app) => {
      // Status filter
      if (statusFilter === 'IN_PROCESS' && app.status !== 'in_progress')
        return false;
      if (
        statusFilter === 'COMPLETED' &&
        app.status !== 'approved' &&
        app.status !== 'dispatched'
      )
        return false;
      if (statusFilter === 'RESUBMIT' && app.status !== 'resubmit_required')
        return false;
      if (statusFilter === 'ARCHIVED' && app.status !== 'rejected')
        return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = app.id.toLowerCase().includes(q);
        const matchesService = app.serviceName.toLowerCase().includes(q);
        const matchesStage = app.currentStage.toLowerCase().includes(q);
        if (!matchesId && !matchesService && !matchesStage) return false;
      }

      return true;
    });
  }, [applications, statusFilter, searchQuery]);

  // Status badge helper
  const renderStatusBadge = (status: string, className = '') => {
    switch (status) {
      case 'resubmit_required':
        return (
          <Badge
            variant="resubmit"
            className={`text-[10px] font-bold ${className}`}
          >
            <AlertCircle className="mr-1 size-3" />
            Action Required (Resubmit)
          </Badge>
        );
      case 'approved':
      case 'dispatched':
        return (
          <Badge
            variant="approved"
            className={`text-[10px] font-bold ${className}`}
          >
            <CheckCircle2 className="mr-1 size-3" />
            Completed & Minted
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge
            variant="inProgress"
            className={`text-[10px] font-bold ${className}`}
          >
            <Clock className="mr-1 size-3 animate-spin" />
            In Process / Scrutiny
          </Badge>
        );
      case 'rejected':
        return (
          <Badge
            variant="destructive"
            className={`text-[10px] font-bold ${className}`}
          >
            Archived & Closed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className={`text-[10px] font-bold ${className}`}
          >
            {status}
          </Badge>
        );
    }
  };

  // Stage status pill helper
  const renderStageStatusPill = (
    status: StageStatus,
    stageName: ApplicationStage
  ) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-3" />
            {stageName === 'completed_dispatched'
              ? 'MINTED'
              : stageName === 'submitted'
                ? 'PAID / SUBMITTED'
                : 'COMPLETED'}
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex animate-pulse items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-700 dark:text-amber-300">
            <Clock className="size-3" />
            IN PROGRESS
          </span>
        );
      case 'resubmit_required':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-rose-700 dark:text-rose-300">
            <AlertTriangle className="size-3" />
            REJECTED / RESUBMIT
          </span>
        );
      default:
        return (
          <span className="bg-muted text-muted-foreground border-border inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold">
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Submission Confirmation Banner (When arriving from application wizard) */}
      {isJustSubmitted && (
        <div className="animate-in fade-in slide-in-from-top-4 flex flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-950 shadow-sm duration-500 sm:flex-row sm:items-center dark:text-emerald-100">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
              <CheckCircle2 className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-emerald-800 sm:text-base dark:text-emerald-200">
                Application Transmitted to HEC Worker Portal Scrutiny Queue
              </h3>
              <p className="max-w-2xl text-xs leading-relaxed text-emerald-700 dark:text-emerald-300">
                Your attestation dossier (<strong>{selectedAppId}</strong>) has
                been logged in the Synapark workflow engine. Preliminary
                verification by the Scrutiny Desk is underway. You will receive
                real-time alerts as controllers endorse each stage.
              </p>
            </div>
          </div>
          <Badge
            variant="approved"
            className="shrink-0 px-3 py-1 text-xs font-semibold"
          >
            Stage: Preliminary Scrutiny
          </Badge>
        </div>
      )}

      {/* 2. Top Header & Breadcrumbs */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="space-y-0.5">
          <h2 className="text-foreground flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
            <ShieldCheck className="text-primary size-6" />
            <span>HEC Attestation Tracking & Verification Ledger</span>
          </h2>
          <p className="text-muted-foreground text-xs">
            Monitor real-time scrutiny progress across Manager, Scrutiny, L1/L2
            Controllers, and Security Vault wings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/apply')}
            className="gap-1.5 text-xs font-semibold"
          >
            <FileText className="size-3.5" />
            <span>New Application</span>
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => router.push('/assets')}
            className="bg-primary text-primary-foreground gap-1.5 text-xs font-semibold"
          >
            <GraduationCap className="size-3.5" />
            <span>Digital Vault Assets</span>
          </Button>
        </div>
      </div>

      {/* 3. Main Two-Column Grid: Left Application Selector + Right Vertical Stage Timeline */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column (5 Cols): Application Selector & Status Filter */}
        <div className="space-y-4 lg:col-span-5">
          <Card className="border-border shadow-sm">
            <CardHeader className="border-border space-y-3 border-b pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                  <Filter className="text-primary size-3.5" />
                  <span>Application Selector & Status Filter</span>
                </CardTitle>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {filteredApplications.length} of {applications.length}
                </Badge>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'ALL', label: 'All' },
                  { key: 'IN_PROCESS', label: 'In Process' },
                  { key: 'RESUBMIT', label: 'Resubmit' },
                  { key: 'COMPLETED', label: 'Completed' },
                  { key: 'ARCHIVED', label: 'Archived' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key as StatusFilterType)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      statusFilter === tab.key
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="text-muted-foreground absolute top-2.5 left-3 size-3.5" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by ID (e.g. #APP-2024-9981) or degree..."
                  className="h-8 pl-8 text-xs"
                />
              </div>
            </CardHeader>

            <CardContent className="max-h-[640px] space-y-2.5 overflow-y-auto p-3">
              {filteredApplications.length === 0 ? (
                <div className="text-muted-foreground space-y-2 p-8 text-center text-xs">
                  <AlertCircle className="text-muted-foreground mx-auto size-6" />
                  <p>No applications match the selected status filter.</p>
                </div>
              ) : (
                filteredApplications.map((app) => {
                  const isSelected = app.id === selectedAppId;
                  const isCollapsed = collapsedCards[app.id];

                  return (
                    <div
                      key={app.id}
                      onClick={() => handleSelectApplication(app.id)}
                      className={`relative cursor-pointer rounded-xl border p-3.5 transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-500/5 shadow-sm ring-1 ring-emerald-500/30'
                          : 'border-border bg-card hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-foreground bg-muted border-border rounded border px-2 py-0.5 font-mono text-xs font-bold">
                              {app.id}
                            </span>
                            {renderStatusBadge(app.status)}
                          </div>
                          <h4 className="text-foreground truncate text-xs font-bold">
                            {app.serviceName}
                          </h4>
                          <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
                            <span>
                              Submitted:{' '}
                              {new Date(app.submittedAt).toLocaleDateString()}
                            </span>
                            <span>&bull;</span>
                            <span className="text-foreground font-mono font-medium">
                              PKR {app.amountPaid.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => toggleCardCollapse(app.id, e)}
                          className="text-muted-foreground hover:text-foreground rounded-md p-1"
                        >
                          {isCollapsed ? (
                            <ChevronDown className="size-4" />
                          ) : (
                            <ChevronUp className="size-4" />
                          )}
                        </button>
                      </div>

                      {/* Expandable summary snippet */}
                      {!isCollapsed && (
                        <div className="border-border/60 mt-2.5 space-y-1.5 border-t pt-2 text-xs">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground">
                              Current Pipeline Stage:
                            </span>
                            <span className="text-primary font-semibold">
                              {app.currentStage}
                            </span>
                          </div>
                          {app.actionRequired && app.actionMessage && (
                            <div className="flex items-start gap-1.5 rounded border border-rose-500/20 bg-rose-500/10 p-2 text-[11px] text-rose-700 dark:text-rose-300">
                              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                              <span>{app.actionMessage}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (7 Cols): Vertical Stage Timeline & Worker Comments */}
        <div className="space-y-6 lg:col-span-7">
          {isLoadingDetail || !activeAppDetail ? (
            <Card className="border-border p-12 text-center shadow-sm">
              <RefreshCw className="text-primary mx-auto mb-3 size-8 animate-spin" />
              <h3 className="text-foreground text-base font-bold">
                Retrieving Dossier Verification Pipeline...
              </h3>
              <p className="text-muted-foreground mt-1 text-xs">
                Querying Synapark workflow engine for {selectedAppId}.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Active Application Dossier Header */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-xl">
                <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

                <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-xs font-bold text-emerald-400">
                        {activeAppDetail.id}
                      </span>
                      {renderStatusBadge(activeAppDetail.overallStatus)}
                    </div>

                    <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                      {activeAppDetail.serviceType}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <span className="flex items-center gap-1 font-mono">
                        Tracking ID:{' '}
                        <strong className="text-emerald-400">
                          {activeAppDetail.trackingId}
                        </strong>
                        <button
                          type="button"
                          onClick={() =>
                            copyTrackingId(activeAppDetail.trackingId)
                          }
                          className="ml-1 hover:text-white"
                        >
                          {copiedTracking ? (
                            <Check className="size-3 text-emerald-400" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      </span>
                      <span>&bull;</span>
                      <span>
                        Logged:{' '}
                        {new Date(
                          activeAppDetail.submittedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center">
                    {activeAppDetail.overallStatus === 'approved' ||
                    activeAppDetail.overallStatus === 'dispatched' ? (
                      <Button
                        type="button"
                        onClick={() => router.push('/assets')}
                        className="gap-1.5 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500"
                      >
                        <Eye className="size-3.5" />
                        <span>View Degree</span>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Resubmit Success Alert if resolved */}
              {resubmitSuccessMessage && (
                <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-900 dark:text-emerald-200">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  <span>{resubmitSuccessMessage}</span>
                </div>
              )}

              {/* 4. Vertical Stage Timeline Card */}
              <Card className="border-border shadow-sm">
                <CardHeader className="border-border border-b pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground flex items-center gap-2 text-sm font-bold">
                      <Clock className="text-primary size-4" />
                      <span>
                        HEC Worker Portal Scrutiny & Approval Pipeline
                      </span>
                    </CardTitle>
                    <span className="text-muted-foreground font-mono text-xs">
                      Stage {activeAppDetail.currentStageIndex + 1} of{' '}
                      {activeAppDetail.totalStages}
                    </span>
                  </div>
                  <CardDescription className="text-muted-foreground text-xs">
                    Sequential verification across Scrutiny Desk, Accreditation
                    Assistant Director (L1), and Attestation Directorate (L2).
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8 pt-6 pb-6">
                  {/* Vertical Timeline Nodes */}
                  <div className="before:bg-border relative space-y-8 pl-6 before:absolute before:top-2 before:bottom-2 before:left-3 before:w-0.5 sm:pl-8">
                    {activeAppDetail.stages.map((stage, idx) => {
                      const isCompleted = stage.status === 'approved';
                      const isInProgress = stage.status === 'in_progress';
                      const isRejected =
                        stage.status === 'resubmit_required' ||
                        stage.status === 'rejected';

                      // Find stage-wise reviewer comments if any
                      const stageComments =
                        activeAppDetail.commentsTrail.filter(
                          (c) => c.stage === stage.stage
                        );

                      return (
                        <div key={stage.stage} className="group relative">
                          {/* Node Icon on Vertical Line */}
                          <div
                            className={`ring-background absolute top-0 -left-6 flex size-6 items-center justify-center rounded-full text-xs font-bold ring-4 transition-all sm:-left-8 sm:size-7 ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : isInProgress
                                  ? 'animate-pulse bg-amber-500 text-white ring-amber-500/20'
                                  : isRejected
                                    ? 'bg-rose-600 text-white ring-rose-500/20'
                                    : 'bg-muted text-muted-foreground border-border border'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="size-3.5" />
                            ) : isRejected ? (
                              <AlertTriangle className="size-3.5" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>

                          {/* Stage Content */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h4 className="text-foreground text-xs font-bold sm:text-sm">
                                {stage.title}
                              </h4>
                              {renderStageStatusPill(stage.status, stage.stage)}
                            </div>

                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {stage.description}
                            </p>

                            {/* Stage Worker Card */}
                            {stage.assignedWorker && (
                              <div className="border-border/60 bg-muted/20 flex items-center gap-2.5 rounded-lg border p-2.5 text-xs">
                                <Building2 className="text-primary size-4 shrink-0" />
                                <div className="space-y-0.5 text-[11px]">
                                  <span className="text-foreground font-semibold">
                                    {stage.assignedWorker.name}
                                  </span>
                                  <span className="text-muted-foreground block">
                                    {stage.assignedWorker.role} &bull;{' '}
                                    {stage.assignedWorker.department}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Timestamps */}
                            <div className="text-muted-foreground flex items-center gap-3 font-mono text-[10px]">
                              {stage.startedAt && (
                                <span>
                                  Started:{' '}
                                  {new Date(stage.startedAt).toLocaleString(
                                    [],
                                    { dateStyle: 'short', timeStyle: 'short' }
                                  )}
                                </span>
                              )}
                              {stage.completedAt && (
                                <span>
                                  &bull; Completed:{' '}
                                  {new Date(stage.completedAt).toLocaleString(
                                    [],
                                    { dateStyle: 'short', timeStyle: 'short' }
                                  )}
                                </span>
                              )}
                            </div>

                            {/* 5. Stage-Wise Comments & Rejection Trail Panel */}
                            {stageComments.length > 0 && (
                              <div className="mt-3 space-y-3 pt-2">
                                <span className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                                  <AlertCircle className="text-primary size-3.5" />
                                  <span>
                                    Reviewer Observations & Objections
                                  </span>
                                </span>

                                {stageComments.map((comment) => (
                                  <div
                                    key={comment.id}
                                    className={`space-y-3 rounded-xl border p-4 text-xs ${
                                      comment.type === 'resubmit_required'
                                        ? 'border-rose-500/30 bg-rose-500/5'
                                        : 'border-border bg-muted/30'
                                    }`}
                                  >
                                    <div className="border-border/40 flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant={
                                            comment.type === 'resubmit_required'
                                              ? 'resubmit'
                                              : 'secondary'
                                          }
                                          className="text-[9px]"
                                        >
                                          {comment.type === 'resubmit_required'
                                            ? 'Objection / Resubmit'
                                            : 'Observation'}
                                        </Badge>
                                        <span className="text-foreground font-semibold">
                                          {comment.reviewerName} (
                                          {comment.reviewerRole})
                                        </span>
                                      </div>
                                      <span className="text-muted-foreground font-mono text-[10px]">
                                        {new Date(
                                          comment.createdAt
                                        ).toLocaleString()}
                                      </span>
                                    </div>

                                    {/* Comment Text */}
                                    <blockquote className="text-foreground border-primary/40 border-l-2 pl-3 leading-relaxed italic">
                                      &ldquo;{comment.comment}&rdquo;
                                    </blockquote>

                                    {comment.rejectionReason && (
                                      <div className="text-[11px] font-medium text-rose-700 dark:text-rose-300">
                                        <strong>Specific Defect:</strong>{' '}
                                        {comment.rejectionReason}
                                      </div>
                                    )}

                                    {/* Resolved status or Interactive Resubmission Form */}
                                    {comment.resolvedAt ? (
                                      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-[11px] text-emerald-800 dark:text-emerald-300">
                                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                                        <span>
                                          Resolved on{' '}
                                          {new Date(
                                            comment.resolvedAt
                                          ).toLocaleDateString()}
                                          : Student submitted updated scan.
                                        </span>
                                      </div>
                                    ) : comment.isReuploadAllowed ? (
                                      <form
                                        onSubmit={handleResubmitDocument}
                                        className="border-border bg-card mt-3 space-y-3 rounded-xl border p-3.5 text-xs"
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="text-foreground flex items-center gap-1.5 font-bold">
                                            <Upload className="text-primary size-3.5" />
                                            <span>
                                              Action Required: Re-upload
                                              Corrected Scan
                                            </span>
                                          </span>
                                          <Badge
                                            variant="outline"
                                            className="text-[9px]"
                                          >
                                            Target:{' '}
                                            {comment.affectedDocumentType ||
                                              'Transcript'}
                                          </Badge>
                                        </div>

                                        <InlineFileDropzone
                                          label="Upload High-Resolution 600 DPI Scan"
                                          fieldName="reuploadDoc"
                                          value={reuploadFileUrl}
                                          helpText="Attach a clean, uncropped, flatbed scan of the requested page (PDF, JPG under 5MB)."
                                          onFileChange={(url) =>
                                            setReuploadFileUrl(url || '')
                                          }
                                        />

                                        <div className="space-y-1">
                                          <label className="text-foreground block text-[11px] font-semibold">
                                            Applicant Response & Clarification
                                          </label>
                                          <textarea
                                            value={studentNote}
                                            onChange={(e) =>
                                              setStudentNote(e.target.value)
                                            }
                                            rows={2}
                                            className="border-border bg-background w-full rounded-lg border p-2.5 text-xs"
                                            placeholder="Explain what was corrected..."
                                          />
                                        </div>

                                        <Button
                                          type="submit"
                                          disabled={isSubmittingResubmit}
                                          className="w-full gap-1.5 bg-emerald-600 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500"
                                        >
                                          {isSubmittingResubmit ? (
                                            <>
                                              <RefreshCw className="size-3.5 animate-spin" />
                                              <span>
                                                Transmitting Updated Scan to
                                                Scrutiny Desk...
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <Send className="size-3.5" />
                                              <span>
                                                Submit Document Correction to
                                                Scrutiny Wing
                                              </span>
                                            </>
                                          )}
                                        </Button>
                                      </form>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 6. Attested Degrees & PSID Voucher Card */}
              <Card className="border-border shadow-sm">
                <CardHeader className="border-border border-b pb-3">
                  <CardTitle className="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                    <Receipt className="text-primary size-3.5" />
                    <span>Attached Degrees & Billing Settlement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4 text-xs">
                  {/* Selected Degrees List */}
                  {activeAppDetail.selectedDegrees.map((deg) => (
                    <div
                      key={deg.academicRecordId}
                      className="border-border bg-muted/10 space-y-2 rounded-xl border p-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-foreground font-bold">
                          {deg.programTitle}
                        </span>
                        <span className="font-mono font-bold text-emerald-600">
                          PKR {deg.itemTotal.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        {deg.universityOrBoard} &bull; Graduated:{' '}
                        {deg.passingYear} &bull; Roll: {deg.rollNumber}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {deg.selectedDocuments.map((doc, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-[9px]"
                          >
                            {doc.type} (
                            {doc.attestOriginal
                              ? 'Original'
                              : `${doc.copiesCount} copies`}
                            )
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* 1-Link PSID Settlement Details */}
                  <div className="border-border bg-muted/30 flex items-center justify-between rounded-xl border p-3">
                    <div>
                      <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                        Settled via 1-Link PSID
                      </span>
                      <span className="text-foreground font-mono font-bold">
                        {activeAppDetail.challan.psid}
                      </span>
                    </div>
                    <Badge variant="approved" className="text-[9px]">
                      Fee Paid: PKR{' '}
                      {activeAppDetail.challan.totalAmount.toLocaleString()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
