'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  HelpCircle,
  Compass,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore, type AuthStatus } from '@/store/use-app-store';

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const {
    authStatus,
    studentData,
    setAuthStatus,
    setActiveModal,
    getSmartRoute,
    loadStudentBootstrap,
  } = useAppStore();

  React.useEffect(() => {
    // Initial bootstrap load on mount
    if (authStatus !== 'logged_out' && !studentData) {
      loadStudentBootstrap(
        authStatus === 'first_time' ? 'first_time' : 'returning'
      );
    }
  }, [authStatus, studentData, loadStudentBootstrap]);

  const handleDemoSwitch = async (status: AuthStatus) => {
    await setAuthStatus(status);
    if (status === 'returning') {
      router.push('/dashboard');
    } else if (status === 'first_time') {
      router.push('/apply');
    } else {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e5e5e5] bg-white/95 backdrop-blur-md">
      {/* Top Government Strip */}
      <div className="border-b border-[#e5e5e5] bg-[#f6fbfe] px-4 py-1.5 text-xs text-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wide text-black">
              GOVERNMENT OF PAKISTAN
            </span>
            <span className="text-[#666666]">•</span>
            <span className="text-[#666666]">
              Higher Education Commission (HEC) Official Portal
            </span>
          </div>
          <div className="hidden items-center gap-4 text-[11px] text-[#666666] sm:flex">
            <span>UAN: 051-111-119-432</span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium text-black">
              <span className="size-2 animate-pulse rounded-full bg-[#13c2b6]" />
              1-Link Billing & Synapark Live
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Crest */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus:outline-hidden"
        >
          <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#13c2b6] text-black shadow-[0_4px_14px_rgba(19,194,182,0.3)] transition-transform group-hover:scale-105">
            <GraduationCap className="size-6 text-black" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-lg leading-tight font-bold tracking-tight text-black">
                HEC E-Portal
              </span>
              <Badge
                variant="outline"
                className="h-4 border-[#87cbde] bg-[#87cbde]/20 px-1.5 py-0 text-[10px] font-bold text-black"
              >
                CEGA
              </Badge>
            </div>
            <span className="text-xs leading-none font-medium text-[#666666]">
              Higher Education Commission Pakistan
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="/"
            className="text-black/80 transition-colors hover:text-[#13c2b6]"
          >
            Home
          </Link>
          <Link
            href="/journey"
            className="flex items-center gap-1.5 py-1 text-black/80 transition-colors hover:text-[#13c2b6]"
          >
            <Compass className="size-4 text-[#13c2b6]" />
            <span>Attestation Journey</span>
            <Badge
              variant="secondary"
              className="ml-0.5 border-[#87cbde]/50 bg-[#87cbde]/30 text-[10px] text-black"
            >
              10 Steps
            </Badge>
          </Link>
          <Link
            href="/#services"
            className="text-black/80 transition-colors hover:text-[#13c2b6]"
          >
            Services
          </Link>
          <a
            href="https://hec.gov.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-black/80 transition-colors hover:text-[#13c2b6]"
          >
            <span>PQR Register</span>
          </a>
          <Link
            href="/#support"
            className="flex items-center gap-1 text-black/80 transition-colors hover:text-[#13c2b6]"
          >
            <HelpCircle className="size-4 text-[#666666]" />
            <span>Support</span>
          </Link>
        </nav>

        {/* Right Actions: Dev Switcher & Auth */}
        <div className="flex items-center gap-3">
          {/* Dev/Demo State Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden h-8 gap-1.5 border border-[#87cbde]/60 bg-[#87cbde]/15 font-mono text-xs text-black hover:border-[#27b2d7] hover:bg-[#87cbde]/25 sm:inline-flex"
                >
                  <Sparkles className="size-3 text-[#27b2d7]" />
                  <span className="font-sans font-semibold">Demo:</span>
                  <span className="capitalize">
                    {authStatus === 'returning'
                      ? 'Returning Student'
                      : authStatus === 'first_time'
                        ? 'First-Time User'
                        : 'Logged Out'}
                  </span>
                  <ChevronDown className="ml-0.5 size-3 opacity-60" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="text-muted-foreground font-mono text-xs">
                MOCK ROLE SWITCHER
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDemoSwitch('returning')}
                className="flex cursor-pointer flex-col items-start gap-0.5"
              >
                <div className="flex w-full items-center justify-between gap-1.5 font-medium">
                  <span>Returning Student</span>
                  {authStatus === 'returning' && (
                    <Badge variant="approved" className="text-[10px]">
                      Active
                    </Badge>
                  )}
                </div>
                <span className="text-muted-foreground text-xs">
                  Hamza Malik (4 apps, verified wallet)
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDemoSwitch('first_time')}
                className="flex cursor-pointer flex-col items-start gap-0.5"
              >
                <div className="flex w-full items-center justify-between gap-1.5 font-medium">
                  <span>First-Time Student</span>
                  {authStatus === 'first_time' && (
                    <Badge variant="approved" className="text-[10px]">
                      Active
                    </Badge>
                  )}
                </div>
                <span className="text-muted-foreground text-xs">
                  Ayesha Siddiqua (0 apps, profile setup)
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDemoSwitch('logged_out')}
                className="flex cursor-pointer flex-col items-start gap-0.5"
              >
                <div className="flex w-full items-center justify-between gap-1.5 font-medium">
                  <span>Logged Out Visitor</span>
                  {authStatus === 'logged_out' && (
                    <Badge variant="archived" className="text-[10px]">
                      Active
                    </Badge>
                  )}
                </div>
                <span className="text-muted-foreground text-xs">
                  Public landing page experience
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Account / Login State */}
          {authStatus === 'logged_out' ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveModal('login')}
                className="text-xs font-medium sm:text-sm"
              >
                Login
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleDemoSwitch('first_time')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm sm:text-sm"
              >
                Register
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border bg-card hover:bg-muted flex h-9 items-center gap-2"
                  >
                    <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-bold">
                      {studentData?.student?.fullName?.charAt(0) || 'S'}
                    </div>
                    <span className="hidden max-w-[120px] truncate text-xs font-medium sm:inline-block">
                      {studentData?.student?.fullName || 'Student Account'}
                    </span>
                    <ChevronDown className="text-muted-foreground size-3" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {studentData?.student?.fullName || 'Hamza Malik'}
                    </p>
                    <p className="text-muted-foreground font-mono text-xs leading-none">
                      {studentData?.student?.cnic || '35202-1928374-1'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push(getSmartRoute())}
                  className="cursor-pointer"
                >
                  <User className="text-primary mr-2 size-4" />
                  <span>
                    {authStatus === 'first_time'
                      ? 'Start Application'
                      : 'Student Dashboard'}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/journey')}
                  className="cursor-pointer"
                >
                  <Compass className="text-primary mr-2 size-4" />
                  <span>Attestation Journey</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDemoSwitch('logged_out')}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-[#666666] transition-colors hover:bg-[#f6fbfe] hover:text-black md:hidden"
            aria-label={
              mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#e5e5e5] bg-white px-4 py-4 shadow-lg md:hidden">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-black hover:bg-[#f6fbfe] hover:text-[#13c2b6]"
            >
              Home
            </Link>
            <Link
              href="/journey"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-black hover:bg-[#f6fbfe] hover:text-[#13c2b6]"
            >
              <div className="flex items-center gap-2">
                <Compass className="size-4 text-[#13c2b6]" />
                <span>Attestation Journey</span>
              </div>
              <Badge
                variant="secondary"
                className="border-[#87cbde]/50 bg-[#87cbde]/30 text-[10px] text-black"
              >
                10 Steps
              </Badge>
            </Link>
            <Link
              href="/#services"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-black hover:bg-[#f6fbfe] hover:text-[#13c2b6]"
            >
              Services
            </Link>
            <a
              href="https://hec.gov.pk"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-black hover:bg-[#f6fbfe] hover:text-[#13c2b6]"
            >
              PQR Register
            </a>
            <Link
              href="/#support"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-black hover:bg-[#f6fbfe] hover:text-[#13c2b6]"
            >
              <HelpCircle className="size-4 text-[#666666]" />
              <span>Support</span>
            </Link>

            {/* Mobile Demo Persona Switcher */}
            <div className="border-t border-[#e5e5e5] pt-3">
              <span className="block px-3 pb-2 text-[10px] font-bold tracking-wider text-[#666666] uppercase">
                Simulate Persona
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleDemoSwitch('returning');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-xs ${authStatus === 'returning' ? 'border-[#13c2b6] bg-[#13c2b6]/10 font-bold text-black' : ''}`}
                >
                  Returning
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleDemoSwitch('first_time');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-xs ${authStatus === 'first_time' ? 'border-[#13c2b6] bg-[#13c2b6]/10 font-bold text-black' : ''}`}
                >
                  First-Time
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
