'use client';

import * as React from 'react';
import {
  Printer,
  Copy,
  Check,
  CreditCard,
  Building2,
  FileText,
  ShieldCheck,
  Smartphone,
  Receipt,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { portalService } from '@/services/portalService';
import type { EChallan, AttestedDegreeSelection } from '@/types/portal';

export interface StepChallanGenerationProps {
  applicationId: string;
  formValues: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export function StepChallanGeneration({
  applicationId,
  formValues,
  onChange,
}: StepChallanGenerationProps) {
  const [challan, setChallan] = React.useState<EChallan | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasCopiedPsid, setHasCopiedPsid] = React.useState(false);
  const [showPrintModal, setShowPrintModal] = React.useState(false);

  // Generate or retrieve Challan on mount
  React.useEffect(() => {
    let isMounted = true;
    const selections =
      (formValues.attestationSelection as AttestedDegreeSelection[]) || [];

    portalService
      .createOrGetChallan({
        applicationId,
        degrees: selections,
      })
      .then((generated) => {
        if (isMounted) {
          setChallan(generated);
          setIsLoading(false);
          onChange('psid', generated.psid);
          onChange('challanNumber', generated.challanNumber);
          onChange('totalAmount', generated.totalAmount);
        }
      })
      .catch((err) => {
        console.error('Failed to generate challan:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [applicationId, formValues.attestationSelection, onChange]);

  const copyPsidToClipboard = () => {
    if (!challan) return;
    navigator.clipboard.writeText(challan.psid);
    setHasCopiedPsid(true);
    setTimeout(() => setHasCopiedPsid(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !challan) {
    return (
      <Card className="border-border p-12 text-center shadow-sm">
        <CreditCard className="text-primary mx-auto mb-3 size-8 animate-pulse" />
        <h3 className="text-foreground text-base font-bold">
          Generating 1-Link PSID E-Challan...
        </h3>
        <p className="text-muted-foreground mt-1 text-xs">
          Connecting to HEC 1-Bill Gateway to provision official statutory fee
          voucher.
        </p>
      </Card>
    );
  }

  // Format PSID with readable dashes: 10009 82348 12391 02
  const formattedPsid = challan.psid.replace(
    /(\d{5})(\d{5})(\d{5})(\d{2})/,
    '$1-$2-$3-$4'
  );

  return (
    <div className="space-y-6">
      {/* 1. Header & Context */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="space-y-0.5">
          <h3 className="text-foreground flex items-center gap-2 text-base font-bold sm:text-lg">
            <Receipt className="text-primary size-5" />
            <span>Step 4: Official E-Challan & 1-Link PSID Generation</span>
          </h3>
          <p className="text-muted-foreground text-xs">
            Your itemized fee voucher has been issued. Pay via any Pakistani
            banking app, ATM, or bank branch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPrintModal(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <Printer className="size-3.5" />
            <span>Print / Download Challan</span>
          </Button>
          <Badge
            variant="outline"
            className="text-primary border-primary/30 font-mono text-xs"
          >
            Step 4 of 5
          </Badge>
        </div>
      </div>

      {/* 2. Hero PSID Highlight Card */}
      <Card className="relative overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white text-black shadow-[0_10px_28px_rgba(8,27,88,0.06)]">
        <div className="pointer-events-none absolute top-0 right-0 p-8 opacity-5">
          <CreditCard className="size-48" />
        </div>

        <CardHeader className="border-b border-[#e5e5e5] p-6 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="block font-mono text-[10px] tracking-wider text-[#666666] uppercase">
                1-Link Consumer Number (PSID)
              </span>
              <Badge variant="inProgress" className="text-[9px]">
                Valid for 7 Days
              </Badge>
            </div>
            <span className="font-mono text-xs text-[#666666]">
              Voucher No:{' '}
              <strong className="text-black">{challan.challanNumber}</strong>
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-6 pt-4">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e5e5e5] bg-[#f6fbfe] p-4 md:flex-row md:items-center">
            <div className="space-y-1">
              <span className="block text-[11px] font-bold tracking-wider text-[#666666] uppercase">
                17-Digit 1-Link PSID / Consumer ID
              </span>
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-extrabold tracking-wider text-black sm:text-2xl">
                  {formattedPsid}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={copyPsidToClipboard}
                  className="h-8 gap-1.5 border-[#e5e5e5] bg-white text-xs font-semibold text-black hover:border-[#27b2d7] hover:bg-[#f6fbfe]"
                >
                  {hasCopiedPsid ? (
                    <>
                      <Check className="size-3 text-[#13c2b6]" />
                      <span className="font-bold text-[#13c2b6]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      <span>Copy PSID</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-0.5 border-t border-[#e5e5e5] pt-3 text-left md:border-t-0 md:border-l md:pt-0 md:pl-6 md:text-right">
              <span className="block text-[11px] font-bold text-[#666666] uppercase">
                Total Amount Due
              </span>
              <span className="font-heading text-2xl font-extrabold text-black sm:text-3xl">
                PKR {challan.totalAmount.toLocaleString()}
              </span>
              <span className="block text-[10px] text-[#666666]">
                Due Date: {challan.dueDate}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            <div className="border-border bg-card rounded-lg border p-2.5">
              <span className="text-muted-foreground block text-[10px] uppercase">
                Issue Date
              </span>
              <span className="text-foreground font-semibold">
                {challan.issueDate}
              </span>
            </div>
            <div className="border-border bg-card rounded-lg border p-2.5">
              <span className="text-muted-foreground block text-[10px] uppercase">
                Due Date
              </span>
              <span className="text-foreground font-semibold">
                {challan.dueDate}
              </span>
            </div>
            <div className="border-border bg-card rounded-lg border p-2.5">
              <span className="text-muted-foreground block text-[10px] uppercase">
                Payment Status
              </span>
              <Badge variant="inProgress" className="mt-0.5 text-[9px]">
                Unpaid / Awaiting Settlement
              </Badge>
            </div>
            <div className="border-border bg-card rounded-lg border p-2.5">
              <span className="text-muted-foreground block text-[10px] uppercase">
                Bill Category
              </span>
              <span className="text-foreground font-mono font-semibold">
                1-Bill / Govt Fee
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Itemized Fee Voucher Table */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-border border-b pb-3">
          <CardTitle className="text-foreground flex items-center gap-2 text-sm font-bold">
            <FileText className="text-primary size-4" />
            <span>Itemized Attestation Fee Breakdown</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            Official breakdown of attested degrees, certified copies, and
            courier handling fees.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-border text-muted-foreground border-b text-[10px] font-bold uppercase">
                <tr>
                  <th className="px-4 py-2.5">Line Item Description</th>
                  <th className="px-3 py-2.5 text-center">Qty</th>
                  <th className="px-4 py-2.5 text-right">Unit Rate</th>
                  <th className="px-4 py-2.5 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {challan.itemsBreakdown.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/20">
                    <td className="text-foreground px-4 py-3 font-medium">
                      {item.description}
                    </td>
                    <td className="px-3 py-3 text-center font-mono">
                      {item.quantity}
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-right font-mono">
                      PKR {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="text-foreground px-4 py-3 text-right font-mono font-bold">
                      PKR {item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/40 border-border border-t font-bold">
                <tr>
                  <td
                    colSpan={3}
                    className="text-muted-foreground px-4 py-3 text-right text-[11px] uppercase"
                  >
                    Grand Total Payable (PKR):
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-bold text-black">
                    PKR {challan.totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Payment Channels & Guidance */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Mobile Banking */}
        <div className="space-y-2 rounded-2xl border border-[#e5e5e5] bg-white p-5 shadow-[0_10px_28px_rgba(8,27,88,0.04)]">
          <div className="flex items-center gap-2 text-xs font-bold text-black">
            <Smartphone className="size-4 text-[#13c2b6]" />
            <span>Mobile Banking / ATM (1-Bill)</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#666666]">
            Open EasyPaisa, JazzCash, Nayapay, HBL Mobile, or Meezan. Select{' '}
            <strong>Bill Payment &gt; 1-Bill</strong>, and paste your 17-digit
            PSID.
          </p>
        </div>

        {/* Kuickpay */}
        <div className="space-y-2 rounded-2xl border border-[#e5e5e5] bg-white p-5 shadow-[0_10px_28px_rgba(8,27,88,0.04)]">
          <div className="flex items-center gap-2 text-xs font-bold text-black">
            <CreditCard className="size-4 text-[#27b2d7]" />
            <span>Kuickpay Portal</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#666666]">
            Pay via Kuickpay checkout using debit card or Internet banking with
            institutional merchant code <strong>HEC01</strong>.
          </p>
        </div>

        {/* Bank Counter */}
        <div className="space-y-2 rounded-2xl border border-[#e5e5e5] bg-white p-5 shadow-[0_10px_28px_rgba(8,27,88,0.04)]">
          <div className="flex items-center gap-2 text-xs font-bold text-black">
            <Building2 className="size-4 text-[#27b2d7]" />
            <span>Bank Branch Counter</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#666666]">
            Print this challan voucher and deposit cash over-the-counter at any
            branch of <strong>Habib Bank Ltd (HBL)</strong> or{' '}
            <strong>NBP</strong> nationwide.
          </p>
        </div>
      </div>

      {/* 5. Print / Download Challan Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-4xl space-y-6 rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-[#13c2b6]" />
                <h4 className="text-base font-bold text-black">
                  Official HEC E-Challan Fee Voucher (Printable Preview)
                </h4>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPrintModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* 3-Part Bank Voucher Simulation */}
            <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
              {['Student Copy', 'Bank Copy', 'HEC Treasury Copy'].map(
                (copyTitle, idx) => (
                  <div
                    key={idx}
                    className="border-border bg-muted/10 relative space-y-3 rounded-xl border p-3.5"
                  >
                    <div className="border-border space-y-0.5 border-b border-dashed pb-2 text-center">
                      <span className="text-primary block text-[9px] font-bold tracking-wider uppercase">
                        Higher Education Commission
                      </span>
                      <span className="text-foreground block text-xs font-bold">
                        Attestation Fee Challan
                      </span>
                      <Badge variant="outline" className="font-mono text-[9px]">
                        {copyTitle}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">PSID:</span>
                        <span className="text-foreground font-mono font-bold">
                          {challan.psid}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Voucher:</span>
                        <span className="text-foreground font-mono">
                          {challan.challanNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CNIC:</span>
                        <span className="text-foreground font-mono">
                          {challan.studentCnic}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Applicant:
                        </span>
                        <span className="text-foreground max-w-[120px] truncate">
                          {challan.studentName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span className="text-foreground">
                          {challan.dueDate}
                        </span>
                      </div>
                    </div>

                    <div className="border-border space-y-1 border-t pt-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Total (PKR):</span>
                        <span className="font-mono font-bold text-black">
                          PKR {challan.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="border-border border-t border-dashed pt-6 text-center">
                      <span className="text-muted-foreground block text-[9px]">
                        Authorized Bank / Cashier Stamp
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="border-border flex items-center justify-end gap-2 border-t pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPrintModal(false)}
              >
                Close Preview
              </Button>
              <Button
                type="button"
                onClick={handlePrint}
                className="bg-primary text-primary-foreground gap-1.5 text-xs font-semibold"
              >
                <Printer className="size-3.5" />
                <span>Print Document</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
