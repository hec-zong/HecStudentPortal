'use client';

import * as React from 'react';
import {
  GraduationCap,
  Building2,
  PlusCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { InlineFileDropzone } from '@/components/dynamic-form/InlineFileDropzone';
import { pqrService } from '@/services/pqrService';
import type {
  PqrUniversity,
  PqrDegreeLevel,
  PqrProgram,
  PqrBoard,
} from '@/types/portal';

export interface AcademicRecordEntry {
  id: string;
  degreeLevelId: string;
  degreeLevelTitle: string;
  institutionType: 'board' | 'university' | 'foreign';
  institutionName: string;
  programTitle: string;
  country: string;
  city: string;
  major: string;
  rollNumber: string;
  registrationNumber: string;
  passingYear: string;
  gradingSystem: 'cgpa' | 'marks';
  totalMarksOrCgpa: string;
  obtainedMarksOrCgpa: string;
  documentDegreeUrl?: string;
  documentTranscriptUrl?: string;
  isConfirmed: boolean;
  isSaved: boolean;
  isExpanded: boolean;
}

export const DEFAULT_ACADEMIC_RECORDS: AcademicRecordEntry[] = [
  {
    id: 'acad-01',
    degreeLevelId: 'dl-10',
    degreeLevelTitle: 'Secondary School Certificate (Matric / O-Level)',
    institutionType: 'board',
    institutionName: 'Federal Board of Intermediate and Secondary Education',
    programTitle: 'Secondary School Certificate (Science Group)',
    country: 'Pakistan',
    city: 'Islamabad',
    major: 'Science (Biology, Physics, Chemistry)',
    rollNumber: '109284',
    registrationNumber: '2016-FBISE-9182',
    passingYear: '2018',
    gradingSystem: 'marks',
    totalMarksOrCgpa: '1100',
    obtainedMarksOrCgpa: '980',
    documentDegreeUrl: 'https://storage.hec.gov.pk/mock/matric_sanad_fbise.pdf',
    documentTranscriptUrl:
      'https://storage.hec.gov.pk/mock/matric_dmc_scan.pdf',
    isConfirmed: true,
    isSaved: true,
    isExpanded: false,
  },
  {
    id: 'acad-02',
    degreeLevelId: 'dl-12',
    degreeLevelTitle:
      'Higher Secondary School Certificate (Intermediate / A-Level)',
    institutionType: 'board',
    institutionName: 'Board of Intermediate and Secondary Education, Lahore',
    programTitle: 'Higher Secondary Certificate (Pre-Engineering)',
    country: 'Pakistan',
    city: 'Lahore',
    major: 'Pre-Engineering (Mathematics, Physics, Chemistry)',
    rollNumber: '491028',
    registrationNumber: '2018-BISEL-4491',
    passingYear: '2020',
    gradingSystem: 'marks',
    totalMarksOrCgpa: '1100',
    obtainedMarksOrCgpa: '994',
    documentDegreeUrl:
      'https://storage.hec.gov.pk/mock/hssc_sanad_bise_lhr.pdf',
    documentTranscriptUrl: 'https://storage.hec.gov.pk/mock/hssc_dmc_scan.pdf',
    isConfirmed: true,
    isSaved: true,
    isExpanded: false,
  },
  {
    id: 'acad-03',
    degreeLevelId: 'dl-16',
    degreeLevelTitle: 'Bachelor Degree (4-Year BS / BSc Hons / BE)',
    institutionType: 'university',
    institutionName: 'National University of Sciences and Technology (NUST)',
    programTitle: 'Bachelor of Science in Computer Science (BS CS)',
    country: 'Pakistan',
    city: 'Islamabad',
    major: 'Computer Science & Software Systems',
    rollNumber: '19-SEECS-BSCS-044',
    registrationNumber: '2019-NUST-REG-9812',
    passingYear: '2023',
    gradingSystem: 'cgpa',
    totalMarksOrCgpa: '4.00',
    obtainedMarksOrCgpa: '3.82',
    documentDegreeUrl: 'https://storage.hec.gov.pk/mock/bs-degree-original.pdf',
    documentTranscriptUrl:
      'https://storage.hec.gov.pk/mock/bs-transcript-dmc.pdf',
    isConfirmed: true,
    isSaved: true,
    isExpanded: true,
  },
];

export interface StepAcademicHistoryProps {
  formValues: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (field: string, value: unknown) => void;
}

export function StepAcademicHistory({
  formValues,
  onChange,
}: StepAcademicHistoryProps) {
  const [records, setRecords] = React.useState<AcademicRecordEntry[]>(() => {
    if (
      Array.isArray(formValues.academicRecords) &&
      formValues.academicRecords.length > 0
    ) {
      return formValues.academicRecords as AcademicRecordEntry[];
    }
    return DEFAULT_ACADEMIC_RECORDS;
  });

  const [universities, setUniversities] = React.useState<PqrUniversity[]>([]);
  const [degreeLevels, setDegreeLevels] = React.useState<PqrDegreeLevel[]>([]);
  const [boards, setBoards] = React.useState<PqrBoard[]>([]);
  const [programs, setPrograms] = React.useState<PqrProgram[]>([]);

  // Load PQR cascading master data
  React.useEffect(() => {
    let isMounted = true;
    Promise.all([
      pqrService.getUniversities(),
      pqrService.getDegreeLevels(),
      pqrService.getBoards(),
      pqrService.getPrograms(),
    ]).then(([unis, levels, brds, progs]) => {
      if (isMounted) {
        setUniversities(unis);
        setDegreeLevels(levels);
        setBoards(brds);
        setPrograms(progs);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Ensure formValues has records on initial mount
  React.useEffect(() => {
    if (!formValues.academicRecords || !formValues['sec-academic-cards']) {
      onChange('academicRecords', records);
      onChange('sec-academic-cards', records);
    }
  }, [formValues, onChange, records]);

  const updateRecord = (id: string, updates: Partial<AcademicRecordEntry>) => {
    const updated = records.map((rec) =>
      rec.id === id ? { ...rec, ...updates } : rec
    );
    setRecords(updated);
    onChange('academicRecords', updated);
    onChange('sec-academic-cards', updated);
  };

  const handleAddDegree = () => {
    const newRecord: AcademicRecordEntry = {
      id: `acad-${Date.now()}`,
      degreeLevelId: 'dl-18',
      degreeLevelTitle: 'Master Degree (MS / MPhil / 2-Year Post-16)',
      institutionType: 'university',
      institutionName:
        universities[0]?.name ||
        'National University of Sciences and Technology (NUST)',
      programTitle: 'Master of Science in Software Engineering',
      country: 'Pakistan',
      city: 'Islamabad',
      major: 'Software Engineering',
      rollNumber: '24-SEECS-MSSE-012',
      registrationNumber: '2024-NUST-REG-0192',
      passingYear: '2025',
      gradingSystem: 'cgpa',
      totalMarksOrCgpa: '4.00',
      obtainedMarksOrCgpa: '3.75',
      documentDegreeUrl:
        'https://storage.hec.gov.pk/mock/ms-degree-provisional.pdf',
      documentTranscriptUrl:
        'https://storage.hec.gov.pk/mock/ms-transcript-dmc.pdf',
      isConfirmed: true,
      isSaved: true,
      isExpanded: true,
    };
    const updated = [...records, newRecord];
    setRecords(updated);
    onChange('academicRecords', updated);
    onChange('sec-academic-cards', updated);
  };

  const handleDeleteDegree = (id: string) => {
    if (records.length <= 1) return;
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    onChange('academicRecords', updated);
    onChange('sec-academic-cards', updated);
  };

  const handleToggleExpand = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isExpanded: !r.isExpanded } : r))
    );
  };

  const handleSaveCard = (id: string) => {
    updateRecord(id, { isSaved: true, isExpanded: false });
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 text-white sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="flex items-center gap-2 text-base font-bold text-white sm:text-lg">
              <GraduationCap className="size-5 text-emerald-400" />
              <span>
                Academic History & Pakistan Qualification Register (PQR)
              </span>
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-300">
            Record all qualifying educational tiers sequentially. HEC
            attestation requires underlying SSC and HSSC verification.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleAddDegree}
          className="shrink-0 gap-1.5 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500"
        >
          <PlusCircle className="size-3.5" />
          <span>Add Another Degree</span>
        </Button>
      </div>

      {/* Repeatable Degree Cards List */}
      <div className="space-y-4">
        {records.map((rec, index) => {
          // Programs filtered by selected university
          const matchingUni = universities.find(
            (u) => u.name === rec.institutionName
          );
          const availablePrograms = programs.filter(
            (p) => !matchingUni || p.universityId === matchingUni.id
          );

          return (
            <Card
              key={rec.id}
              className={`border transition-all ${
                rec.isExpanded
                  ? 'border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
                  : 'border-border hover:border-border/80'
              }`}
            >
              {/* Card Header (Clickable for expand/collapse) */}
              <CardHeader
                onClick={() => handleToggleExpand(rec.id)}
                className="flex cursor-pointer flex-row items-center justify-between gap-4 p-4 select-none sm:p-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <GraduationCap className="size-5" />
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground font-mono text-xs font-bold">
                        Tier {index + 1}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold"
                      >
                        {rec.degreeLevelTitle.split('(')[0].trim()}
                      </Badge>
                      {rec.isSaved && (
                        <Badge
                          variant="approved"
                          className="gap-1 px-1.5 py-0 text-[9px]"
                        >
                          <Check className="size-3" />
                          Validated
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-foreground truncate text-sm font-bold">
                      {rec.programTitle || 'Select qualification...'}
                    </h3>

                    <p className="text-muted-foreground flex items-center gap-1.5 truncate text-xs">
                      <Building2 className="text-primary size-3" />
                      <span>
                        {rec.institutionName} • Class of{' '}
                        {rec.passingYear || 'N/A'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {records.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDegree(rec.id);
                      }}
                      className="text-muted-foreground hover:text-destructive size-8 p-0"
                      title="Remove this degree card"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}

                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground rounded-md p-1"
                    aria-label={
                      rec.isExpanded ? 'Collapse card' : 'Expand card'
                    }
                  >
                    {rec.isExpanded ? (
                      <ChevronUp className="size-5" />
                    ) : (
                      <ChevronDown className="size-5" />
                    )}
                  </button>
                </div>
              </CardHeader>

              {/* Expanded Card Form Content */}
              {rec.isExpanded && (
                <CardContent className="border-border/60 space-y-5 border-t p-4 pt-0 sm:p-5">
                  <div className="grid grid-cols-1 gap-4 pt-4 text-xs sm:grid-cols-2 lg:grid-cols-3">
                    {/* Degree Level Selector */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">
                        Degree / Certificate Tier
                      </Label>
                      <select
                        value={rec.degreeLevelId}
                        onChange={(e) => {
                          const selectedLevel = degreeLevels.find(
                            (d) => d.id === e.target.value
                          );
                          updateRecord(rec.id, {
                            degreeLevelId: e.target.value,
                            degreeLevelTitle:
                              selectedLevel?.title || rec.degreeLevelTitle,
                            institutionType:
                              e.target.value === 'dl-10' ||
                              e.target.value === 'dl-12'
                                ? 'board'
                                : 'university',
                          });
                        }}
                        className="border-input bg-background h-10 w-full rounded-lg border px-3 text-xs"
                      >
                        {degreeLevels.map((lvl) => (
                          <option key={lvl.id} value={lvl.id}>
                            {lvl.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Institution Type */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">
                        Awarding Authority Type
                      </Label>
                      <select
                        value={rec.institutionType}
                        onChange={(e) =>
                          updateRecord(rec.id, {
                            institutionType: e.target.value as
                              'board' | 'university' | 'foreign',
                          })
                        }
                        className="border-input bg-background h-10 w-full rounded-lg border px-3 text-xs"
                      >
                        <option value="university">
                          Recognized University / DAE (PQR)
                        </option>
                        <option value="board">
                          Intermediate / Secondary Board (BISE)
                        </option>
                        <option value="foreign">
                          Foreign / International University
                        </option>
                      </select>
                    </div>

                    {/* University / Board Selector */}
                    <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                      <Label className="text-xs font-semibold">
                        {rec.institutionType === 'board'
                          ? 'Select Educational Board'
                          : 'Select University (PQR Index)'}
                      </Label>
                      <select
                        value={rec.institutionName}
                        onChange={(e) =>
                          updateRecord(rec.id, {
                            institutionName: e.target.value,
                          })
                        }
                        className="border-input bg-background h-10 w-full rounded-lg border px-3 text-xs"
                      >
                        {rec.institutionType === 'board'
                          ? boards.map((b) => (
                              <option key={b.id} value={b.name}>
                                {b.name} ({b.province})
                              </option>
                            ))
                          : universities.map((u) => (
                              <option key={u.id} value={u.name}>
                                {u.name} ({u.city})
                              </option>
                            ))}
                        <option value="National University of Sciences and Technology (NUST)">
                          National University of Sciences and Technology (NUST)
                        </option>
                        <option value="Lahore University of Management Sciences (LUMS)">
                          Lahore University of Management Sciences (LUMS)
                        </option>
                        <option value="University of the Punjab">
                          University of the Punjab
                        </option>
                        <option value="Quaid-i-Azam University">
                          Quaid-i-Azam University
                        </option>
                      </select>
                    </div>

                    {/* Program Title / Discipline */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs font-semibold">
                        Program / Degree Title (PQR Accredited)
                      </Label>
                      <div className="space-y-1">
                        <Input
                          value={rec.programTitle}
                          onChange={(e) =>
                            updateRecord(rec.id, {
                              programTitle: e.target.value,
                            })
                          }
                          placeholder="e.g. Bachelor of Science in Computer Science"
                          className="text-xs"
                        />
                        {availablePrograms.length > 0 &&
                          rec.institutionType === 'university' && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-muted-foreground text-[10px] font-medium">
                                Quick Pick:
                              </span>
                              {availablePrograms.slice(0, 3).map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() =>
                                    updateRecord(rec.id, {
                                      programTitle: p.programName,
                                    })
                                  }
                                  className="bg-muted border-border rounded-full border px-2 py-0.5 text-[10px] transition-colors hover:bg-emerald-500/20 hover:text-emerald-600 dark:hover:text-emerald-400"
                                >
                                  {p.programName.split('(')[0].trim()}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Major / Specialization */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">
                        Major / Discipline
                      </Label>
                      <Input
                        value={rec.major}
                        onChange={(e) =>
                          updateRecord(rec.id, { major: e.target.value })
                        }
                        placeholder="e.g. Software Engineering"
                        className="text-xs"
                      />
                    </div>

                    {/* Roll Number & Registration Number */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">
                        Roll Number / Seat #
                      </Label>
                      <Input
                        value={rec.rollNumber}
                        onChange={(e) =>
                          updateRecord(rec.id, { rollNumber: e.target.value })
                        }
                        placeholder="e.g. 19-SEECS-BSCS-044"
                        className="font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">
                        University / Board Registration Number
                      </Label>
                      <Input
                        value={rec.registrationNumber}
                        onChange={(e) =>
                          updateRecord(rec.id, {
                            registrationNumber: e.target.value,
                          })
                        }
                        placeholder="e.g. 2019-NUST-REG-9812"
                        className="font-mono text-xs"
                      />
                    </div>

                    {/* Passing Year */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">
                        Passing / Completion Year
                      </Label>
                      <Input
                        value={rec.passingYear}
                        onChange={(e) =>
                          updateRecord(rec.id, { passingYear: e.target.value })
                        }
                        placeholder="2023"
                        className="text-xs"
                      />
                    </div>

                    {/* Country & City */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Country</Label>
                      <Input
                        value={rec.country}
                        onChange={(e) =>
                          updateRecord(rec.id, { country: e.target.value })
                        }
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">City</Label>
                      <Input
                        value={rec.city}
                        onChange={(e) =>
                          updateRecord(rec.id, { city: e.target.value })
                        }
                        className="text-xs"
                      />
                    </div>

                    {/* Grading System */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">
                        Total Marks / Max CGPA
                      </Label>
                      <Input
                        value={rec.totalMarksOrCgpa}
                        onChange={(e) =>
                          updateRecord(rec.id, {
                            totalMarksOrCgpa: e.target.value,
                          })
                        }
                        placeholder="4.00 or 1100"
                        className="font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">
                        Obtained Marks / CGPA
                      </Label>
                      <Input
                        value={rec.obtainedMarksOrCgpa}
                        onChange={(e) =>
                          updateRecord(rec.id, {
                            obtainedMarksOrCgpa: e.target.value,
                          })
                        }
                        placeholder="3.82 or 980"
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Inline Document Upload Dropzones (Directly on Degree Card) */}
                  <div className="border-border space-y-3 border-t pt-4">
                    <Label className="text-foreground block text-xs font-bold">
                      Required Degree Documents & Scans (
                      {rec.degreeLevelTitle.split('(')[0].trim()})
                    </Label>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Dropzone 1: Degree / Certificate Parchment */}
                      <div className="border-border bg-card space-y-2 rounded-xl border p-3.5">
                        <InlineFileDropzone
                          label="Degree / Certificate Parchment Scan"
                          fieldName={`degreeDoc_${rec.id}`}
                          value={rec.documentDegreeUrl}
                          helpText="Original diploma or provisional certificate with seal."
                          required={true}
                          onFileChange={(url) =>
                            updateRecord(rec.id, { documentDegreeUrl: url })
                          }
                          config={{
                            accept: ['.pdf', '.jpg', '.jpeg', '.png'],
                            maxSizeMb: 5,
                            instruction:
                              'Drop original degree parchment scan here',
                          }}
                        />
                      </div>

                      {/* Dropzone 2: Official Transcript / DMC */}
                      <div className="border-border bg-card space-y-2 rounded-xl border p-3.5">
                        <InlineFileDropzone
                          label="Official Detailed Marks Certificate / Transcript"
                          fieldName={`transcriptDoc_${rec.id}`}
                          value={rec.documentTranscriptUrl}
                          helpText="Complete gradesheet showing credits, GPA, and Controller signature."
                          required={true}
                          onFileChange={(url) =>
                            updateRecord(rec.id, { documentTranscriptUrl: url })
                          }
                          config={{
                            accept: ['.pdf', '.jpg', '.jpeg', '.png'],
                            maxSizeMb: 5,
                            instruction:
                              'Drop official transcript or DMC scan here',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Confirmation Checkbox & Save Action */}
                  <div className="border-border flex flex-col justify-between gap-4 border-t pt-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={rec.isConfirmed}
                        onCheckedChange={(c) =>
                          updateRecord(rec.id, { isConfirmed: Boolean(c) })
                        }
                      />
                      <label className="text-muted-foreground cursor-pointer text-xs">
                        I certify that this academic record is authentic and
                        registered with the institution.
                      </label>
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleSaveCard(rec.id)}
                      className="h-8 shrink-0 gap-1.5 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500"
                    >
                      <Save className="size-3.5" />
                      <span>Save & Collapse Card</span>
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
