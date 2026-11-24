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
    <header className="border-border/70 bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      {/* Top Government Strip */}
      <div className="bg-primary/95 text-primary-foreground px-4 py-1 text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wide">
              GOVERNMENT OF PAKISTAN
            </span>
            <span className="opacity-60">•</span>
            <span className="opacity-90">
              Higher Education Commission (HEC) Official Portal
            </span>
          </div>
          <div className="hidden items-center gap-4 text-[11px] opacity-90 sm:flex">
            <span>UAN: 051-111-119-432</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="size-2 animate-pulse rounded-full bg-emerald-300" />
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
          <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-105">
            <GraduationCap className="size-6 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-foreground text-lg leading-tight font-bold tracking-tight">
                HEC E-Portal
              </span>
              <Badge
                variant="outline"
                className="border-primary/30 text-primary h-4 px-1.5 py-0 text-[10px]"
              >
                Official
              </Badge>
            </div>
            <span className="text-muted-foreground text-xs leading-none font-medium">
              Higher Education Commission Pakistan
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="/"
            className="text-foreground/80 hover:text-primary hover:border-primary py-1 transition-colors hover:border-b-2"
          >
            Home
          </Link>
          <Link
            href="/journey"
            className="text-foreground/80 hover:text-primary flex items-center gap-1.5 py-1 transition-colors"
          >
            <Compass className="text-primary size-4" />
            <span>Attestation Journey</span>
            <Badge
              variant="secondary"
              className="bg-accent text-accent-foreground ml-0.5 text-[10px]"
            >
              10 Steps
            </Badge>
          </Link>
          <Link
            href="/#services"
            className="text-foreground/80 hover:text-primary py-1 transition-colors"
          >
            Services
          </Link>
          <a
            href="https://hec.gov.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-primary flex items-center gap-1 py-1 transition-colors"
          >
            <span>PQR Register</span>
          </a>
          <Link
            href="/#support"
            className="text-foreground/80 hover:text-primary flex items-center gap-1 py-1 transition-colors"
          >
            <HelpCircle className="text-muted-foreground size-4" />
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
                  className="hidden h-8 gap-1.5 border-dashed border-emerald-600/40 bg-emerald-50/50 font-mono text-xs text-emerald-900 sm:inline-flex dark:bg-emerald-950/20 dark:text-emerald-200"
                >
                  <Sparkles className="size-3 text-emerald-600" />
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
        </div>
      </div>
    </header>
  );
}
