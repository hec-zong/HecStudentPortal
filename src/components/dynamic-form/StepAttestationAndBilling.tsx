'use client';

import * as React from 'react';
import { CreditCard, CheckCircle2, FileCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { InlineFileDropzone } from '@/components/dynamic-form/InlineFileDropzone';

export interface StepAttestationAndBillingProps {
  currentStepNumber: number;
  formValues: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export function StepAttestationAndBilling({
  currentStepNumber,
  formValues,
  onChange,
}: StepAttestationAndBillingProps) {
  const [attestOriginalDegree, setAttestOriginalDegree] = React.useState(true);
  const [degreeCopies, setDegreeCopies] = React.useState(1);
  const [attestOriginalTranscript, setAttestOriginalTranscript] =
    React.useState(true);
  const [transcriptCopies, setTranscriptCopies] = React.useState(1);
  const [deliveryMode, setDeliveryMode] = React.useState<'courier' | 'pickup'>(
    'courier'
  );
  const [paidReceiptNotice, setPaidReceiptNotice] = React.useState<
    string | null
  >(null);

  const psid = (formValues.psid as string) || '10009283749201948';

  const originalDegreeFee = attestOriginalDegree ? 1000 : 0;
  const degreeCopiesFee = degreeCopies * 700;
  const originalTranscriptFee = attestOriginalTranscript ? 1000 : 0;
  const transcriptCopiesFee = transcriptCopies * 700;
  const courierFee = deliveryMode === 'courier' ? 300 : 0;
  const totalAmount =
    originalDegreeFee +
    degreeCopiesFee +
    originalTranscriptFee +
    transcriptCopiesFee +
    courierFee;

  React.useEffect(() => {
    onChange('totalAmount', totalAmount);
    onChange('deliveryMode', deliveryMode);
    onChange('psid', psid);
  }, [totalAmount, deliveryMode, psid, onChange]);

  // Step 3: Degree Attestation Selection & Fee Breakdown
  if (currentStepNumber === 3) {
    return (
      <div className="space-y-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="border-primary/30 text-primary text-xs"
              >
                Step 3 of 5
              </Badge>
              <Badge variant="inProgress" className="gap-1 text-[10px]">
                <CreditCard className="size-3" />
                Statutory Fee Schedule
              </Badge>
            </div>
            <CardTitle className="text-foreground text-base font-bold sm:text-lg">
              Select Attestation Documents & Certified Copies
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              Configure which original degrees and photocopies require forensic
              stamping and digital QR embossing.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="border-border bg-card flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={attestOriginalDegree}
                  onCheckedChange={(c) => setAttestOriginalDegree(Boolean(c))}
                />
                <div>
                  <h4 className="text-foreground text-xs font-bold sm:text-sm">
                    Original Degree Parchment (Sanad)
                  </h4>
                  <p className="text-muted-foreground text-xs">
                    Physical parchment embossed with holographic security seal.
                  </p>
                </div>
              </div>
              <span className="text-foreground font-mono text-xs font-bold sm:text-sm">
                PKR 1,000
              </span>
            </div>

            <div className="border-border bg-card flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
              <div>
                <h4 className="text-foreground text-xs font-bold sm:text-sm">
                  Photocopies of Degree
                </h4>
                <p className="text-muted-foreground text-xs">
                  PKR 700 per copy stamped with attested original mark.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={degreeCopies}
                  onChange={(e) => setDegreeCopies(Number(e.target.value))}
                  className="border-input bg-background h-9 rounded-lg border px-2 text-xs"
                >
                  <option value={0}>0 copies</option>
                  <option value={1}>1 copy (PKR 700)</option>
                  <option value={2}>2 copies (PKR 1,400)</option>
                  <option value={3}>3 copies (PKR 2,100)</option>
                </select>
                <span className="text-foreground w-20 text-right font-mono text-xs font-bold sm:text-sm">
                  PKR {degreeCopiesFee.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="border-border bg-card flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={attestOriginalTranscript}
                  onCheckedChange={(c) =>
                    setAttestOriginalTranscript(Boolean(c))
                  }
                />
                <div>
                  <h4 className="text-foreground text-xs font-bold sm:text-sm">
                    Original Official Transcript / DMC
                  </h4>
                  <p className="text-muted-foreground text-xs">
                    Official detailed marks sheet / grades transcript.
                  </p>
                </div>
              </div>
              <span className="text-foreground font-mono text-xs font-bold sm:text-sm">
                PKR 1,000
              </span>
            </div>

            <div className="border-border bg-card flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
              <div>
                <h4 className="text-foreground text-xs font-bold sm:text-sm">
                  Photocopies of Transcript
                </h4>
                <p className="text-muted-foreground text-xs">
                  PKR 700 per copy stamped with attested mark.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={transcriptCopies}
                  onChange={(e) => setTranscriptCopies(Number(e.target.value))}
                  className="border-input bg-background h-9 rounded-lg border px-2 text-xs"
                >
                  <option value={0}>0 copies</option>
                  <option value={1}>1 copy (PKR 700)</option>
                  <option value={2}>2 copies (PKR 1,400)</option>
                </select>
                <span className="text-foreground w-20 text-right font-mono text-xs font-bold sm:text-sm">
                  PKR {transcriptCopiesFee.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="border-border bg-muted/40 space-y-3 rounded-xl border p-4">
              <span className="text-foreground block text-xs font-bold">
                Delivery / Return Channel
              </span>
              <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMode('courier')}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    deliveryMode === 'courier'
                      ? 'bg-background border-emerald-500 font-semibold shadow'
                      : 'border-border text-muted-foreground bg-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Secure TCS Courier Service</span>
                    <span className="font-mono font-bold">+PKR 300</span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-[11px]">
                    Delivered to your postal address in 3 business days.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMode('pickup')}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    deliveryMode === 'pickup'
                      ? 'bg-background border-emerald-500 font-semibold shadow'
                      : 'border-border text-muted-foreground bg-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Regional Center Walk-In Pickup</span>
                    <span className="font-mono font-bold">Free</span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-[11px]">
                    Collect at HEC Islamabad, Lahore, or Karachi.
                  </p>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-900 p-4 text-white">
              <div>
                <span className="block text-xs text-slate-400">
                  Total Calculated Fee
                </span>
                <span className="text-xs text-emerald-400">
                  Statutory HEC Tariff Schedule
                </span>
              </div>
              <span className="font-mono text-2xl font-bold text-emerald-400">
                PKR {totalAmount.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 4: E-Challan Generation & 1-Link PSID
  if (currentStepNumber === 4) {
    return (
      <div className="space-y-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="border-primary/30 text-primary text-xs"
              >
                Step 4 of 5
              </Badge>
              <Badge variant="approved" className="gap-1 text-[10px]">
                <CreditCard className="size-3" />
                1-Link KuickPay
              </Badge>
            </div>
            <CardTitle className="text-foreground text-base font-bold sm:text-lg">
              E-Challan & 1-Link PSID Bill Settlement
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              Pay at any ATM, mobile banking app, Nayapay, SadaPay, or
              commercial bank counter.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 to-slate-900 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  1-Link Consumer PSID
                </span>
                <Badge variant="approved" className="text-[10px]">
                  Active for 72 Hours
                </Badge>
              </div>

              <div className="space-y-1">
                <span className="block font-mono text-2xl font-extrabold tracking-widest text-emerald-400 select-all sm:text-3xl">
                  {psid}
                </span>
                <span className="text-xs text-slate-400">
                  Consumer Prefix: 10009 • Billed to: Higher Education
                  Commission
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-3 text-xs sm:grid-cols-3">
                <div>
                  <span className="block text-[10px] text-slate-400">
                    PAYABLE AMOUNT
                  </span>
                  <strong className="font-mono text-sm text-white">
                    PKR {totalAmount.toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">
                    PAYMENT MODE
                  </span>
                  <strong className="text-xs text-white">
                    1-Link / ATM / Mobile App
                  </strong>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">
                    VALIDITY
                  </span>
                  <strong className="font-mono text-xs text-amber-400">
                    Valid for 3 Days
                  </strong>
                </div>
              </div>
            </div>

            <div className="border-border bg-muted/40 space-y-2 rounded-xl border p-4 text-xs">
              <h4 className="text-foreground font-bold">
                Payment Instructions:
              </h4>
              <ol className="text-muted-foreground list-inside list-decimal space-y-1">
                <li>
                  Log in to your Mobile Banking app (HBL, Meezan, Bank Alfalah,
                  Nayapay, etc.).
                </li>
                <li>
                  Go to <strong>Bill Payment</strong> &gt; Select{' '}
                  <strong>1-Bill / KuickPay</strong>.
                </li>
                <li>
                  Enter the 17-digit PSID:{' '}
                  <span className="text-foreground font-mono font-bold">
                    {psid}
                  </span>
                  .
                </li>
                <li>
                  Verify the billing amount of{' '}
                  <strong>PKR {totalAmount.toLocaleString()}</strong> and
                  authorize payment.
                </li>
                <li>Save the electronic receipt or PDF voucher for step 5.</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 5: Paid Receipt Upload & Final Declaration
  return (
    <div className="space-y-6">
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="border-primary/30 text-primary text-xs"
            >
              Step 5 of 5
            </Badge>
            <Badge variant="approved" className="gap-1 text-[10px]">
              <FileCheck className="size-3" />
              Final Submission
            </Badge>
          </div>
          <CardTitle className="text-foreground text-base font-bold sm:text-lg">
            Paid Challan Receipt Upload & Statutory Oath
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            Upload proof of payment to route your dossier directly to the
            Scrutiny Officer queue.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="border-border bg-card space-y-3 rounded-xl border p-4">
            <InlineFileDropzone
              label="Paid Bank Voucher / Mobile Banking Confirmation Screenshot"
              fieldName="paidReceiptUrl"
              value={
                (formValues.paidReceiptUrl as string) ||
                'https://storage.hec.gov.pk/mock/1link_paid_voucher.pdf'
              }
              helpText="Upload PDF or clear screenshot of your bank transfer confirmation."
              required={true}
              onFileChange={(url) => {
                onChange('paidReceiptUrl', url);
                setPaidReceiptNotice(
                  'Payment receipt attached and verified with 1-Link clearance.'
                );
              }}
              config={{
                accept: ['.pdf', '.jpg', '.jpeg', '.png'],
                maxSizeMb: 5,
                instruction: 'Drop paid 1-Link receipt or screenshot here',
              }}
            />
            {paidReceiptNotice && (
              <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3" />
                <span>{paidReceiptNotice}</span>
              </p>
            )}
          </div>

          <div className="border-border bg-muted/40 space-y-3 rounded-xl border p-4">
            <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
              Statutory Declaration & Verification Oath
            </h4>
            <div className="flex items-start gap-2.5">
              <Checkbox
                checked={Boolean(formValues.oathConfirmed ?? true)}
                onCheckedChange={(c) => onChange('oathConfirmed', Boolean(c))}
              />
              <label className="text-muted-foreground cursor-pointer text-xs leading-relaxed">
                I solemnly affirm that all academic certificates, marks sheets,
                and personal documents uploaded in this attestation application
                are genuine and authentic. I understand that submitting
                counterfeit or forged degrees is an offense punishable under the
                Pakistan Penal Code and will result in permanent blacklisting by
                the Higher Education Commission.
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
