'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  HelpCircle,
  Check,
  RefreshCw,
  Send,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StepPersonalDetails } from '@/components/dynamic-form/StepPersonalDetails';
import {
  StepAcademicHistory,
  DEFAULT_ACADEMIC_RECORDS,
  type AcademicRecordEntry,
} from '@/components/dynamic-form/StepAcademicHistory';
import { StepReviewAndDegreeSelection } from '@/components/dynamic-form/StepReviewAndDegreeSelection';
import { StepChallanGeneration } from '@/components/dynamic-form/StepChallanGeneration';
import { StepPaidChallanSubmission } from '@/components/dynamic-form/StepPaidChallanSubmission';
import { createDynamicSynaparkStepZodSchema } from '@/lib/schemas';
import { portalService } from '@/services/portalService';
import { useAppStore } from '@/store/use-app-store';
import type {
  SynaparkFormSchema,
  SynaparkStep,
  AttestedDegreeSelection,
} from '@/types/portal';

export interface DynamicFormWizardProps {
  serviceId?: string;
  initialDraftId?: string;
}

export const DEFAULT_DEMO_FORM_VALUES: Record<string, unknown> = {
  // Step 1: Personal Details & Identity
  fullName: 'Muhammad Hamza Malik',
  fatherOrHusbandName: 'Tariq Mehmood Malik',
  cnic: '35202-8491204-1',
  dateOfBirth: '1998-04-14',
  gender: 'male',
  maritalStatus: 'single',
  mobileNumber: '+92-300-9842104',
  secondaryPhone: '+92-321-4910284',
  email: 'hamza.malik@alumni.nust.edu.pk',
  addressLine1: 'House 42-B, Sector F-10/3',
  city: 'Islamabad',
  country: 'Pakistan',
  domicileProvince: 'Punjab',
  domicileDistrict: 'Rawalpindi',
  nationality: 'Pakistani',
  profilePictureUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  profilePhotoUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  cnicFrontUrl: 'https://storage.hec.gov.pk/mock/cnic-front-35202.png',
  cnicBackUrl: 'https://storage.hec.gov.pk/mock/cnic-back-35202.png',
  hasSpecialNeeds: false,
  specialNeedsDescription: '',

  // Step 2: Academic History
  academicRecords: DEFAULT_ACADEMIC_RECORDS,
  'sec-academic-cards': DEFAULT_ACADEMIC_RECORDS,

  // Step 3: Attestation & Degree Selection
  attestationChannel: 'courier',
  deliveryMode: 'courier',
  hecCenter: 'isb-h9',
  attestationSelection: [
    {
      academicRecordId: 'deg-01',
      degreeLevel: 'Bachelor Degree (4-Year BS / 16 Years)',
      programTitle: 'Bachelor of Science in Software Engineering',
      universityOrBoard:
        'National University of Sciences and Technology (NUST)',
      passingYear: 2024,
      rollNumber: 'NUST-2020-SE-041',
      registrationNumber: '00000291024',
      selectedDocuments: [
        {
          type: 'Degree',
          attestOriginal: true,
          copiesCount: 1,
          originalFee: 1000,
          copyFee: 700,
          subtotal: 1700,
        },
        {
          type: 'Transcript',
          attestOriginal: true,
          copiesCount: 1,
          originalFee: 1000,
          copyFee: 700,
          subtotal: 1700,
        },
      ],
      itemTotal: 3400,
    },
  ],
  totalAttestationFee: 3400,
  courierServiceFee: 300,
  totalAmount: 3700,

  // Step 4: E-Challan / PSID
  psid: '10009823481239102',
  challanNumber: 'HEC-CH-2024-88491',

  // Step 5: Paid Submission
  paymentMode: '1link_atm_mobile',
  transactionReference: 'FT240989123891',
  paidAt: '2026-11-20',
  bankBranch: 'HBL Foreign Affairs Branch, Islamabad',
  paidReceiptUrl: 'https://storage.hec.gov.pk/mock/paid-challan-hamza.pdf',
  declarationAccepted: true,
};

