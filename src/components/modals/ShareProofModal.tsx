'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/use-app-store';
import {
  Share2,
  Check,
  Copy,
  QrCode,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export function ShareProofModal() {
  const { activeModal, setActiveModal, studentData } = useAppStore();
  const [copied, setCopied] = React.useState(false);
  const isOpen = activeModal === 'share_proof';

  // Sample verified credential from HEC wallet
  const firstAsset = studentData?.hecWallet?.[0] || {
    id: 'wal-01',
    title: 'Attested Intermediate Pre-Engineering Sanad',
    serialNumber: 'HEC-ATT-2023-091823',
    university: 'BISE Lahore',
    verificationHash: '0x9f83ab2148dc82910fae',
  };

  const shareUrl = `https://verify.hec.gov.pk/cert/${firstAsset.serialNumber}`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && setActiveModal(null)}
    >
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader className="space-y-2 text-left">
          <div className="bg-primary/10 text-primary mb-1 flex size-10 items-center justify-center rounded-lg">
            <Share2 className="size-5" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Share Tamper-Proof Digital Proof
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Generate a cryptographically secured verification link and QR badge
            for foreign embassies, employers, and higher education institutions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Credential Card Preview */}
          <div className="space-y-2 rounded-2xl border border-[#13c2b6]/30 bg-[#f6fbfe] p-4 text-black">
            <div className="flex items-center justify-between">
              <Badge variant="approved" className="text-[10px]">
                HEC Verified Digital Stamp
              </Badge>
              <span className="font-mono text-[11px] text-[#666666]">
                {firstAsset.serialNumber}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-black">{firstAsset.title}</p>
              <p className="text-xs text-[#666666]">{firstAsset.university}</p>
            </div>
            <div className="flex items-center gap-2 border-t border-[#e5e5e5] pt-2 font-mono text-[11px] text-[#666666]">
              <ShieldCheck className="size-3.5 text-[#13c2b6]" />
              <span>SHA-256: {firstAsset.verificationHash}</span>
            </div>
          </div>

          {/* Copyable Share URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-black">
              Public Verification URL
            </label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="border-[#e5e5e5] bg-[#f6fbfe] font-mono text-xs text-black select-all"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleCopy}
                className="shrink-0 gap-1 border-[#e5e5e5] text-xs font-semibold text-black hover:border-[#27b2d7] hover:bg-[#f6fbfe]"
              >
                {copied ? (
                  <Check className="size-3.5 text-[#13c2b6]" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
          </div>

          <div className="bg-muted/40 text-muted-foreground flex items-center gap-3 rounded-lg p-3 text-xs">
            <QrCode className="text-foreground size-9 shrink-0" />
            <p className="leading-snug">
              Every attested certificate has an embedded cryptographic QR code
              readable by any camera scanner directly on paper or screen.
            </p>
          </div>

          <Button
            type="button"
            className="w-full gap-1.5 font-semibold"
            onClick={() => {
              setActiveModal(null);
              window.open(shareUrl, '_blank');
            }}
          >
            <span>Open Verification Preview</span>
            <ExternalLink className="size-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
