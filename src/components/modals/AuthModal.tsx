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
import { ShieldCheck, Sparkles } from 'lucide-react';

export function AuthModal() {
  const router = useRouter();
  const { activeModal, setActiveModal, loginAsFirstTime, loginAsReturning } =
    useAppStore();
  const [cnic, setCnic] = React.useState('35202-1928374-1');
  const [password, setPassword] = React.useState('••••••••');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isOpen = activeModal === 'login';

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // If entered CNIC is the first time user CNIC, route as first time
    if (cnic.startsWith('37405')) {
      await loginAsFirstTime();
      router.push('/apply');
    } else {
      await loginAsReturning();
      router.push('/dashboard');
    }
    setIsSubmitting(false);
  };

  const handleQuickFirstTime = async () => {
    await loginAsFirstTime();
    router.push('/apply');
  };

  const handleQuickReturning = async () => {
    await loginAsReturning();
    router.push('/dashboard');
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && setActiveModal(null)}
    >
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader className="space-y-2 text-left">
          <div className="bg-primary/10 text-primary mb-1 flex size-10 items-center justify-center rounded-lg">
            <ShieldCheck className="size-6" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Sign in to HEC E-Portal
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Access your degree attestation files, PQR accreditations, and 1-Link
            PSID billing records.
          </DialogDescription>
        </DialogHeader>

        {/* Quick Demo Login Preset Buttons */}
        <div className="bg-muted/50 border-border/80 space-y-2.5 rounded-lg border p-3.5">
          <div className="text-foreground/80 flex items-center gap-1.5 text-xs font-semibold">
            <Sparkles className="text-primary size-3.5" />
            <span>QUICK MOCK DEMO ACCESS</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleQuickReturning}
              className="flex h-auto flex-col items-start rounded-xl border-[#13c2b6]/40 bg-[#f6fbfe] px-3 py-2 text-left hover:border-[#13c2b6]"
            >
              <span className="text-xs font-bold text-black">
                Returning Student
              </span>
              <span className="text-[10px] leading-tight text-[#666666]">
                Hamza (4 applications)
              </span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleQuickFirstTime}
              className="flex h-auto flex-col items-start rounded-xl border-[#87cbde]/50 bg-[#f6fbfe] px-3 py-2 text-left hover:border-[#27b2d7]"
            >
              <span className="text-xs font-bold text-[#27b2d7]">
                First-Time Student
              </span>
              <span className="text-[10px] leading-tight text-[#666666]">
                Ayesha (Start new app)
              </span>
            </Button>
          </div>
        </div>

        <form onSubmit={handleManualLogin} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="cnic-input" className="text-xs font-medium">
              National ID (CNIC / NICOP)
            </Label>
            <Input
              id="cnic-input"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              placeholder="35202-1234567-1"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="password-input" className="font-medium">
                Password
              </Label>
              <a
                href="#forgot"
                className="text-primary font-medium hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-semibold"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In with CNIC'}
          </Button>

          <p className="text-muted-foreground text-center text-[11px]">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={handleQuickFirstTime}
              className="text-primary font-semibold hover:underline"
            >
              Register as New Student
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
