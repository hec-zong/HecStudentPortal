'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { PortalShell } from '@/components/layout/PortalShell';
import { ApplicationTrackerView } from '@/components/tracking/ApplicationTrackerView';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialAppId = searchParams.get('appId') || '#APP-2024-9981';
  const isJustSubmitted = searchParams.get('submitted') === 'true';

  return (
    <PortalShell>
      <ApplicationTrackerView
        initialApplicationId={initialAppId}
        isJustSubmitted={isJustSubmitted}
      />
    </PortalShell>
  );
}

export default function TrackPage() {
  return (
    <React.Suspense
      fallback={
        <div className="bg-background text-muted-foreground flex min-h-screen items-center justify-center text-sm">
          Loading application tracker...
        </div>
      }
    >
      <TrackContent />
    </React.Suspense>
  );
}
