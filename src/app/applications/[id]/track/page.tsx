'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { PortalShell } from '@/components/layout/PortalShell';
import { ApplicationTrackerView } from '@/components/tracking/ApplicationTrackerView';

function TrackContent({ applicationId }: { applicationId: string }) {
  const searchParams = useSearchParams();
  const isJustSubmitted = searchParams.get('submitted') === 'true';

  return (
    <PortalShell>
      <ApplicationTrackerView
        initialApplicationId={applicationId}
        isJustSubmitted={isJustSubmitted}
      />
    </PortalShell>
  );
}

export default function TrackApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const applicationId = decodeURIComponent(
    resolvedParams.id || '#APP-2024-9981'
  );

  return (
    <React.Suspense
      fallback={
        <div className="bg-background text-muted-foreground flex min-h-screen items-center justify-center text-sm">
          Loading verification pipeline...
        </div>
      }
    >
      <TrackContent applicationId={applicationId} />
    </React.Suspense>
  );
}
