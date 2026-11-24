'use client';

import * as React from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SynaparkDropzoneConfig } from '@/types/portal';

export interface OcrExtractedData {
  cnic?: string;
  fullName?: string;
  fatherOrHusbandName?: string;
  dateOfBirth?: string;
  gender?: string;
  rawConfidence?: number;
}

export interface InlineFileDropzoneProps {
  label: string;
  fieldName: string;
  value?: string;
  helpText?: string;
  config?: SynaparkDropzoneConfig;
  required?: boolean;
  error?: string;
  onFileChange: (
    url: string | undefined,
    fileMetadata?: { name: string; size: string }
  ) => void;
  onOcrExtract?: (data: OcrExtractedData) => void;
  enableOcrScan?: boolean;
}

export function InlineFileDropzone({
  label,
  fieldName,
  value,
  helpText,
  config,
  required = false,
  error,
  onFileChange,
  onOcrExtract,
  enableOcrScan = false,
}: InlineFileDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [fileName, setFileName] = React.useState<string>(
    value ? value.split('/').pop() || 'document.pdf' : ''
  );
  const [fileSize, setFileSize] = React.useState<string>('2.4 MB');
  const [isScanningOcr, setIsScanningOcr] = React.useState(false);
  const [ocrSuccess, setOcrSuccess] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const hasFile = Boolean(value || fileName);

  const acceptExtensions =
    config?.accept?.join(', ') || '.pdf, .jpg, .jpeg, .png';
  const maxSizeMb = config?.maxSizeMb || 5;

  const handleSimulatedUpload = (name: string, size = '1.8 MB') => {
    setFileName(name);
    setFileSize(size);
    const mockStorageUrl = `https://storage.hec.gov.pk/mock/uploads/${encodeURIComponent(name)}`;
    onFileChange(mockStorageUrl, { name, size });

    // If OCR is enabled (e.g. for CNIC Front/Back), trigger optional OCR hook
    if (enableOcrScan && onOcrExtract) {
      triggerOcrAutoFill(name);
    }
  };

  const triggerOcrAutoFill = (name: string) => {
    setIsScanningOcr(true);
    setTimeout(() => {
      setIsScanningOcr(false);
      setOcrSuccess(true);
      if (onOcrExtract) {
        if (
          fieldName.toLowerCase().includes('front') ||
          name.toLowerCase().includes('front')
        ) {
          onOcrExtract({
            cnic: '35202-1928374-1',
            fullName: 'Hamza Tariq Malik',
            fatherOrHusbandName: 'Tariq Malik',
            dateOfBirth: '1999-04-12',
            gender: 'male',
            rawConfidence: 0.98,
          });
        } else {
          onOcrExtract({
            rawConfidence: 0.95,
          });
        }
      }
      setTimeout(() => setOcrSuccess(false), 3000);
    }, 700);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      handleSimulatedUpload(file.name, `${sizeMb} MB`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      handleSimulatedUpload(file.name, `${sizeMb} MB`);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName('');
    onFileChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
          <span>{label}</span>
          {required && <span className="text-destructive font-bold">*</span>}
        </label>

        {enableOcrScan && hasFile && (
          <button
            type="button"
            onClick={() => triggerOcrAutoFill(fileName)}
            disabled={isScanningOcr}
            className="flex cursor-pointer items-center gap-1 text-[10px] font-semibold text-[#27b2d7] hover:text-[#13c2b6]"
          >
            {isScanningOcr ? (
              <>
                <RefreshCw className="size-3 animate-spin text-[#13c2b6]" />
                <span>Reading MRZ / OCR...</span>
              </>
            ) : ocrSuccess ? (
              <>
                <CheckCircle2 className="size-3 text-[#13c2b6]" />
                <span className="font-bold text-[#13c2b6]">
                  Auto-Filled from CNIC
                </span>
              </>
            ) : (
              <>
                <Sparkles className="size-3 text-[#13c2b6]" />
                <span>Extract via NADRA OCR</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={config?.accept?.join(',') || '.pdf,.jpg,.jpeg,.png'}
        onChange={handleFileSelect}
        className="hidden"
      />

      {!hasFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
            isDragging
              ? 'border-[#13c2b6] bg-[#87cbde]/10'
              : error
                ? 'border-destructive bg-destructive/5'
                : 'border-[#e5e5e5] bg-white hover:border-[#13c2b6] hover:bg-[#f6fbfe]'
          }`}
        >
          <div className="flex size-10 items-center justify-center rounded-xl border border-[#e5e5e5] bg-[#f6fbfe] text-[#27b2d7] transition-transform group-hover:scale-105">
            <Upload className="size-4 text-[#13c2b6]" />
          </div>

          <div className="space-y-0.5">
            <span className="block text-xs font-semibold text-black">
              {config?.instruction ||
                'Click to browse or drop document scan here'}
            </span>
            <span className="block text-[11px] text-[#666666]">
              Supports {acceptExtensions} (Up to {maxSizeMb} MB)
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#13c2b6]/40 bg-[#f6fbfe] p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#13c2b6]/15 text-[#13c2b6]">
              <FileText className="size-5" />
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="block max-w-[200px] truncate text-xs font-semibold text-black sm:max-w-xs">
                  {fileName}
                </span>
                <Badge
                  variant="approved"
                  className="shrink-0 px-1.5 py-0 text-[9px]"
                >
                  Attached
                </Badge>
              </div>

              <span className="block font-mono text-[10px] text-[#666666]">
                {fileSize} • Scanned Document
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 border-[#e5e5e5] bg-white px-2.5 text-xs text-black hover:border-[#27b2d7] hover:bg-[#f6fbfe]"
              title="Replace file"
            >
              Replace
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-8 px-2 text-[#666666] hover:bg-white hover:text-black"
              title="Remove document"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {helpText && !error && (
        <p className="text-muted-foreground text-[11px]">{helpText}</p>
      )}

      {error && (
        <p className="text-destructive flex items-center gap-1 text-[11px] font-medium">
          <AlertCircle className="size-3" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
