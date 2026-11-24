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
          <div className="space-y-2 rounded-lg border border-emerald-600/30 bg-emerald-50/40 p-3.5 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between">
              <Badge variant="approved" className="text-[10px]">
                HEC Verified Digital Stamp
              </Badge>
              <span className="text-muted-foreground font-mono text-[11px]">
                {firstAsset.serialNumber}
              </span>
            </div>
            <div>
              <p className="text-foreground text-sm font-semibold">
                {firstAsset.title}
              </p>
              <p className="text-muted-foreground text-xs">
                {firstAsset.university}
              </p>
            </div>
            <div className="border-border/50 text-muted-foreground flex items-center gap-2 border-t pt-1 font-mono text-[11px]">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>SHA-256: {firstAsset.verificationHash}</span>
            </div>
          </div>

          {/* Copyable Share URL */}
          <div className="space-y-1.5">
            <label className="text-foreground text-xs font-medium">
              Public Verification URL
            </label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="bg-muted/40 font-mono text-xs select-all"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleCopy}
                className="shrink-0 gap-1 text-xs font-semibold"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
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
