'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { PortalShell } from '@/components/layout/PortalShell';
import { DynamicFormWizard } from '@/components/dynamic-form/DynamicFormWizard';

function ApplyContent() {
  const searchParams = useSearchParams();
  const service = searchParams.get('service');
  const serviceId = service ? `hec-${service}` : 'hec-degree-attestation-v2';

  return (
    <PortalShell>
      <div className="space-y-6">
        <DynamicFormWizard serviceId={serviceId} />
      </div>
    </PortalShell>
  );
}

export default function ApplyPage() {
  return (
    <React.Suspense
      fallback={
        <div className="bg-background text-muted-foreground flex min-h-screen items-center justify-center text-sm">
          Loading application form...
        </div>
      }
    >
      <ApplyContent />
    </React.Suspense>
  );
}
