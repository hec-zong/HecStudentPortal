'use client';

import * as React from 'react';
import {
  ShieldCheck,
  Bell,
  Lock,
  Smartphone,
  CheckCircle2,
  Save,
  KeyRound,
  Laptop,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PortalShell } from '@/components/layout/PortalShell';

export default function SettingsPage() {
  const [smsAlerts, setSmsAlerts] = React.useState(true);
  const [emailReceipts, setEmailReceipts] = React.useState(true);
  const [whatsappDelivery, setWhatsappDelivery] = React.useState(true);

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [saveSuccess, setSaveSuccess] = React.useState<string | null>(null);

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess('Communication and dispatch alerts saved.');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      alert('Passwords do not match or are empty.');
      return;
    }
    setSaveSuccess('Security credentials and password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  return (
    <PortalShell>
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Notice alert */}
        {saveSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-emerald-400/40 text-xs text-emerald-400"
              >
                Security & Preferences
              </Badge>
              <Badge variant="approved" className="gap-1 text-[10px]">
                <ShieldCheck className="size-3" />
                2FA Active
              </Badge>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Account Preferences & Security Settings
            </h1>

            <p className="max-w-2xl text-xs text-slate-300 sm:text-sm">
              Configure communication channels for forensic attestation
              milestones, update password credentials, and audit active
              sessions.
            </p>
          </div>
        </div>

        {/* Section 1: Notification & Dispatch Preferences */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base font-bold">
              <Bell className="text-primary size-4" />
              <span>Attestation Notification Channels</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              Select which channels should receive immediate stage progression
              alerts and courier tracking updates.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSaveNotifications} className="space-y-4">
              <div className="border-border bg-card flex items-start gap-3 rounded-xl border p-3.5">
                <Checkbox
                  checked={smsAlerts}
                  onCheckedChange={(c) => setSmsAlerts(Boolean(c))}
                />
                <div className="space-y-0.5">
                  <span className="text-foreground block text-xs font-semibold sm:text-sm">
                    Mobile SMS Stage Alerts (Fast-Track)
                  </span>
                  <p className="text-muted-foreground text-xs">
                    Receive instant SMS when your file moves through Scrutiny,
                    L1/L2 Controllers, and Hologram affixation.
                  </p>
                </div>
              </div>

              <div className="border-border bg-card flex items-start gap-3 rounded-xl border p-3.5">
                <Checkbox
                  checked={emailReceipts}
                  onCheckedChange={(c) => setEmailReceipts(Boolean(c))}
                />
                <div className="space-y-0.5">
                  <span className="text-foreground block text-xs font-semibold sm:text-sm">
                    Email Invoices & PDF Reports
                  </span>
                  <p className="text-muted-foreground text-xs">
                    Receive 1-Link PSID e-challan receipts, controller
                    discrepancy notices, and electronic copies of attested
                    slips.
                  </p>
                </div>
              </div>

              <div className="border-border bg-card flex items-start gap-3 rounded-xl border p-3.5">
                <Checkbox
                  checked={whatsappDelivery}
                  onCheckedChange={(c) => setWhatsappDelivery(Boolean(c))}
                />
                <div className="space-y-0.5">
                  <span className="text-foreground block text-xs font-semibold sm:text-sm">
                    WhatsApp Courier Tracking Alerts
                  </span>
                  <p className="text-muted-foreground text-xs">
                    Receive automated Leopard / TCS airway bill tracking codes
                    with live delivery status.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-semibold"
                >
                  <Save className="size-3.5" />
                  <span>Update Notification Preferences</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Section 2: Account Security & Password */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base font-bold">
              <KeyRound className="text-primary size-4" />
              <span>Password & Authentication Credentials</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              Ensure your password uses at least 8 characters, a number, and a
              special symbol.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleChangePassword}
              className="max-w-xl space-y-4"
            >
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Current Password
                </Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Confirm New Password
                </Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background text-xs"
                />
              </div>

              <Button
                type="submit"
                className="gap-1.5 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                <Lock className="size-3.5" />
                <span>Save New Password</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Section 3: Active Device Sessions */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base font-bold">
              <Laptop className="text-primary size-4" />
              <span>Active Browser Sessions</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              Devices currently signed in to your HEC E-Portal account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="border-border bg-muted/40 flex items-center justify-between rounded-xl border p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Laptop className="size-5" />
                </div>
                <div>
                  <span className="text-foreground block text-xs font-bold sm:text-sm">
                    Linux Chrome Browser • Lahore, Pakistan
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Current active session • IP: 182.180.91.44
                  </span>
                </div>
              </div>

              <Badge variant="approved" className="text-[10px]">
                Active Now
              </Badge>
            </div>

            <div className="border-border bg-card flex items-center justify-between rounded-xl border p-3.5">
              <div className="flex items-center gap-3">
                <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-lg">
                  <Smartphone className="size-5" />
                </div>
                <div>
                  <span className="text-foreground block text-xs font-bold sm:text-sm">
                    iOS Mobile Safari • Islamabad, Pakistan
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Last active: 2 days ago • IP: 39.40.118.29
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:bg-destructive/10 h-7 text-xs"
              >
                Terminate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
