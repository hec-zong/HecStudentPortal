'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  InlineFileDropzone,
  type OcrExtractedData,
} from '@/components/dynamic-form/InlineFileDropzone';
import type { SynaparkField } from '@/types/portal';
import { AlertCircle } from 'lucide-react';

export function isFieldVisible(
  field: SynaparkField,
  formValues: Record<string, unknown>
): boolean {
  if (!field.conditional) return true;

  const {
    field: targetFieldName,
    operator,
    value: expectedValue,
  } = field.conditional;
  const targetActualValue = formValues[targetFieldName];

  switch (operator) {
    case 'equals':
      return targetActualValue === expectedValue;
    case 'not_equals':
      return targetActualValue !== expectedValue;
    case 'contains':
      if (Array.isArray(targetActualValue)) {
        return targetActualValue.includes(expectedValue);
      }
      return String(targetActualValue || '').includes(String(expectedValue));
    default:
      return true;
  }
}

export interface DynamicFieldRendererProps {
  field: SynaparkField;
  value: unknown;
  onChange: (value: unknown) => void;
  formValues: Record<string, unknown>;
  error?: string;
  onOcrExtract?: (ocrData: OcrExtractedData) => void;
}

export function DynamicFieldRenderer({
  field,
  value,
  onChange,
  formValues,
  error,
  onOcrExtract,
}: DynamicFieldRendererProps) {
  const visible = isFieldVisible(field, formValues);
  if (!visible) return null;

  const isRequired = Boolean(field.validation?.required);

  switch (field.type) {
    case 'file':
      return (
        <InlineFileDropzone
          label={field.label}
          fieldName={field.name}
          value={typeof value === 'string' ? value : undefined}
          helpText={field.helpText}
          config={field.dropzoneConfig}
          required={isRequired}
          error={error}
          onFileChange={(url) => onChange(url || '')}
          onOcrExtract={onOcrExtract}
          enableOcrScan={field.name.toLowerCase().includes('cnic')}
        />
      );

    case 'checkbox':
      return (
        <div className="space-y-1">
          <div className="border-border bg-card flex items-start gap-2.5 rounded-xl border p-3">
            <Checkbox
              checked={Boolean(value)}
              onCheckedChange={(checked) => onChange(Boolean(checked))}
            />
            <div className="space-y-0.5">
              <label className="text-foreground block cursor-pointer text-xs font-semibold">
                {field.label}
                {isRequired && (
                  <span className="text-destructive ml-1 font-bold">*</span>
                )}
              </label>
              {field.helpText && (
                <p className="text-muted-foreground text-[11px]">
                  {field.helpText}
                </p>
              )}
            </div>
          </div>
          {error && (
            <p className="text-destructive flex items-center gap-1 text-[11px] font-medium">
              <AlertCircle className="size-3" />
              <span>{error}</span>
            </p>
          )}
        </div>
      );

    case 'radio':
      return (
        <div className="space-y-1.5">
          <Label className="text-foreground flex items-center gap-1 text-xs font-semibold">
            <span>{field.label}</span>
            {isRequired && (
              <span className="text-destructive font-bold">*</span>
            )}
          </Label>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            {field.options?.map((opt) => (
              <label
                key={opt.value}
                className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium"
              >
                <input
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="size-4 accent-[#13c2b6]"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>

          {field.helpText && !error && (
            <p className="text-muted-foreground text-[11px]">
              {field.helpText}
            </p>
          )}
          {error && (
            <p className="text-destructive flex items-center gap-1 text-[11px] font-medium">
              <AlertCircle className="size-3" />
              <span>{error}</span>
            </p>
          )}
        </div>
      );

    case 'select':
      return (
        <div className="space-y-1.5">
          <Label className="text-foreground flex items-center gap-1 text-xs font-semibold">
            <span>{field.label}</span>
            {isRequired && (
              <span className="text-destructive font-bold">*</span>
            )}
          </Label>

          <select
            value={
              typeof value === 'string' || typeof value === 'number'
                ? String(value)
                : ''
            }
            onChange={(e) => onChange(e.target.value)}
            className={`bg-background h-10 w-full rounded-lg border px-3 text-xs transition-all ${
              error
                ? 'border-destructive ring-destructive ring-1'
                : 'border-input focus:border-ring'
            }`}
          >
            <option value="">
              {field.placeholder || `Select ${field.label}...`}
            </option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {field.helpText && !error && (
            <p className="text-muted-foreground text-[11px]">
              {field.helpText}
            </p>
          )}
          {error && (
            <p className="text-destructive flex items-center gap-1 text-[11px] font-medium">
              <AlertCircle className="size-3" />
              <span>{error}</span>
            </p>
          )}
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-1.5">
          <Label className="text-foreground flex items-center gap-1 text-xs font-semibold">
            <span>{field.label}</span>
            {isRequired && (
              <span className="text-destructive font-bold">*</span>
            )}
          </Label>

          <textarea
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={`bg-background w-full resize-y rounded-lg border p-2.5 text-xs transition-all ${
              error
                ? 'border-destructive ring-destructive ring-1'
                : 'border-input focus:border-ring'
            }`}
          />

          {field.helpText && !error && (
            <p className="text-muted-foreground text-[11px]">
              {field.helpText}
            </p>
          )}
          {error && (
            <p className="text-destructive flex items-center gap-1 text-[11px] font-medium">
              <AlertCircle className="size-3" />
              <span>{error}</span>
            </p>
          )}
        </div>
      );

    case 'date':
      return (
        <div className="space-y-1.5">
          <Label className="text-foreground flex items-center gap-1 text-xs font-semibold">
            <span>{field.label}</span>
            {isRequired && (
              <span className="text-destructive font-bold">*</span>
            )}
          </Label>

          <Input
            type="date"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            className={`text-xs ${error ? 'border-destructive' : ''}`}
          />

          {field.helpText && !error && (
            <p className="text-muted-foreground text-[11px]">
              {field.helpText}
            </p>
          )}
          {error && (
            <p className="text-destructive flex items-center gap-1 text-[11px] font-medium">
              <AlertCircle className="size-3" />
              <span>{error}</span>
            </p>
          )}
        </div>
      );

    case 'number':
      return (
        <div className="space-y-1.5">
          <Label className="text-foreground flex items-center gap-1 text-xs font-semibold">
            <span>{field.label}</span>
            {isRequired && (
              <span className="text-destructive font-bold">*</span>
            )}
          </Label>

          <Input
            type="number"
            value={
              typeof value === 'number' || typeof value === 'string'
                ? value
                : ''
            }
            onChange={(e) =>
              onChange(e.target.value === '' ? '' : Number(e.target.value))
            }
            placeholder={field.placeholder}
            className={`text-xs ${error ? 'border-destructive' : ''}`}
          />

          {field.helpText && !error && (
            <p className="text-muted-foreground text-[11px]">
              {field.helpText}
            </p>
          )}
          {error && (
            <p className="text-destructive flex items-center gap-1 text-[11px] font-medium">
              <AlertCircle className="size-3" />
              <span>{error}</span>
            </p>
          )}
        </div>
      );

    case 'text':
    default:
      return (
        <div className="space-y-1.5">
          <Label className="text-foreground flex items-center gap-1 text-xs font-semibold">
            <span>{field.label}</span>
            {isRequired && (
              <span className="text-destructive font-bold">*</span>
            )}
          </Label>

          <Input
            type="text"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`text-xs ${error ? 'border-destructive' : ''}`}
          />

          {field.helpText && !error && (
            <p className="text-muted-foreground text-[11px]">
              {field.helpText}
            </p>
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
}
