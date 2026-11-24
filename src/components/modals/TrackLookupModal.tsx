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
      <DialogContent className="rounded-2xl border-[#e5e5e5] bg-white shadow-xl sm:max-w-md">
        <DialogHeader className="space-y-2 text-left">
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-[#87cbde]/15 text-[#27b2d7]">
            <Search className="size-5" />
          </div>
          <DialogTitle className="font-heading text-xl font-bold tracking-tight text-black">
            Track Application Status
          </DialogTitle>
          <DialogDescription className="text-sm text-[#666666]">
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
                className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-500/20"
              >
                <span>#APP-2024-9981</span>
                <span className="text-[10px] opacity-75">(L1 Resubmit)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSearch('#APP-2024-1022')}
                className="inline-flex items-center gap-1 rounded-lg border border-[#13c2b6]/30 bg-[#f6fbfe] px-2.5 py-1 text-xs font-semibold text-black transition-colors hover:border-[#13c2b6]"
              >
                <span>#APP-2024-1022</span>
                <span className="text-[10px] text-[#27b2d7]">(Dispatched)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSearch('#App-001')}
                className="inline-flex items-center gap-1 rounded-lg border border-[#e5e5e5] bg-[#f6fbfe] px-2.5 py-1 text-xs font-semibold text-[#666666] transition-colors hover:border-[#27b2d7] hover:text-black"
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