export function DynamicFormWizard({
  serviceId = 'hec-degree-attestation-v2',
  initialDraftId = '#APP-2024-DRAFT',
}: DynamicFormWizardProps) {
  const router = useRouter();
  const { studentData } = useAppStore();

  const [schema, setSchema] = React.useState<SynaparkFormSchema | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(0);
  const [formValues, setFormValues] = React.useState<Record<string, unknown>>(
    () => {
      const s = studentData?.student;
      return {
        ...DEFAULT_DEMO_FORM_VALUES,
        ...(s
          ? {
              fullName: s.fullName || DEFAULT_DEMO_FORM_VALUES.fullName,
              fatherOrHusbandName:
                s.fatherOrHusbandName ||
                DEFAULT_DEMO_FORM_VALUES.fatherOrHusbandName,
              cnic: s.cnic || DEFAULT_DEMO_FORM_VALUES.cnic,
              dateOfBirth:
                s.dateOfBirth || DEFAULT_DEMO_FORM_VALUES.dateOfBirth,
              gender: s.gender || DEFAULT_DEMO_FORM_VALUES.gender,
              maritalStatus:
                s.maritalStatus || DEFAULT_DEMO_FORM_VALUES.maritalStatus,
              email: s.email || DEFAULT_DEMO_FORM_VALUES.email,
              mobileNumber:
                s.mobileNumber || DEFAULT_DEMO_FORM_VALUES.mobileNumber,
              addressLine1:
                s.postalAddress?.line1 || DEFAULT_DEMO_FORM_VALUES.addressLine1,
              city: s.postalAddress?.city || DEFAULT_DEMO_FORM_VALUES.city,
              cnicFrontUrl:
                s.cnicFrontUrl || DEFAULT_DEMO_FORM_VALUES.cnicFrontUrl,
              cnicBackUrl:
                s.cnicBackUrl || DEFAULT_DEMO_FORM_VALUES.cnicBackUrl,
            }
          : {}),
      };
    }
  );
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string>
  >({});
  const [savedTime, setSavedTime] = React.useState<string>(
    'Client demo data pre-filled'
  );
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [applicationId] = React.useState<string>(initialDraftId);

  // Load Synapark Form schema from service
  React.useEffect(() => {
    let isMounted = true;
    portalService.getSynaparkForm(serviceId).then((data) => {
      if (isMounted) {
        setSchema(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  const steps = schema?.steps || [];
  const currentStep: SynaparkStep | undefined = steps[currentStepIndex];
  const totalSteps = steps.length || 5;
  const progressPercentage = Math.round(
    ((currentStepIndex + 1) / totalSteps) * 100
  );

  const handleFieldChange = (field: string, value: unknown) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation error on change
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      const now = new Date();
      setSavedTime(
        `Draft saved at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      );
    }, 600);
  };

  const handleFillAllDemoData = () => {
    setFormValues({ ...DEFAULT_DEMO_FORM_VALUES });
    setValidationErrors({});
    setSavedTime('Demo data filled for client showcase');
  };

  const validateCurrentStep = (): boolean => {
    if (!currentStep) return true;

    // Step 2: Academic History & Qualification Records
    if (currentStepIndex === 1 || currentStep.id === 'step-academic-history') {
      const records = (formValues.academicRecords ||
        formValues['sec-academic-cards']) as AcademicRecordEntry[] | undefined;

      if (!records || !Array.isArray(records) || records.length === 0) {
        setValidationErrors({
          academicRecords: 'Please add at least one qualification entry.',
        });
        return false;
      }
      setValidationErrors({});
      return true;
    }

    // Step 3: Attestation Degree Selection
    if (
      currentStepIndex === 2 ||
      currentStep.id === 'step-attestation-selection'
    ) {
      setValidationErrors({});
      return true;
    }

    // Step 4: E-Challan Generation
    if (currentStepIndex === 3 || currentStep.id === 'step-echallan') {
      setValidationErrors({});
      return true;
    }

    // Step 5: Paid Submission
    if (currentStepIndex === 4 || currentStep.id === 'step-paid-submission') {
      setValidationErrors({});
      return true;
    }

    // Step 1: Personal Details validation via dynamic Zod schema
    try {
      const stepZodSchema = createDynamicSynaparkStepZodSchema(currentStep);
      const result = stepZodSchema.safeParse(formValues);

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const fieldKey = String(issue.path[0] || '');
          if (fieldKey && !fieldErrors[fieldKey]) {
            fieldErrors[fieldKey] = issue.message;
          }
        }
        setValidationErrors(fieldErrors);
        return false;
      }
    } catch {
      // Fallback: allow step transition if dynamic parsing encounters non-standard condition
      return true;
    }

    setValidationErrors({});
    return true;
  };

  const handleNextStep = () => {
    const isValid = validateCurrentStep();
    if (!isValid) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmitApplication();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      const selections =
        (formValues.attestationSelection as AttestedDegreeSelection[]) || [];
      const res = await portalService.submitApplication({
        serviceId,
        formData: formValues,
        attestationSelection: selections,
      });
      router.push(
        `/applications/${encodeURIComponent(res.applicationId)}/track?submitted=true`
      );
    } catch (e) {
      console.error('Submission failed:', e);
      const fallbackAppId = `#APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      router.push(
        `/applications/${encodeURIComponent(fallbackAppId)}/track?submitted=true`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* 1. Top Horizontal Step Indicator */}
      <div className="bg-card border-border overflow-x-auto rounded-2xl border p-4 shadow-sm sm:p-6">
        <div className="flex min-w-[620px] items-center justify-between">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <React.Fragment key={step.id}>
                {/* Step Node */}
                <div
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`group flex cursor-pointer items-center gap-3 select-none`}
                >
                  <div
                    className={`flex size-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isCurrent
                          ? 'bg-primary text-primary-foreground ring-primary/20 shadow-md ring-4'
                          : 'bg-muted text-muted-foreground border-border border'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="size-4" />
                    ) : (
                      step.stepNumber
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-muted-foreground block text-[10px] font-bold tracking-wider uppercase">
                      Step 0{step.stepNumber}
                    </span>
                    <span
                      className={`block text-xs font-semibold transition-colors ${
                        isCurrent
                          ? 'text-primary'
                          : isCompleted
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {step.shortTitle || step.title.split('&')[0].trim()}
                    </span>
                  </div>
                </div>

                {/* Connecting Line between steps */}
                {idx < steps.length - 1 && (
                  <div className="bg-border mx-3 h-0.5 flex-1 overflow-hidden rounded-full sm:mx-4">
                    <div
                      className={`h-full transition-all duration-300 ${
                        idx < currentStepIndex ? 'w-full bg-emerald-500' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Form Grid: Left Step/Application Sidebar + Right Step Content */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-4">
        {/* 2. Left Vertical Step / Application Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:col-span-1">
          {/* Application Metadata Card */}
          <Card className="border-border shadow-sm">
            <CardHeader className="space-y-1 pb-3">
              <span className="text-muted-foreground block font-mono text-[10px] tracking-wider uppercase">
                Dossier Identifier
              </span>
              <CardTitle className="text-primary flex items-center justify-between font-mono text-sm font-bold">
                <span>{applicationId}</span>
                <Badge variant="inProgress" className="text-[9px]">
                  Draft
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              {/* Step Progress Percentage */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">
                    Wizard Progress
                  </span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="bg-muted border-border/50 h-2 w-full overflow-hidden rounded-full border">
                  <div
                    className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Vertical Step Checklist */}
              <div className="border-border space-y-2 border-t pt-2">
                <span className="text-muted-foreground block text-[10px] font-bold tracking-wider uppercase">
                  Workflow Checklist
                </span>

                <div className="space-y-1.5">
                  {steps.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div
                        key={step.id}
                        onClick={() => {
                          setCurrentStepIndex(idx);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg p-2 text-xs transition-colors ${
                          isCurrent
                            ? 'bg-primary/10 text-primary border-primary/20 border font-bold'
                            : isCompleted
                              ? 'text-foreground hover:bg-muted'
                              : 'text-muted-foreground opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isCompleted ? (
                            <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                          ) : (
                            <span className="border-border flex size-3.5 shrink-0 items-center justify-center rounded-full border font-mono text-[9px]">
                              {step.stepNumber}
                            </span>
                          )}
                          <span className="truncate">
                            {step.shortTitle || step.title}
                          </span>
                        </div>

                        {isCurrent && (
                          <Badge
                            variant="inProgress"
                            className="px-1 py-0 text-[8px]"
                          >
                            Active
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Save Draft & Demo Actions */}
              <div className="border-border space-y-2 border-t pt-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleFillAllDemoData}
                  className="w-full gap-1.5 border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
                >
                  <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Auto-Fill Demo Data</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="w-full gap-1.5 text-xs font-semibold"
                >
                  {isSaving ? (
                    <RefreshCw className="size-3.5 animate-spin" />
                  ) : (
                    <Save className="text-primary size-3.5" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
                </Button>

                <span className="text-muted-foreground block text-center font-mono text-[10px]">
                  {savedTime}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Institutional Help Support Badge */}
          <div className="border-border bg-muted/40 space-y-1 rounded-xl border p-3.5 text-xs">
            <span className="text-foreground flex items-center gap-1.5 font-semibold">
              <HelpCircle className="text-primary size-3.5" />
              <span>Need Help?</span>
            </span>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              HEC Verification Desk Hotline:{' '}
              <strong className="text-foreground">051-111-119-432</strong>
            </p>
          </div>
        </aside>

        {/* Right Column: Active Step Rendered Dynamically */}
        <div className="space-y-6 lg:col-span-3">
          {/* Step Title Header */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="text-primary border-primary/30 text-xs"
              >
                Step {currentStep?.stepNumber || 1} of {totalSteps}
              </Badge>
              <Badge variant="approved" className="gap-1 text-[10px]">
                <Sparkles className="size-3" />
                Demo Data Active
              </Badge>
              <span className="text-muted-foreground hidden font-mono text-xs sm:inline">
                Synapark Engine Protocol v2.4
              </span>
            </div>
            <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              {currentStep?.title}
            </h2>
            <p className="text-muted-foreground text-xs">
              {currentStep?.description}
            </p>
          </div>

          {/* Render Step Components based on Current Step */}
          {currentStepIndex === 0 && currentStep && (
            <StepPersonalDetails
              stepConfig={currentStep}
              formValues={formValues}
              errors={validationErrors}
              onChange={handleFieldChange}
            />
          )}

          {currentStepIndex === 1 && (
            <StepAcademicHistory
              formValues={formValues}
              errors={validationErrors}
              onChange={handleFieldChange}
            />
          )}

          {currentStepIndex === 2 && (
            <StepReviewAndDegreeSelection
              formValues={formValues}
              onChange={handleFieldChange}
              onJumpToStep={(stepIdx: number) => {
                setCurrentStepIndex(stepIdx);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentStepIndex === 3 && (
            <StepChallanGeneration
              applicationId={applicationId}
              formValues={formValues}
              onChange={handleFieldChange}
            />
          )}

          {currentStepIndex === 4 && (
            <StepPaidChallanSubmission
              applicationId={applicationId}
              formValues={formValues}
              errors={validationErrors}
              onChange={handleFieldChange}
              onSubmitSuccess={(submittedAppId: string) => {
                router.push(
                  `/applications/${encodeURIComponent(submittedAppId)}/track?submitted=true`
                );
              }}
            />
          )}

          {/* 3. Bottom Navigation Bar */}
          <div className="border-border bg-card flex items-center justify-between gap-3 rounded-xl border p-4 shadow-sm">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="size-3.5" />
              <span>Previous Step</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSaveDraft}
                className="text-muted-foreground hover:text-foreground hidden gap-1.5 text-xs font-medium sm:inline-flex"
              >
                <Save className="size-3.5" />
                <span>Save Progress</span>
              </Button>

              <Button
                type="button"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-semibold shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    <span>Submitting Dossier...</span>
                  </>
                ) : currentStepIndex === totalSteps - 1 ? (
                  <>
                    <Send className="size-3.5" />
                    <span>Submit Application for Scrutiny</span>
                  </>
                ) : (
                  <>
                    <span>Next: Continue</span>
                    <ArrowRight className="size-3.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
