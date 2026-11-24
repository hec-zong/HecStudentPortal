'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  FolderArchive,
  Compass,
  Scale,
  Settings,
  HelpCircle,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AuthModal } from '@/components/modals/AuthModal';
import { TrackLookupModal } from '@/components/modals/TrackLookupModal';
import { ShareProofModal } from '@/components/modals/ShareProofModal';
import { useAppStore } from '@/store/use-app-store';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Track Applications',
    href: '/track',
    icon: Compass,
  },
  {
    name: 'My Degrees & Assets',
    href: '/assets',
    icon: FolderArchive,
    badge: 'Vault',
  },
  {
    name: 'Equivalence',
    href: '/apply?service=equivalence',
    icon: Scale,
  },
  {
    name: 'My Profile',
    href: '/profile',
    icon: User,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    name: 'Help Center',
    href: '/journey',
    icon: HelpCircle,
  },
];

interface PortalShellProps {
  children: React.ReactNode;
}

export function PortalShell({ children }: PortalShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const {
    authStatus,
    studentData,
    loadStudentBootstrap,
    loginAsFirstTime,
    loginAsReturning,
    logout,
  } = useAppStore();

  // Load student bootstrap if missing
  React.useEffect(() => {
    if (!studentData && authStatus !== 'logged_out') {
      loadStudentBootstrap(
        authStatus === 'returning' ? 'returning' : 'first_time'
      );
    }
  }, [studentData, authStatus, loadStudentBootstrap]);

  const student = studentData?.student;
  const pendingTasks = studentData?.pendingTasks || [];
  const fullName =
    student?.fullName ||
    (authStatus === 'first_time' ? 'Ayesha Siddiqua' : 'Hamza Tariq Malik');
  const cnic =
    student?.cnic ||
    (authStatus === 'first_time' ? '37405-0918273-3' : '35202-1928374-1');
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="bg-background text-foreground flex min-h-screen antialiased">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-slate-800 bg-slate-950 text-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } shrink-0 lg:static lg:w-64`}
      >
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* HEC Attestation Branding Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 p-5">
            <Link href="/dashboard" className="group flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500 to-teal-700 font-bold text-white shadow-md shadow-emerald-950/40 transition-transform group-hover:scale-105">
                <GraduationCap className="size-5" />
              </div>
              <div>
                <span className="block text-base font-bold tracking-tight text-white transition-colors group-hover:text-emerald-400">
                  HEC Attestation
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Govt of Pakistan E-Portal
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5 p-4">
            <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Student Navigation
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all sm:text-sm ${
                    isActive
                      ? 'border border-emerald-500/30 bg-emerald-600/20 font-semibold text-emerald-400 shadow-inner'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`size-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/40 px-1.5 py-0 text-[10px] text-emerald-400"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile Summary Card */}
        <div className="border-t border-slate-800/80 bg-slate-900/50 p-4">
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-600 text-xs font-bold text-white">
                  {initials}
                </div>
                <div className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
              </div>

              <div className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-white">
                  {fullName}
                </span>
                <span className="block truncate font-mono text-[10px] text-slate-400">
                  {cnic}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-1 text-[11px]">
              <span className="flex items-center gap-1 font-medium text-emerald-400">
                <ShieldCheck className="size-3" />
                Verified
              </span>

              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="flex items-center gap-1 text-slate-400 transition-colors hover:text-rose-400"
                title="Log out session"
              >
                <LogOut className="size-3" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Column (Top Bar + Page Content) */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-background/95 border-border sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b px-4 backdrop-blur sm:px-6 lg:px-8">
          {/* Left: Mobile Toggle & Welcome Greeting */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="size-5" />
            </button>

            <div>
              <h1 className="text-foreground flex items-center gap-2 text-sm font-bold tracking-tight sm:text-base">
                <span>Welcome back, {fullName}</span>
                <Badge
                  variant="approved"
                  className="hidden gap-1 px-2 py-0 text-[10px] sm:inline-flex"
                >
                  <CheckCircle2 className="size-3" />
                  NADRA CNIC Linked
                </Badge>
              </h1>
              <span className="text-muted-foreground hidden text-[11px] sm:block">
                Session active • Statutory Forensic Attestation Desk
              </span>
            </div>
          </div>

          {/* Right: Quick Notifications & Demo Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Notifications Trigger */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="text-muted-foreground hover:text-foreground hover:bg-muted relative cursor-pointer rounded-lg p-2 transition-colors outline-none"
                aria-label="View notifications"
              >
                <Bell className="size-4" />
                {pendingTasks.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 size-2 animate-pulse rounded-full bg-amber-500" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 space-y-1 p-2">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-foreground text-xs font-bold">
                    Active Notifications
                  </span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {pendingTasks.length} Pending
                  </Badge>
                </div>
                <DropdownMenuSeparator />

                {pendingTasks.length === 0 ? (
                  <div className="text-muted-foreground p-4 text-center text-xs">
                    All applications and tasks are up to date!
                  </div>
                ) : (
                  pendingTasks.map((task) => (
                    <DropdownMenuItem
                      key={task.id}
                      onClick={() => {
                        if (task.applicationId) {
                          router.push(
                            `/track/${encodeURIComponent(task.applicationId)}`
                          );
                        }
                      }}
                      className="flex cursor-pointer flex-col items-start gap-1 rounded-lg p-2.5 text-xs"
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="text-foreground max-w-[190px] truncate text-[11px] font-semibold">
                          {task.title}
                        </span>
                        <Badge
                          variant={
                            task.priority === 'high' ? 'resubmit' : 'inProgress'
                          }
                          className="px-1 py-0 text-[9px] uppercase"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-[11px]">
                        {task.description}
                      </p>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Demo Role Switcher Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="border-border bg-card text-foreground hover:bg-muted hidden cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors outline-none sm:inline-flex">
                <Sparkles className="size-3.5 text-emerald-500" />
                <span>
                  Demo:{' '}
                  {authStatus === 'first_time' ? 'First-Time' : 'Returning'}
                </span>
                <ChevronDown className="text-muted-foreground size-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 text-xs">
                <DropdownMenuLabel className="text-muted-foreground text-[11px] font-bold uppercase">
                  Simulate Persona
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    loginAsReturning();
                    router.push('/dashboard');
                  }}
                  className="cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <span className="text-foreground block font-semibold">
                      Returning Student
                    </span>
                    <span className="text-muted-foreground block text-[10px]">
                      Hamza Tariq Malik • 4 Applications
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    loginAsFirstTime();
                    router.push('/apply');
                  }}
                  className="cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <span className="text-foreground block font-semibold">
                      First-Time Student
                    </span>
                    <span className="text-muted-foreground block text-[10px]">
                      Ayesha Siddiqua • 35% Onboarding
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Avatar Action Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white ring-2 ring-emerald-500/30 outline-none"
                aria-label="User menu"
              >
                {initials}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2 text-xs">
                <div className="px-2 py-1.5">
                  <span className="text-foreground block truncate font-bold">
                    {fullName}
                  </span>
                  <span className="text-muted-foreground block font-mono text-[10px]">
                    {cnic}
                  </span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push('/profile')}
                  className="cursor-pointer"
                >
                  <User className="mr-2 size-3.5" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/settings')}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 size-3.5" />
                  <span>Settings & Security</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/journey')}
                  className="cursor-pointer"
                >
                  <Clock className="mr-2 size-3.5" />
                  <span>Attestation Journey</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 size-3.5" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Global Modals Mounted Once in Shell */}
      <AuthModal />
      <TrackLookupModal />
      <ShareProofModal />
    </div>
  );
}
