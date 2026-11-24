'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderArchive,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Download,
  Share2,
  Copy,
  Check,
  PlusCircle,
  Building2,
  QrCode,
  Search,
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
import { PortalShell } from '@/components/layout/PortalShell';
import { useAppStore } from '@/store/use-app-store';
import type { HecWalletItem } from '@/types/portal';

interface UploadedDoc {
  id: string;
  name: string;
  category: string;
  uploadedAt: string;
  size: string;
  format: string;
  status: 'verified' | 'pending';
  fileUrl: string;
}

const MOCK_UPLOADED_DOCUMENTS: UploadedDoc[] = [
  {
    id: 'doc-01',
    name: 'Computerized National Identity Card (Front)',
    category: 'NADRA Identification',
    uploadedAt: '2024-01-15',
    size: '1.2 MB',
    format: 'PNG',
    status: 'verified',
    fileUrl: 'https://storage.hec.gov.pk/mock/cnic-front-35202.png',
  },
  {
    id: 'doc-02',
    name: 'Computerized National Identity Card (Back)',
    category: 'NADRA Identification',
    uploadedAt: '2024-01-15',
    size: '1.1 MB',
    format: 'PNG',
    status: 'verified',
    fileUrl: 'https://storage.hec.gov.pk/mock/cnic-back-35202.png',
  },
  {
    id: 'doc-03',
    name: 'Secondary School Certificate (Matric Sanad)',
    category: 'Secondary Education',
    uploadedAt: '2024-02-10',
    size: '2.4 MB',
    format: 'PDF',
    status: 'verified',
    fileUrl: 'https://storage.hec.gov.pk/mock/matric_sanad_fbise.pdf',
  },
  {
    id: 'doc-04',
    name: 'Higher Secondary School Certificate (Intermediate Sanad)',
    category: 'Higher Secondary',
    uploadedAt: '2024-02-12',
    size: '2.8 MB',
    format: 'PDF',
    status: 'verified',
    fileUrl: 'https://storage.hec.gov.pk/mock/hssc_sanad_bise_lhr.pdf',
  },
  {
    id: 'doc-05',
    name: 'Bachelor of Science in Computer Science Degree Parchment',
    category: 'Higher Education (PQR)',
    uploadedAt: '2026-11-18',
    size: '3.6 MB',
    format: 'PDF',
    status: 'verified',
    fileUrl: 'https://storage.hec.gov.pk/mock/bs-degree-original.pdf',
  },
  {
    id: 'doc-06',
    name: 'BS Official Transcript (Consolidated Grades Sheet)',
    category: 'Higher Education (PQR)',
    uploadedAt: '2026-11-21',
    size: '4.1 MB',
    format: 'PDF',
    status: 'pending',
    fileUrl: 'https://storage.hec.gov.pk/mock/bs-transcript-flatbed.pdf',
  },
];

