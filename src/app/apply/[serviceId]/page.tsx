'use client';

import * as React from 'react';
import { PortalShell } from '@/components/layout/PortalShell';
import { DynamicFormWizard } from '@/components/dynamic-form/DynamicFormWizard';

export default function DynamicApplyPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const resolvedParams = React.use(params);
  const serviceId = resolvedParams.serviceId || 'hec-degree-attestation-v2';

  return (
    <PortalShell>
      <div className="space-y-6">
        <DynamicFormWizard serviceId={serviceId} />
      </div>
    </PortalShell>
  );
}
