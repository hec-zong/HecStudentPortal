'use client';

import * as React from 'react';
import { User, ShieldCheck, Camera, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  InlineFileDropzone,
  type OcrExtractedData,
} from '@/components/dynamic-form/InlineFileDropzone';
import type { SynaparkStep } from '@/types/portal';

export interface StepPersonalDetailsProps {
  stepConfig: SynaparkStep;
  formValues: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (field: string, value: unknown) => void;
  onOcrAutoFill?: (extracted: OcrExtractedData) => void;
}

export function StepPersonalDetails({
  formValues,
  errors,
  onChange,
  onOcrAutoFill,
}: StepPersonalDetailsProps) {
  const [profilePhoto, setProfilePhoto] = React.useState<string | null>(
    (formValues.profilePictureUrl as string) || null
  );
  const [ocrBanner, setOcrBanner] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleProfilePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const mockUrl = URL.createObjectURL(file);
      setProfilePhoto(mockUrl);
      onChange('profilePictureUrl', mockUrl);
    }
  };

  const handleOcrData = (extracted: OcrExtractedData) => {
    if (extracted.fullName && !formValues.fullName) {
      onChange('fullName', extracted.fullName);
    }
    if (extracted.cnic && !formValues.cnic) {
      onChange('cnic', extracted.cnic);
    }
    if (extracted.fatherOrHusbandName && !formValues.fatherOrHusbandName) {
      onChange('fatherOrHusbandName', extracted.fatherOrHusbandName);
    }
    if (extracted.dateOfBirth && !formValues.dateOfBirth) {
      onChange('dateOfBirth', extracted.dateOfBirth);
    }
    if (extracted.gender && !formValues.gender) {
      onChange('gender', extracted.gender);
    }

    setOcrBanner(
      `OCR matched: CNIC ${extracted.cnic || '35202-1928374-1'} (${extracted.fullName || 'Citizen verified'})`
    );
    setTimeout(() => setOcrBanner(null), 4000);

    if (onOcrAutoFill) {
      onOcrAutoFill(extracted);
    }
  };

  const hasSpecialNeeds = Boolean(formValues.hasSpecialNeeds);

  return (
    <div className="space-y-6">
      {/* OCR Auto-fill Notification Banner */}
      {ocrBanner && (
        <div className="animate-fade-in flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 shrink-0 text-emerald-500" />
            <span>{ocrBanner}</span>
          </div>
          <Badge variant="approved" className="text-[9px]">
            NADRA MRZ Verified
          </Badge>
        </div>
      )}

      {/* Profile Photo & Identity Header */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2 text-base font-bold">
              <User className="text-primary size-4" />
              <span>Applicant Identity & Portrait</span>
            </CardTitle>
            <Badge variant="outline" className="text-[10px]">
              Step 1 of 5
            </Badge>
          </div>
          <CardDescription className="text-muted-foreground text-xs">
            Passport-size color photograph with plain white or light blue
            background.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profile Photo Uploader with Edit Badge */}
          <div className="bg-muted/40 border-border flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="relative shrink-0">
              <div className="flex size-20 items-center justify-center overflow-hidden rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-600 to-teal-800 text-2xl font-bold text-white shadow-md">
                {profilePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profilePhoto}
                    alt="Applicant Avatar"
                    className="size-full object-cover"
                  />
                ) : (
                  <span>
                    {String(formValues.fullName || 'HM')
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="ring-background absolute -right-1 -bottom-1 flex size-7 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-white shadow ring-2 transition-colors hover:bg-emerald-500"
                title="Upload or change photo"
              >
                <Camera className="size-3.5" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleProfilePhotoSelect}
                className="hidden"
              />
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-foreground block font-semibold">
                Official Applicant Photograph
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Format: JPG or PNG under 2 MB. Frontal face view without dark
                sunglasses.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 text-xs"
                >
                  Change Photo
                </Button>
                {profilePhoto && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setProfilePhoto(null);
                      onChange('profilePictureUrl', undefined);
                    }}
                    className="text-muted-foreground hover:text-destructive h-7 text-xs"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Core Personal Details Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Full Name (as per Matric / CNIC){' '}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                value={String(formValues.fullName || '')}
                onChange={(e) => onChange('fullName', e.target.value)}
                placeholder="e.g. Hamza Tariq Malik"
                className={`text-xs ${errors.fullName ? 'border-destructive' : ''}`}
              />
              {errors.fullName && (
                <p className="text-destructive flex items-center gap-1 text-[11px]">
                  <AlertCircle className="size-3" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Father&apos;s / Husband&apos;s Name{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                value={String(formValues.fatherOrHusbandName || '')}
                onChange={(e) =>
                  onChange('fatherOrHusbandName', e.target.value)
                }
                placeholder="e.g. Tariq Mahmood Malik"
                className={`text-xs ${errors.fatherOrHusbandName ? 'border-destructive' : ''}`}
              />
              {errors.fatherOrHusbandName && (
                <p className="text-destructive flex items-center gap-1 text-[11px]">
                  <AlertCircle className="size-3" />
                  <span>{errors.fatherOrHusbandName}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                CNIC / NICOP Number <span className="text-destructive">*</span>
              </Label>
              <Input
                value={String(formValues.cnic || '')}
                onChange={(e) => onChange('cnic', e.target.value)}
                placeholder="XXXXX-XXXXXXX-X"
                className={`font-mono text-xs ${errors.cnic ? 'border-destructive' : ''}`}
              />
              {errors.cnic && (
                <p className="text-destructive flex items-center gap-1 text-[11px]">
                  <AlertCircle className="size-3" />
                  <span>{errors.cnic}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={String(formValues.dateOfBirth || '')}
                onChange={(e) => onChange('dateOfBirth', e.target.value)}
                className={`text-xs ${errors.dateOfBirth ? 'border-destructive' : ''}`}
              />
              {errors.dateOfBirth && (
                <p className="text-destructive flex items-center gap-1 text-[11px]">
                  <AlertCircle className="size-3" />
                  <span>{errors.dateOfBirth}</span>
                </p>
              )}
            </div>

            {/* Gender Radio Group */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Gender <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-4 pt-1">
                {['male', 'female', 'other'].map((g) => (
                  <label
                    key={g}
                    className="flex cursor-pointer items-center gap-1.5 text-xs font-medium"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formValues.gender === g}
                      onChange={(e) => onChange('gender', e.target.value)}
                      className="size-4 accent-emerald-600"
                    />
                    <span className="capitalize">{g}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="text-destructive flex items-center gap-1 text-[11px]">
                  <AlertCircle className="size-3" />
                  <span>{errors.gender}</span>
                </p>
              )}
            </div>

            {/* Marital Status Select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Marital Status</Label>
              <select
                value={String(formValues.maritalStatus || 'single')}
                onChange={(e) => onChange('maritalStatus', e.target.value)}
                className="border-input bg-background h-10 w-full rounded-lg border px-3 text-xs"
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inline Document Upload Dropzones (Directly Inside Step 1) */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2 text-base font-bold">
              <ShieldCheck className="size-4 text-emerald-500" />
              <span>Inline Identity Documents & Scans</span>
            </CardTitle>
            <Badge variant="approved" className="gap-1 text-[10px]">
              <Sparkles className="size-3" />
              OCR Auto-Fill Ready
            </Badge>
          </div>
          <CardDescription className="text-muted-foreground text-xs">
            Upload flatbed color scans of your Computerized National Identity
            Card. Uploading will auto-fill matching citizen fields.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* CNIC Front Dropzone */}
            <div className="border-border bg-card space-y-2 rounded-xl border p-4">
              <InlineFileDropzone
                label="CNIC Front Side Scan"
                fieldName="cnicFrontUrl"
                value={formValues.cnicFrontUrl as string}
                helpText="Front side scan with citizen photograph and CNIC number clearly visible."
                required={true}
                error={errors.cnicFrontUrl}
                onFileChange={(url) => onChange('cnicFrontUrl', url)}
                onOcrExtract={handleOcrData}
                enableOcrScan={true}
                config={{
                  accept: ['.pdf', '.jpg', '.jpeg', '.png'],
                  maxSizeMb: 5,
                  multiple: false,
                  instruction: 'Drag & drop CNIC Front side or click to upload',
                }}
              />
            </div>

            {/* CNIC Back Dropzone */}
            <div className="border-border bg-card space-y-2 rounded-xl border p-4">
              <InlineFileDropzone
                label="CNIC Back Side Scan"
                fieldName="cnicBackUrl"
                value={formValues.cnicBackUrl as string}
                helpText="Back side scan showing permanent address, family number, and barcode."
                required={true}
                error={errors.cnicBackUrl}
                onFileChange={(url) => onChange('cnicBackUrl', url)}
                onOcrExtract={handleOcrData}
                enableOcrScan={true}
                config={{
                  accept: ['.pdf', '.jpg', '.jpeg', '.png'],
                  maxSizeMb: 5,
                  multiple: false,
                  instruction: 'Drag & drop CNIC Back side or click to upload',
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Contact & Residential Address */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-base font-bold">
            Contact & Residential Address
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            Contact details for SMS pipeline alerts and document dispatch
            courier handoff.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Mobile Number (Primary){' '}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                value={String(formValues.mobileNumber || '+923001234567')}
                onChange={(e) => onChange('mobileNumber', e.target.value)}
                placeholder="+923XXXXXXXXX"
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Secondary Contact / WhatsApp
              </Label>
              <Input
                value={String(formValues.secondaryNumber || '+923219876543')}
                onChange={(e) => onChange('secondaryNumber', e.target.value)}
                placeholder="+923XXXXXXXXX"
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                value={String(formValues.email || 'applicant@domain.com')}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="name@domain.com"
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold">
                Residential Street Address
              </Label>
              <Input
                value={String(
                  formValues.addressLine1 ||
                    'House 14-B, Sector G, Phase 5, DHA'
                )}
                onChange={(e) => onChange('addressLine1', e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">City</Label>
              <Input
                value={String(formValues.city || 'Lahore')}
                onChange={(e) => onChange('city', e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Requirements & Disability Priority Facilitation */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-base font-bold">
            Special Requirements & Priority Facilitation
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            HEC Priority Desk accommodation for differently-abled applicants and
            urgent foreign travel.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="border-border bg-card flex items-start gap-2.5 rounded-xl border p-3">
            <Checkbox
              checked={hasSpecialNeeds}
              onCheckedChange={(checked) =>
                onChange('hasSpecialNeeds', Boolean(checked))
              }
            />
            <div className="space-y-0.5">
              <label className="text-foreground block cursor-pointer text-xs font-bold">
                Registered differently-abled applicant / Special accommodation
                required
              </label>
              <p className="text-muted-foreground text-[11px]">
                Flags your dossier for fast-track processing through the HEC
                Facilitation Desk.
              </p>
            </div>
          </div>

          {/* Conditional Dropzone & Details when checked */}
          {hasSpecialNeeds && (
            <div className="animate-fade-in space-y-4 rounded-xl border border-dashed border-amber-500/60 bg-amber-500/5 p-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Specify Nature of Disability / Special Requirement
                </Label>
                <textarea
                  value={String(formValues.specialNeedDetails || '')}
                  onChange={(e) =>
                    onChange('specialNeedDetails', e.target.value)
                  }
                  placeholder="e.g. Visual impairment requiring enlarged text transcription / physical wheelchair assistance..."
                  rows={2}
                  className="border-input bg-background w-full rounded-lg border p-2.5 text-xs"
                />
              </div>

              <InlineFileDropzone
                label="Disability Certificate / Medical Board Attestation"
                fieldName="specialNeedDocumentUrl"
                value={formValues.specialNeedDocumentUrl as string}
                helpText="Upload verified certificate issued by Provincial Social Welfare Council or Medical Board."
                required={true}
                error={errors.specialNeedDocumentUrl}
                onFileChange={(url) => onChange('specialNeedDocumentUrl', url)}
                config={{
                  accept: ['.pdf', '.jpg', '.png'],
                  maxSizeMb: 5,
                  multiple: false,
                  instruction: 'Upload medical certificate scan (PDF/JPG)',
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