export default function AssetsPage() {
  const router = useRouter();
  const { studentData, setActiveModal } = useAppStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = React.useState<string | null>(
    null
  );

  const walletItems: HecWalletItem[] = studentData?.hecWallet || [];

  const handleCopyHash = (hash: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2500);
    }
  };

  const handleDownloadPdf = (serial: string) => {
    setDownloadNotice(
      `Official forensic attestation slip for ${serial} generated.`
    );
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const filteredWalletItems = walletItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUploadedDocs = MOCK_UPLOADED_DOCUMENTS.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PortalShell>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Download notification */}
        {downloadNotice && (
          <div className="flex items-center gap-2 rounded-xl border border-[#13c2b6]/30 bg-[#f6fbfe] p-3 text-xs text-black">
            <CheckCircle2 className="size-4 shrink-0 text-[#13c2b6]" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white p-6 text-black shadow-[0_10px_28px_rgba(8,27,88,0.06)] sm:p-8">
          <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-[#87cbde]/15 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-[#13c2b6]/40 bg-[#f6fbfe] text-xs text-[#27b2d7]"
                >
                  National Digital Credential Registry
                </Badge>
                <Badge variant="approved" className="gap-1 text-[10px]">
                  <ShieldCheck className="size-3" />
                  E-Vault v2.4
                </Badge>
              </div>

              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                My Degrees & Digital Assets Vault
              </h1>

              <p className="max-w-2xl text-xs text-[#666666] sm:text-sm">
                Tamper-evident, cryptographically sealed academic credentials
                verified under the Higher Education Commission Ordinance.
                Recognized by international universities and overseas foreign
                missions.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2.5">
              <Button
                onClick={() => router.push('/apply')}
                className="gap-1.5 bg-[#13c2b6] text-xs font-bold text-black shadow-[0_10px_28px_rgba(8,27,88,0.08)] hover:bg-[#27b2d7]"
              >
                <PlusCircle className="size-3.5" />
                <span>Attest New Degree</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => setActiveModal('share_proof')}
                className="gap-1.5 border-[#e5e5e5] bg-white text-xs font-semibold text-black hover:border-[#27b2d7] hover:bg-[#f6fbfe]"
              >
                <Share2 className="size-3.5 text-[#13c2b6]" />
                <span>Share Proof</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#666666]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified credentials, universities, or document scans..."
            className="h-10 border-[#e5e5e5] bg-white pl-9 text-xs text-black placeholder:text-[#666666]"
          />
        </div>

        {/* Section 1: Attested Degree Certificates (HEC Wallet) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-foreground flex items-center gap-2 text-lg font-bold tracking-tight">
                <GraduationCap className="text-primary size-5" />
                <span>
                  Attested Degrees & Sanads ({filteredWalletItems.length})
                </span>
              </h2>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Physical embossed credentials mirrored in your cryptographic
                digital wallet.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredWalletItems.length === 0 ? (
              <div className="text-muted-foreground col-span-2 rounded-xl border border-dashed p-8 text-center text-xs">
                No attested degrees found matching your search.
              </div>
            ) : (
              filteredWalletItems.map((item) => (
                <Card
                  key={item.id}
                  className="relative overflow-hidden rounded-2xl border-[#e5e5e5] bg-white shadow-[0_10px_28px_rgba(8,27,88,0.06)] transition-all hover:border-[#13c2b6]"
                >
                  <div className="pointer-events-none absolute top-0 right-0 h-28 w-28 rounded-bl-full bg-[#87cbde]/10" />

                  <CardHeader className="space-y-3 p-6 pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="approved" className="gap-1 text-[11px]">
                        <CheckCircle2 className="size-3.5" />
                        Forensically Sealed
                      </Badge>

                      <span className="font-mono text-xs font-semibold text-[#666666]">
                        {item.serialNumber}
                      </span>
                    </div>

                    <div>
                      <CardTitle className="text-base font-bold text-black">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-1.5 text-xs text-[#666666]">
                        <Building2 className="size-3.5 text-[#13c2b6]" />
                        <span>{item.university}</span>
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 p-6 pt-0 text-xs text-[#666666]">
                    <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#e5e5e5] bg-[#f6fbfe] p-3 font-mono text-[11px]">
                      <div>
                        <span className="block text-[10px] text-[#666666]">
                          PROGRAM
                        </span>
                        <span className="font-semibold text-black">
                          {item.programName}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#666666]">
                          ATTESTATION DATE
                        </span>
                        <span className="font-semibold text-black">
                          {item.attestationDate}
                        </span>
                      </div>
                      <div className="col-span-2 border-t border-[#e5e5e5] pt-1">
                        <span className="block text-[10px] text-[#666666]">
                          ISSUED BY
                        </span>
                        <span className="font-medium text-black">
                          {item.issuedBy}
                        </span>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <span className="block text-[10px] text-[#666666]">
                          CRYPTOGRAPHIC VERIFICATION HASH
                        </span>
                        <div className="flex items-center justify-between rounded-xl border border-[#e5e5e5] bg-white p-2">
                          <span className="max-w-[260px] truncate font-mono text-[10px] font-bold text-black">
                            {item.verificationHash}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyHash(item.verificationHash)
                            }
                            className="ml-1 flex shrink-0 items-center gap-1 text-[10px] text-[#666666] hover:text-black"
                          >
                            {copiedHash === item.verificationHash ? (
                              <Check className="size-3 text-[#13c2b6]" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between gap-3 border-t border-[#e5e5e5] p-6 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPdf(item.serialNumber)}
                      className="gap-1.5 border-[#e5e5e5] text-xs text-black hover:border-[#27b2d7] hover:bg-[#f6fbfe]"
                    >
                      <Download className="size-3.5 text-[#13c2b6]" />
                      <span>Download PDF</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => setActiveModal('share_proof')}
                      className="gap-1.5 bg-[#13c2b6] text-xs font-bold text-black hover:bg-[#27b2d7]"
                    >
                      <QrCode className="size-3.5" />
                      <span>Verify & Share QR</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Section 2: Uploaded Document Repository */}
        <div className="space-y-4 pt-4">
          <div>
            <h2 className="text-foreground flex items-center gap-2 text-lg font-bold tracking-tight">
              <FolderArchive className="text-primary size-5" />
              <span>
                Uploaded Documents & Identification Repository (
                {filteredUploadedDocs.length})
              </span>
            </h2>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Source scans of your identity cards, matric/intermediate
              certificates, and university transcripts.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUploadedDocs.map((doc) => (
              <Card
                key={doc.id}
                className="border-border hover:border-border/80 transition-all"
              >
                <CardHeader className="space-y-1 pb-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        doc.status === 'verified' ? 'approved' : 'inProgress'
                      }
                      className="text-[10px]"
                    >
                      {doc.status === 'verified' ? 'Verified' : 'Under Review'}
                    </Badge>
                    <span className="text-muted-foreground font-mono text-[10px]">
                      {doc.format} • {doc.size}
                    </span>
                  </div>
                  <CardTitle className="text-foreground line-clamp-1 text-xs font-bold sm:text-sm">
                    {doc.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-[11px]">
                    {doc.category}
                  </CardDescription>
                </CardHeader>

                <CardContent className="text-muted-foreground pt-1 pb-3 text-[11px]">
                  <span className="block">Uploaded: {doc.uploadedAt}</span>
                </CardContent>

                <CardFooter className="border-border/50 flex items-center justify-between border-t pt-2">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-[#13c2b6]">
                    <ShieldCheck className="size-3" />
                    Encrypted Scan
                  </span>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownloadPdf(doc.name)}
                    className="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 text-xs"
                  >
                    <Download className="size-3" />
                    <span>Download</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
