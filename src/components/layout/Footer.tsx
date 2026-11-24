import Link from 'next/link';
import {
  GraduationCap,
  ShieldCheck,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] bg-white text-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#13c2b6] text-black shadow-sm">
                <GraduationCap className="size-6 text-black" />
              </div>
              <div>
                <span className="font-heading block text-lg font-bold tracking-tight text-black">
                  HEC E-Portal
                </span>
                <span className="text-xs font-medium text-[#666666]">
                  Higher Education Commission Pakistan
                </span>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-[#666666]">
              The statutory regulatory body constituted under Federal Ordinance
              to promote higher education, degree accreditation, forensic
              document attestation, and university research funding across
              Pakistan.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge
                variant="outline"
                className="border-[#87cbde] bg-[#87cbde]/20 text-xs font-medium text-black"
              >
                Synapark Workflow Engine v2.4
              </Badge>
              <Badge
                variant="outline"
                className="border-[#e5e5e5] bg-white text-xs font-medium text-black"
              >
                1-Link PSID Billing Integrated
              </Badge>
            </div>
          </div>

          {/* Quick Links: Services */}
          <div>
            <h3 className="font-heading mb-4 text-sm font-bold tracking-wider text-black uppercase">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm text-[#666666]">
              <li>
                <Link
                  href="/apply"
                  className="transition-colors hover:text-[#13c2b6]"
                >
                  Degree Attestation
                </Link>
              </li>
              <li>
                <Link
                  href="/journey"
                  className="transition-colors hover:text-[#13c2b6]"
                >
                  10-Step Attestation Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className="transition-colors hover:text-[#13c2b6]"
                >
                  Attestation Renewal
                </Link>
              </li>
              <li>
                <a
                  href="https://hec.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-colors hover:text-[#13c2b6]"
                >
                  <span>PQR Accredited Register</span>
                  <ExternalLink className="size-3" />
                </a>
              </li>
              <li>
                <Link
                  href="/#track"
                  className="transition-colors hover:text-[#13c2b6]"
                >
                  Application Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Centers */}
          <div>
            <h3 className="font-heading mb-4 text-sm font-bold tracking-wider text-black uppercase">
              Regional Centers
            </h3>
            <ul className="space-y-2.5 text-sm text-[#666666]">
              <li>
                <span className="block font-medium text-black">
                  Head Office:
                </span>
                Sector H-9, East Service Road, Islamabad
              </li>
              <li>
                <span className="block font-medium text-black">Lahore:</span>
                55-B/2, Gulberg III, Lahore
              </li>
              <li>
                <span className="block font-medium text-black">Karachi:</span>
                Karachi University Campus, Karachi
              </li>
              <li>
                <span className="block font-medium text-black">
                  Peshawar & Quetta:
                </span>
                Hayatabad Phase-V & Chaman Housing
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="font-heading mb-4 text-sm font-bold tracking-wider text-black uppercase">
              Helpline & Support
            </h3>
            <ul className="space-y-3 text-sm text-[#666666]">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-[#13c2b6]" />
                <div>
                  <span className="block font-medium text-black">
                    UAN Helpline:
                  </span>
                  <span>051-111-119-432</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-[#13c2b6]" />
                <div>
                  <span className="block font-medium text-black">
                    Email Inquiries:
                  </span>
                  <span>eportal@hec.gov.pk</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#13c2b6]" />
                <div>
                  <span className="block font-medium text-black">
                    Fraud Reporting:
                  </span>
                  <span>complaints@hec.gov.pk</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#e5e5e5] pt-8 text-xs text-[#666666] sm:flex-row">
          <p>
            © {new Date().getFullYear()} Higher Education Commission of
            Pakistan. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-black"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-black">
              Terms of Attestation
            </Link>
            <Link
              href="/disclaimer"
              className="transition-colors hover:text-black"
            >
              Verification Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
