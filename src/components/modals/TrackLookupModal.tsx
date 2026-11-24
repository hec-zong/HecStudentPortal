'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/use-app-store';
import { Search, ArrowRight } from 'lucide-react';

export function TrackLookupModal() {
  const router = useRouter();
  const { activeModal, setActiveModal } = useAppStore();
  const [appId, setAppId] = React.useState('');
  const isOpen = activeModal === 'track_lookup';

  const handleSearch = (idToSearch: string) => {
    const finalId = idToSearch.trim() || '#APP-2024-9981';
    setActiveModal(null);
    router.push(`/track/${encodeURIComponent(finalId)}`);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && setActiveModal(null)}
    >
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader className="space-y-2 text-left">
          <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            <Search className="size-5" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Track Application Status
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Enter your Synapark Application ID or 1-Link PSID to view real-time
            scrutiny stages and controller comments.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(appId);
          }}
          className="space-y-4 pt-2"
        >
          <div className="space-y-1.5">
            <Label htmlFor="search-app-id" className="text-xs font-medium">
              Application ID or PSID
            </Label>
            <Input
              id="search-app-id"
              placeholder="e.g. #APP-2024-9981 or 10009823481239102"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
            />
          </div>

          {/* Quick Mock Sample Chips */}
          <div className="space-y-1.5">
            <span className="text-muted-foreground block text-[11px] font-medium">
              Sample Active Applications for Testing:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleSearch('#APP-2024-9981')}
                className="inline-flex items-center gap-1 rounded-md border border-amber-200/60 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300"
              >
                <span>#APP-2024-9981</span>
                <span className="text-[10px] opacity-75">(L1 Resubmit)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSearch('#APP-2024-1022')}
                className="inline-flex items-center gap-1 rounded-md border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300"
              >
                <span>#APP-2024-1022</span>
                <span className="text-[10px] opacity-75">(Dispatched)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSearch('#App-001')}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
              >
                <span>#App-001</span>
                <span className="text-[10px] opacity-75">(In Scrutiny)</span>
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full gap-1.5 font-semibold">
            <span>Inspect Live Pipeline</span>
            <ArrowRight className="size-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
