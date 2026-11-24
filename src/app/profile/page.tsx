'use client';

import * as React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Mail,
  GraduationCap,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PortalShell } from '@/components/layout/PortalShell';
import { useAppStore } from '@/store/use-app-store';

export default function ProfilePage() {
  const { studentData } = useAppStore();
  const student = studentData?.student;

  const [fullName, setFullName] = React.useState(
    student?.fullName || 'Hamza Tariq Malik'
  );
  const [fatherName, setFatherName] = React.useState(
    student?.fatherOrHusbandName || 'Tariq Malik'
  );
  const [email, setEmail] = React.useState(
    student?.email || 'hamza.tariq@alumni.nust.edu.pk'
  );
  const [mobile, setMobile] = React.useState(
    student?.mobileNumber || '+92-300-1234567'
  );
  const [postalAddress, setPostalAddress] = React.useState(
    student?.postalAddress?.line1 || 'House 14-B, Sector G, Phase 5, DHA'
  );
  const [city, setCity] = React.useState(
    student?.postalAddress?.city || 'Lahore'
  );
  const [postalCode, setPostalCode] = React.useState(
    student?.postalAddress?.postalCode || '54792'
  );
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const cnic = student?.cnic || '35202-1928374-1';
  const completionPercentage = studentData?.profileCompletionPercentage || 92;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <PortalShell>
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Save confirmation */}
        {saveSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>
              Student profile and contact records updated successfully in HEC
              National Register!
            </span>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <div className="flex size-16 items-center justify-center rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-600 to-teal-800 text-2xl font-bold text-white shadow-lg sm:size-20">
                  {fullName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-slate-900">
                  <CheckCircle2 className="size-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {fullName}
                  </h1>
                  <Badge variant="approved" className="gap-1 text-[10px]">
                    <ShieldCheck className="size-3" />
                    NADRA Linked
                  </Badge>
                </div>
                <p className="font-mono text-xs text-slate-300 sm:text-sm">
                  HEC-ID: {student?.id?.toUpperCase() || 'STD-98214'} • CNIC:{' '}
                  {cnic}
                </p>
              </div>
            </div>

            <div className="shrink-0 space-y-2 rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:w-64">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Profile Completeness</span>
                <span className="font-bold text-emerald-400">
                  {completionPercentage}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="block pt-0.5 text-[10px] text-slate-400">
                Ready for Foreign Attestation & Equivalence
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-8">
          {/* Section 1: National Identification */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2 text-base font-bold">
                <ShieldCheck className="text-primary size-4" />
                <span>National Identity (Verified with NADRA)</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Official citizen details verified against the National Database
                and Registration Authority.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Full Name (as per CNIC / Matric)
                  </Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-muted/30 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Father / Husband Name
                  </Label>
                  <Input
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="bg-muted/30 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Computerized National Identity Card (CNIC)
                  </Label>
                  <div className="relative">
                    <Input
                      value={cnic}
                      disabled
                      className="bg-muted/60 pr-20 font-mono text-xs"
                    />
                    <Badge
                      variant="approved"
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-[10px]"
                    >
                      Locked
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Date of Birth</Label>
                  <Input
                    defaultValue={student?.dateOfBirth || '1999-04-12'}
                    disabled
                    className="bg-muted/60 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Domicile District & Province
                  </Label>
                  <Input
                    defaultValue="Lahore, Punjab"
                    disabled
                    className="bg-muted/60 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Nationality</Label>
                  <Input
                    defaultValue="Pakistani"
                    disabled
                    className="bg-muted/60 text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Contact Details */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2 text-base font-bold">
                <Mail className="text-primary size-4" />
                <span>Contact Details & Postal Address</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Your primary dispatch address for attested document deliveries
                via secure courier.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Email Address (Official Updates)
                  </Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Mobile Phone (SMS Notifications)
                  </Label>
                  <Input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="bg-background text-xs"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold">
                    Postal Delivery Address (Line 1)
                  </Label>
                  <Input
                    value={postalAddress}
                    onChange={(e) => setPostalAddress(e.target.value)}
                    className="bg-background text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">City</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-background text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Postal / ZIP Code
                  </Label>
                  <Input
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="bg-background font-mono text-xs"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-border flex justify-end border-t pt-4">
              <Button
                type="submit"
                className="gap-1.5 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                <Save className="size-3.5" />
                <span>Save Profile Changes</span>
              </Button>
            </CardFooter>
          </Card>

          {/* Section 3: Verified Academic History (PQR) */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2 text-base font-bold">
                <GraduationCap className="text-primary size-4" />
                <span>PQR Academic Record Linkage</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Institutions and qualification records indexed in the Pakistan
                Qualification Register.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="border-border bg-card space-y-1 rounded-xl border p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-xs font-bold sm:text-sm">
                    National University of Sciences and Technology (NUST)
                  </span>
                  <Badge variant="approved" className="text-[10px]">
                    NCEAC Accredited
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  Bachelor of Science in Computer Science • Roll #
                  19-SEECS-BSCS-044 • Class of 2023
                </p>
              </div>

              <div className="border-border bg-card space-y-1 rounded-xl border p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-xs font-bold sm:text-sm">
                    Board of Intermediate and Secondary Education (BISE) Lahore
                  </span>
                  <Badge variant="approved" className="text-[10px]">
                    Verified
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  Higher Secondary Certificate (HSSC Pre-Engineering) • Roll #
                  491028 • Year 2020
                </p>
              </div>

              <div className="border-border bg-card space-y-1 rounded-xl border p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-xs font-bold sm:text-sm">
                    Federal Board of Intermediate and Secondary Education
                    (FBISE)
                  </span>
                  <Badge variant="approved" className="text-[10px]">
                    Verified
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  Secondary School Certificate (SSC Science Group) • Roll #
                  109284 • Year 2018
                </p>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </PortalShell>
  );
}
