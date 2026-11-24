'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
}

export function FormField({ className, ...props }: FormFieldProps) {
  return <div className={cn('space-y-2', className)} {...props} />;
}

export interface FormLabelProps extends React.ComponentPropsWithoutRef<
  typeof Label
> {
  error?: boolean;
}

export function FormLabel({ className, error, ...props }: FormLabelProps) {
  return (
    <Label className={cn(error && 'text-destructive', className)} {...props} />
  );
}

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export function FormError({
  className,
  message,
  children,
  ...props
}: FormErrorProps) {
  const content = message || children;
  if (!content) return null;

  return (
    <p
      className={cn('text-destructive text-sm font-medium', className)}
      role="alert"
      {...props}
    >
      {content}
    </p>
  );
}

export interface FormSubmitProps extends React.ComponentPropsWithoutRef<
  typeof Button
> {
  isLoading?: boolean;
}

export function FormSubmit({
  className,
  children,
  isLoading,
  disabled,
  ...props
}: FormSubmitProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || isLoading}
      className={cn('w-full sm:w-auto', className)}
      {...props}
    >
      {isLoading ? 'Submitting...' : children}
    </Button>
  );
}
