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
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <GraduationCap className="size-6 text-white" />
              </div>
              <div>
                <span className="block text-lg font-bold tracking-tight text-white">
                  HEC E-Portal
                </span>
                <span className="text-xs font-medium text-slate-400">
                  Higher Education Commission Pakistan
                </span>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              The statutory regulatory body constituted under Federal Ordinance
              to promote higher education, degree accreditation, forensic
              document attestation, and university research funding across
              Pakistan.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge
                variant="outline"
                className="border-emerald-500/40 bg-emerald-950/30 text-xs text-emerald-400"
              >
                Synapark Workflow Engine v2.4
              </Badge>
              <Badge
                variant="outline"
                className="border-slate-700 text-xs text-slate-300"
              >
                1-Link PSID Billing Integrated
              </Badge>
            </div>
          </div>

          {/* Quick Links: Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  href="/apply"
                  className="transition-colors hover:text-emerald-400"
                >
                  Degree Attestation
                </Link>
              </li>
              <li>
                <Link
                  href="/journey"
                  className="transition-colors hover:text-emerald-400"
                >
                  10-Step Attestation Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className="transition-colors hover:text-emerald-400"
                >
                  Attestation Renewal
                </Link>
              </li>
              <li>
                <a
                  href="https://hec.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-colors hover:text-emerald-400"
                >
                  <span>PQR Accredited Register</span>
                  <ExternalLink className="size-3" />
                </a>
              </li>
              <li>
                <Link
                  href="/#track"
                  className="transition-colors hover:text-emerald-400"
                >
                  Application Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Centers */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Regional Centers
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <span className="block font-medium text-slate-300">
                  Head Office:
                </span>
                Sector H-9, East Service Road, Islamabad
              </li>
              <li>
                <span className="block font-medium text-slate-300">
                  Lahore:
                </span>
                55-B/2, Gulberg III, Lahore
              </li>
              <li>
                <span className="block font-medium text-slate-300">
                  Karachi:
                </span>
                Karachi University Campus, Karachi
              </li>
              <li>
                <span className="block font-medium text-slate-300">
                  Peshawar & Quetta:
                </span>
                Hayatabad Phase-V & Chaman Housing
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Helpline & Support
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <div>
                  <span className="block font-medium text-slate-200">
                    UAN Helpline:
                  </span>
                  <span>051-111-119-432</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <div>
                  <span className="block font-medium text-slate-200">
                    Email Inquiries:
                  </span>
                  <span>eportal@hec.gov.pk</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <div>
                  <span className="block font-medium text-slate-200">
                    Fraud Reporting:
                  </span>
                  <span>complaints@hec.gov.pk</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Higher Education Commission of
            Pakistan. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-slate-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-slate-400"
            >
              Terms of Attestation
            </Link>
            <Link
              href="/disclaimer"
              className="transition-colors hover:text-slate-400"
            >
              Verification Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
