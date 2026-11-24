'use client';

import * as React from 'react';
import {
  GraduationCap,
  User,
  Edit2,
  FileCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  Building2,
  Receipt,
  FileText,
  AlertCircle,
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
import { Label } from '@/components/ui/label';
import type {
  AttestedDegreeSelection,
  SelectedDocumentItem,
} from '@/types/portal';

export interface StepReviewAndDegreeSelectionProps {
  formValues: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onJumpToStep: (stepIndex: number) => void;
}

interface DegreeItemConfig {
  id: string;
  degreeLevel: string;
  programTitle: string;
  universityOrBoard: string;
  passingYear: number;
  rollNumber: string;
  registrationNumber: string;
  status: 'verified' | 'pending';
  attestOriginalDegree: boolean;
  degreeCopies: number;
  attestOriginalTranscript: boolean;
  transcriptCopies: number;
  attestProvisional: boolean;
  attestEquivalence: boolean;
}

export function StepReviewAndDegreeSelection({
  formValues,
  onChange,
  onJumpToStep,
}: StepReviewAndDegreeSelectionProps) {
  // Personal info review from formValues or fallbacks
  const fullName = (formValues.fullName as string) || 'Muhammad Usman';
  const fatherName =
    (formValues.fatherOrHusbandName as string) || 'Tariq Mehmood';
  const cnic = (formValues.cnic as string) || '35202-1234567-1';
  const dateOfBirth = (formValues.dateOfBirth as string) || '1998-05-12';
  const gender = (formValues.gender as string) || 'male';
  const email = (formValues.email as string) || 'usman@example.com';
  const mobile = (formValues.mobileNumber as string) || '+92-300-1234567';
  const address =
    (formValues.addressLine1 as string) || 'Street 4, Sector G-10/2';
  const city = (formValues.city as string) || 'Islamabad';

  // Degrees available for attestation (higher education qualifications)
  const [degrees, setDegrees] = React.useState<DegreeItemConfig[]>([
    {
      id: 'deg-01',
      degreeLevel: 'Bachelor Degree (4-Year BS / 16 Years)',
      programTitle: 'Bachelor of Science in Software Engineering',
      universityOrBoard:
        'National University of Sciences and Technology (NUST)',
      passingYear: 2024,
      rollNumber: 'NUST-2020-SE-041',
      registrationNumber: '00000291024',
      status: 'verified',
      attestOriginalDegree: true,
      degreeCopies: 1,
      attestOriginalTranscript: true,
      transcriptCopies: 1,
      attestProvisional: false,
      attestEquivalence: false,
    },
    {
      id: 'deg-02',
      degreeLevel: 'Bachelor Degree (2-Year Pass / 14 Years)',
      programTitle: 'Associate Degree in Computer Studies',
      universityOrBoard: 'University of the Punjab',
      passingYear: 2020,
      rollNumber: 'PU-2018-CS-819',
      registrationNumber: '00000182741',
      status: 'verified',
      attestOriginalDegree: false,
      degreeCopies: 0,
      attestOriginalTranscript: false,
      transcriptCopies: 0,
      attestProvisional: false,
      attestEquivalence: false,
    },
  ]);

  const [deliveryMode, setDeliveryMode] = React.useState<
    'courier' | 'walkin_urgent'
  >('courier');
  const [selectedCenter, setSelectedCenter] = React.useState<string>('isb-h9');

  // Dynamic fee calculation
  const calculations = React.useMemo(() => {
    let totalDocsCount = 0;
    let originalDegreeFee = 0;
    let degreeCopiesFee = 0;
    let originalTranscriptFee = 0;
    let transcriptCopiesFee = 0;
    let provisionalFee = 0;
    let equivalenceFee = 0;

    const selections: AttestedDegreeSelection[] = [];

    for (const deg of degrees) {
      const selectedDocs: SelectedDocumentItem[] = [];
      let itemTotal = 0;

      if (deg.attestOriginalDegree) {
        totalDocsCount += 1;
        originalDegreeFee += 1000;
        itemTotal += 1000;
        selectedDocs.push({
          type: 'Degree',
          attestOriginal: true,
          copiesCount: 0,
          originalFee: 1000,
          copyFee: 0,
          subtotal: 1000,
        });
      }

      if (deg.degreeCopies > 0) {
        totalDocsCount += deg.degreeCopies;
        const cCost = deg.degreeCopies * 700;
        degreeCopiesFee += cCost;
        itemTotal += cCost;
        selectedDocs.push({
          type: 'Degree',
          attestOriginal: false,
          copiesCount: deg.degreeCopies,
          originalFee: 0,
          copyFee: 700,
          subtotal: cCost,
        });
      }

      if (deg.attestOriginalTranscript) {
        totalDocsCount += 1;
        originalTranscriptFee += 1000;
        itemTotal += 1000;
        selectedDocs.push({
          type: 'Transcript',
          attestOriginal: true,
          copiesCount: 0,
          originalFee: 1000,
          copyFee: 0,
          subtotal: 1000,
        });
      }

      if (deg.transcriptCopies > 0) {
        totalDocsCount += deg.transcriptCopies;
        const cCost = deg.transcriptCopies * 700;
        transcriptCopiesFee += cCost;
        itemTotal += cCost;
        selectedDocs.push({
          type: 'Transcript',
          attestOriginal: false,
          copiesCount: deg.transcriptCopies,
          originalFee: 0,
          copyFee: 700,
          subtotal: cCost,
        });
      }

      if (deg.attestProvisional) {
        totalDocsCount += 1;
        provisionalFee += 800;
        itemTotal += 800;
        selectedDocs.push({
          type: 'Provisional_Certificate',
          attestOriginal: true,
          copiesCount: 0,
          originalFee: 800,
          copyFee: 0,
          subtotal: 800,
        });
      }

      if (deg.attestEquivalence) {
        totalDocsCount += 1;
        equivalenceFee += 1500;
        itemTotal += 1500;
        selectedDocs.push({
          type: 'Equivalence_Certificate',
          attestOriginal: true,
          copiesCount: 0,
          originalFee: 1500,
          copyFee: 0,
          subtotal: 1500,
        });
      }

      if (selectedDocs.length > 0) {
        selections.push({
          academicRecordId: deg.id,
          degreeLevel: deg.degreeLevel,
          programTitle: deg.programTitle,
          universityOrBoard: deg.universityOrBoard,
          passingYear: deg.passingYear,
          rollNumber: deg.rollNumber,
          registrationNumber: deg.registrationNumber,
          selectedDocuments: selectedDocs,
          itemTotal,
        });
      }
    }

    const courierFee = deliveryMode === 'courier' ? 300 : 0;
    const subtotal =
      originalDegreeFee +
      degreeCopiesFee +
      originalTranscriptFee +
      transcriptCopiesFee +
      provisionalFee +
      equivalenceFee;
    const totalAmount = subtotal + courierFee;

    return {
      totalDocsCount,
      originalDegreeFee,
      degreeCopiesFee,
      originalTranscriptFee,
      transcriptCopiesFee,
      provisionalFee,
      equivalenceFee,
      courierFee,
      subtotal,
      totalAmount,
      selections,
    };
  }, [degrees, deliveryMode]);

  // Synchronize with parent wizard
  React.useEffect(() => {
    onChange('attestationSelection', calculations.selections);
    onChange('totalAmount', calculations.totalAmount);
    onChange('deliveryMode', deliveryMode);
    onChange('hecCenter', selectedCenter);
  }, [calculations, deliveryMode, selectedCenter, onChange]);

  const updateDegree = (id: string, updates: Partial<DegreeItemConfig>) => {
    setDegrees((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Review Summary Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-foreground flex items-center gap-2 text-base font-bold sm:text-lg">
              <FileCheck className="text-primary size-5" />
              <span>Step 3: Application Review & Degree Selection</span>
            </h3>
            <p className="text-muted-foreground text-xs">
              Review personal details and academic credentials before selecting
              exact documents for attestation.
            </p>
          </div>
          <Badge
            variant="outline"
            className="text-primary border-primary/30 font-mono text-xs"
          >
            Step 3 of 5
          </Badge>
        </div>

        {/* Two Review Cards: Personal Details & Academic History */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Personal Details Review Box */}
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                <User className="text-primary size-4" />
                <span>Personal Information</span>
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onJumpToStep(0)}
                className="text-primary hover:text-primary/80 h-7 gap-1 px-2 text-xs font-semibold"
              >
                <Edit2 className="size-3" />
                <span>Edit Step 1</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">
                    Full Name
                  </span>
                  <span className="text-foreground font-semibold">
                    {fullName}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">
                    Father / Husband
                  </span>
                  <span className="text-foreground font-semibold">
                    {fatherName}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">
                    CNIC Number
                  </span>
                  <span className="text-primary font-mono font-bold">
                    {cnic}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">
                    Date of Birth
                  </span>
                  <span className="text-foreground">
                    {dateOfBirth} ({gender})
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">
                    Contact Phone
                  </span>
                  <span className="text-foreground">{mobile}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">
                    Email Address
                  </span>
                  <span className="text-foreground block truncate">
                    {email}
                  </span>
                </div>
              </div>
              <div className="border-border border-t pt-2">
                <span className="text-muted-foreground block text-[10px] uppercase">
                  Postal Address
                </span>
                <span className="text-foreground block truncate">
                  {address}, {city}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Academic History Review Box */}
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                <GraduationCap className="text-primary size-4" />
                <span>Academic Records</span>
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onJumpToStep(1)}
                className="text-primary hover:text-primary/80 h-7 gap-1 px-2 text-xs font-semibold"
              >
                <Edit2 className="size-3" />
                <span>Edit Step 2</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="space-y-2">
                <div className="bg-muted/40 border-border/50 flex items-center justify-between rounded-lg border p-2">
                  <div>
                    <span className="text-foreground block text-xs font-semibold">
                      Secondary School Certificate (Matric / O-Level)
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      BISE Lahore &bull; Passing Year: 2018 &bull; Marks:
                      982/1100
                    </span>
                  </div>
                  <Badge variant="approved" className="text-[9px]">
                    PQR Verified
                  </Badge>
                </div>

                <div className="bg-muted/40 border-border/50 flex items-center justify-between rounded-lg border p-2">
                  <div>
                    <span className="text-foreground block text-xs font-semibold">
                      Higher Secondary Certificate (FSc Pre-Engineering)
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      BISE Rawalpindi &bull; Passing Year: 2020 &bull; Marks:
                      940/1100
                    </span>
                  </div>
                  <Badge variant="approved" className="text-[9px]">
                    PQR Verified
                  </Badge>
                </div>

                <div className="bg-muted/40 border-border/50 flex items-center justify-between rounded-lg border p-2">
                  <div>
                    <span className="text-foreground block text-xs font-semibold">
                      Bachelor of Science in Software Engineering
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      NUST Islamabad &bull; Passing Year: 2024 &bull; CGPA:
                      3.82/4.00
                    </span>
                  </div>
                  <Badge variant="inProgress" className="text-[9px]">
                    Attestation Ready
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2. Main Attestation Selection & Sticky Summary Grid */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Degree Cards & Document Checkboxes */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h4 className="text-foreground flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Select Degrees & Certificates for Attestation</span>
            </h4>
            <span className="text-muted-foreground text-xs">
              Statutory Fee: Original PKR 1,000 | Copy PKR 700
            </span>
          </div>

          {degrees.map((deg) => {
            const hasAnySelected =
              deg.attestOriginalDegree ||
              deg.degreeCopies > 0 ||
              deg.attestOriginalTranscript ||
              deg.transcriptCopies > 0 ||
              deg.attestProvisional ||
              deg.attestEquivalence;

            return (
              <Card
                key={deg.id}
                className={`border transition-all ${
                  hasAnySelected
                    ? 'bg-card border-emerald-600/40 shadow-sm ring-1 ring-emerald-500/10'
                    : 'border-border bg-card/60'
                }`}
              >
                <CardHeader className="border-border/60 border-b pb-3">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            deg.status === 'verified' ? 'approved' : 'secondary'
                          }
                          className="text-[10px] font-bold"
                        >
                          {deg.status === 'verified' ? (
                            <>
                              <CheckCircle2 className="mr-1 size-3" />
                              PQR Gazette Verified
                            </>
                          ) : (
                            <>
                              <Clock className="mr-1 size-3" />
                              Pending Verification
                            </>
                          )}
                        </Badge>
                        <span className="text-muted-foreground font-mono text-xs">
                          Roll: {deg.rollNumber}
                        </span>
                      </div>
                      <CardTitle className="text-foreground text-sm font-bold sm:text-base">
                        {deg.programTitle}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-xs">
                        {deg.universityOrBoard} &bull; Graduated{' '}
                        {deg.passingYear} &bull; Reg: {deg.registrationNumber}
                      </CardDescription>
                    </div>

                    <Badge
                      variant="outline"
                      className="self-start font-mono text-xs sm:self-center"
                    >
                      {deg.degreeLevel.split('(')[0].trim()}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  {/* Document Checkboxes Matrix */}
                  <div className="space-y-3">
                    <span className="text-muted-foreground block text-[11px] font-bold tracking-wider uppercase">
                      Documents for Forensic Verification & Embossing:
                    </span>

                    {/* 1. Degree Parchment (Sanad) */}
                    <div className="border-border bg-muted/20 flex flex-col justify-between gap-3 rounded-xl border p-3 sm:flex-row sm:items-center">
                      <div className="flex items-start gap-2.5">
                        <Checkbox
                          id={`deg-orig-${deg.id}`}
                          checked={deg.attestOriginalDegree}
                          onCheckedChange={(c) =>
                            updateDegree(deg.id, {
                              attestOriginalDegree: Boolean(c),
                            })
                          }
                          className="mt-0.5"
                        />
                        <div className="space-y-0.5">
                          <label
                            htmlFor={`deg-orig-${deg.id}`}
                            className="text-foreground block cursor-pointer text-xs font-bold"
                          >
                            Original Degree Parchment (Sanad)
                          </label>
                          <p className="text-muted-foreground text-[11px]">
                            Embossed with forensic HEC hologram seal & dynamic
                            QR code
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          PKR 1,000
                        </span>
                        <div className="border-border flex items-center gap-1.5 border-l pl-3">
                          <span className="text-muted-foreground text-[11px]">
                            Photocopies:
                          </span>
                          <select
                            value={deg.degreeCopies}
                            onChange={(e) =>
                              updateDegree(deg.id, {
                                degreeCopies: Number(e.target.value),
                              })
                            }
                            className="border-border bg-background h-7 rounded-md border px-2 font-mono text-xs"
                          >
                            <option value={0}>0 copies</option>
                            <option value={1}>1 copy (+PKR 700)</option>
                            <option value={2}>2 copies (+PKR 1,400)</option>
                            <option value={3}>3 copies (+PKR 2,100)</option>
                            <option value={4}>4 copies (+PKR 2,800)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 2. Official Transcript / DMC */}
                    <div className="border-border bg-muted/20 flex flex-col justify-between gap-3 rounded-xl border p-3 sm:flex-row sm:items-center">
                      <div className="flex items-start gap-2.5">
                        <Checkbox
                          id={`trans-orig-${deg.id}`}
                          checked={deg.attestOriginalTranscript}
                          onCheckedChange={(c) =>
                            updateDegree(deg.id, {
                              attestOriginalTranscript: Boolean(c),
                            })
                          }
                          className="mt-0.5"
                        />
                        <div className="space-y-0.5">
                          <label
                            htmlFor={`trans-orig-${deg.id}`}
                            className="text-foreground block cursor-pointer text-xs font-bold"
                          >
                            Official Transcript / Detailed Marks Certificate
                            (DMC)
                          </label>
                          <p className="text-muted-foreground text-[11px]">
                            Comprehensive grade sheet attestation with
                            institutional ink stamp
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          PKR 1,000
                        </span>
                        <div className="border-border flex items-center gap-1.5 border-l pl-3">
                          <span className="text-muted-foreground text-[11px]">
                            Photocopies:
                          </span>
                          <select
                            value={deg.transcriptCopies}
                            onChange={(e) =>
                              updateDegree(deg.id, {
                                transcriptCopies: Number(e.target.value),
                              })
                            }
                            className="border-border bg-background h-7 rounded-md border px-2 font-mono text-xs"
                          >
                            <option value={0}>0 copies</option>
                            <option value={1}>1 copy (+PKR 700)</option>
                            <option value={2}>2 copies (+PKR 1,400)</option>
                            <option value={3}>3 copies (+PKR 2,100)</option>
                            <option value={4}>4 copies (+PKR 2,800)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 3. Provisional & Equivalence Certificates */}
                    <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                      {/* Provisional Certificate */}
                      <div className="border-border bg-muted/10 flex items-center justify-between rounded-xl border p-2.5">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`prov-${deg.id}`}
                            checked={deg.attestProvisional}
                            onCheckedChange={(c) =>
                              updateDegree(deg.id, {
                                attestProvisional: Boolean(c),
                              })
                            }
                          />
                          <label
                            htmlFor={`prov-${deg.id}`}
                            className="text-foreground cursor-pointer text-xs font-medium"
                          >
                            Provisional Certificate
                          </label>
                        </div>
                        <span className="text-muted-foreground font-mono text-xs font-bold">
                          PKR 800
                        </span>
                      </div>

                      {/* Equivalence Certificate of HEC */}
                      <div className="border-border bg-muted/10 flex items-center justify-between rounded-xl border p-2.5">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`equiv-${deg.id}`}
                            checked={deg.attestEquivalence}
                            onCheckedChange={(c) =>
                              updateDegree(deg.id, {
                                attestEquivalence: Boolean(c),
                              })
                            }
                          />
                          <label
                            htmlFor={`equiv-${deg.id}`}
                            className="text-foreground cursor-pointer text-xs font-medium"
                          >
                            Equivalence Certificate
                          </label>
                        </div>
                        <span className="text-muted-foreground font-mono text-xs font-bold">
                          PKR 1,500
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Delivery & Dispatch Options */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground flex items-center gap-2 text-sm font-bold">
                <Truck className="text-primary size-4" />
                <span>Document Return & Delivery Channel</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Select whether attested documents should be returned via secure
                courier or collected in person.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                    deliveryMode === 'courier'
                      ? 'border-emerald-600 bg-emerald-500/5 ring-1 ring-emerald-500/20'
                      : 'border-border bg-card hover:bg-muted/30'
                  }`}
                  onClick={() => setDeliveryMode('courier')}
                >
                  <input
                    type="radio"
                    name="deliveryMode"
                    value="courier"
                    id="mode-courier"
                    checked={deliveryMode === 'courier'}
                    onChange={() => setDeliveryMode('courier')}
                    className="mt-0.5 size-4 accent-emerald-600"
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="mode-courier"
                      className="block cursor-pointer text-xs font-bold"
                    >
                      Courier Delivery (TCS / Leopard)
                    </Label>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Secure insured doorstep return with real-time tracking (+
                      PKR 300).
                    </p>
                  </div>
                </div>

                <div
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                    deliveryMode === 'walkin_urgent'
                      ? 'border-emerald-600 bg-emerald-500/5 ring-1 ring-emerald-500/20'
                      : 'border-border bg-card hover:bg-muted/30'
                  }`}
                  onClick={() => setDeliveryMode('walkin_urgent')}
                >
                  <input
                    type="radio"
                    name="deliveryMode"
                    value="walkin_urgent"
                    id="mode-walkin"
                    checked={deliveryMode === 'walkin_urgent'}
                    onChange={() => setDeliveryMode('walkin_urgent')}
                    className="mt-0.5 size-4 accent-emerald-600"
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="mode-walkin"
                      className="block cursor-pointer text-xs font-bold"
                    >
                      Urgent Walk-in Counter Collection
                    </Label>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Collect directly from your designated HEC Regional Centre
                      counter (PKR 0).
                    </p>
                  </div>
                </div>
              </div>

              {deliveryMode === 'walkin_urgent' && (
                <div className="border-border bg-muted/30 space-y-2 rounded-xl border p-3">
                  <Label className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                    <Building2 className="text-primary size-3.5" />
                    <span>Select HEC Regional Center for Collection</span>
                  </Label>
                  <select
                    value={selectedCenter}
                    onChange={(e) => setSelectedCenter(e.target.value)}
                    className="border-border bg-background h-9 w-full rounded-lg border px-3 text-xs"
                  >
                    <option value="isb-h9">
                      HEC Secretariat, Sector H-9, Islamabad
                    </option>
                    <option value="lhr-gulberg">
                      HEC Regional Centre, Lahore (55-B/2, Gulberg III)
                    </option>
                    <option value="khi-ku">
                      HEC Regional Centre, Karachi (Karachi University Campus)
                    </option>
                    <option value="pesh-hayatabad">
                      HEC Regional Centre, Peshawar (Phase-V, Hayatabad)
                    </option>
                    <option value="qta-chaman">
                      HEC Regional Centre, Quetta (Chaman Housing Scheme)
                    </option>
                  </select>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Sticky E-Challan Summary Card */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:col-span-1">
          <Card className="border-border bg-card shadow-md">
            <CardHeader className="border-border border-b pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground flex items-center gap-1.5 text-sm font-bold">
                  <Receipt className="text-primary size-4" />
                  <span>E-Challan Summary</span>
                </CardTitle>
                <Badge variant="inProgress" className="text-[9px]">
                  Real-time Quote
                </Badge>
              </div>
              <CardDescription className="text-muted-foreground text-[11px]">
                Statutory attestation fee schedule as per HEC Financial
                Regulation 2024.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3.5 pt-4 text-xs">
              {/* Document Count Metric */}
              <div className="border-border/60 flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">
                  Selected Documents:
                </span>
                <span className="text-foreground font-mono font-bold">
                  {calculations.totalDocsCount} Item
                  {calculations.totalDocsCount !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Itemized Fee Breakdown */}
              <div className="space-y-2">
                {calculations.originalDegreeFee > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <FileText className="size-3 text-emerald-500" />
                      Original Degree(s):
                    </span>
                    <span className="text-foreground font-mono">
                      PKR {calculations.originalDegreeFee.toLocaleString()}
                    </span>
                  </div>
                )}

                {calculations.degreeCopiesFee > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground pl-4">
                      Degree Photocopies:
                    </span>
                    <span className="text-foreground font-mono">
                      PKR {calculations.degreeCopiesFee.toLocaleString()}
                    </span>
                  </div>
                )}

                {calculations.originalTranscriptFee > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <FileText className="size-3 text-emerald-500" />
                      Original Transcript(s):
                    </span>
                    <span className="text-foreground font-mono">
                      PKR {calculations.originalTranscriptFee.toLocaleString()}
                    </span>
                  </div>
                )}

                {calculations.transcriptCopiesFee > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground pl-4">
                      Transcript Photocopies:
                    </span>
                    <span className="text-foreground font-mono">
                      PKR {calculations.transcriptCopiesFee.toLocaleString()}
                    </span>
                  </div>
                )}

                {calculations.provisionalFee > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Provisional Cert:
                    </span>
                    <span className="text-foreground font-mono">
                      PKR {calculations.provisionalFee.toLocaleString()}
                    </span>
                  </div>
                )}

                {calculations.equivalenceFee > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Equivalence Letter:
                    </span>
                    <span className="text-foreground font-mono">
                      PKR {calculations.equivalenceFee.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground">
                    Courier Handling:
                  </span>
                  <span className="text-foreground font-mono">
                    {calculations.courierFee > 0
                      ? `PKR ${calculations.courierFee.toLocaleString()}`
                      : 'Free (Counter Pickup)'}
                  </span>
                </div>
              </div>

              {/* Total Amount Box */}
              <div className="space-y-1 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <span className="block text-[10px] font-bold tracking-wider text-emerald-800 uppercase dark:text-emerald-300">
                  Total Payable Amount
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xl font-black text-emerald-700 sm:text-2xl dark:text-emerald-400">
                    PKR {calculations.totalAmount.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground font-mono text-[10px]">
                    1-Link PSID
                  </span>
                </div>
              </div>

              {/* Statutory Note */}
              <div className="bg-muted/40 text-muted-foreground flex items-start gap-2 rounded-lg p-2.5 text-[11px]">
                <AlertCircle className="text-primary mt-0.5 size-3.5 shrink-0" />
                <p>
                  Proceeding to Step 4 will issue a formal 1-Link PSID e-Challan
                  valid for 7 calendar days across all Pakistani banks.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
