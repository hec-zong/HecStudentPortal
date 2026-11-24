'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  FolderArchive,
  Compass,
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
  PanelLeftClose,
  PanelLeftOpen,
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
  const [isSidebarMinimized, setIsSidebarMinimized] = React.useState(false);

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
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between border-r border-[#e5e5e5] bg-white text-black transition-all duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } shrink-0 lg:static ${isSidebarMinimized ? 'w-72 lg:w-20' : 'w-72 lg:w-64'}`}
      >
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* HEC Attestation Branding Header */}
          <div
            className={`flex items-center ${
              isSidebarMinimized
                ? 'justify-between lg:justify-center'
                : 'justify-between'
            } border-b border-[#e5e5e5] p-4 lg:p-5`}
          >
            <Link
              href="/dashboard"
              className="group flex items-center gap-3"
              title="HEC Attestation E-Portal"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-[#13c2b6] text-black shadow-sm transition-transform group-hover:scale-105">
                <GraduationCap className="size-5 text-black" />
              </div>
              <div className={isSidebarMinimized ? 'block lg:hidden' : 'block'}>
                <span className="font-heading block text-base font-bold tracking-tight text-black transition-colors group-hover:text-[#13c2b6]">
                  HEC Attestation
                </span>
                <span className="text-[11px] font-medium text-[#666666]">
                  Govt of Pakistan E-Portal
                </span>
              </div>
            </Link>

            {/* Desktop Minimize Toggle in Sidebar Header */}
            <button
              type="button"
              onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
              className="hidden rounded-lg p-1.5 text-[#666666] transition-colors hover:bg-[#f6fbfe] hover:text-black lg:inline-flex"
              aria-label={
                isSidebarMinimized ? 'Expand sidebar' : 'Minimize sidebar'
              }
              title={isSidebarMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
            >
              {isSidebarMinimized ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-1.5 text-[#666666] hover:bg-[#f6fbfe] hover:text-black lg:hidden"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5 p-3 lg:p-4">
            <div
              className={`px-3 pb-2 text-[10px] font-bold tracking-wider text-[#666666] uppercase ${
                isSidebarMinimized ? 'block lg:hidden' : 'block'
              }`}
            >
              Student Navigation
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={item.name}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center ${
                    isSidebarMinimized
                      ? 'justify-between px-3.5 lg:justify-center lg:px-2.5'
                      : 'justify-between px-3.5'
                  } rounded-xl py-2.5 text-xs font-medium transition-all sm:text-sm ${
                    isActive
                      ? 'border border-[#13c2b6]/40 bg-[#13c2b6]/15 font-bold text-black shadow-xs'
                      : 'text-[#666666] hover:bg-[#f6fbfe] hover:text-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`size-4 shrink-0 ${isActive ? 'text-[#13c2b6]' : 'text-[#666666]'}`}
                    />
                    <span
                      className={
                        isSidebarMinimized ? 'inline lg:hidden' : 'inline'
                      }
                    >
                      {item.name}
                    </span>
                  </div>

                  {item.badge && (
                    <Badge
                      variant="outline"
                      className={`border-[#87cbde] bg-[#87cbde]/20 px-1.5 py-0 text-[10px] font-bold text-black ${
                        isSidebarMinimized ? 'inline lg:hidden' : 'inline'
                      }`}
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
        <div className="border-t border-[#e5e5e5] bg-[#f6fbfe] p-3 lg:p-4">
          {/* Minimized Desktop View */}
          {isSidebarMinimized && (
            <div className="hidden flex-col items-center gap-2 lg:flex">
              <div
                className="group relative cursor-pointer"
                title={`${fullName} • ${cnic}`}
              >
                <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#13c2b6] text-xs font-bold text-black">
                  {initials}
                </div>
                <div className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-[#13c2b6] ring-2 ring-white" />
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="rounded-lg p-2 text-[#666666] transition-colors hover:bg-rose-50 hover:text-rose-600"
                title="Log out session"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          )}

          {/* Full Expanded View */}
          <div
            className={`space-y-3 rounded-xl border border-[#e5e5e5] bg-white p-3 shadow-xs ${
              isSidebarMinimized ? 'block lg:hidden' : 'block'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#13c2b6] text-xs font-bold text-black">
                  {initials}
                </div>
                <div className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full bg-[#13c2b6] ring-2 ring-white" />
              </div>

              <div className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-black">
                  {fullName}
                </span>
                <span className="block truncate font-mono text-[10px] text-[#666666]">
                  {cnic}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#e5e5e5] pt-1 text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-[#13c2b6]">
                <ShieldCheck className="size-3 text-[#13c2b6]" />
                Verified
              </span>

              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="flex items-center gap-1 text-[#666666] transition-colors hover:text-rose-600"
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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#e5e5e5] bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          {/* Left: Mobile Toggle, Desktop Sidebar Minimize & Welcome Greeting */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-[#666666] hover:bg-[#f6fbfe] hover:text-black lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
              className="hidden rounded-lg p-2 text-[#666666] transition-colors hover:bg-[#f6fbfe] hover:text-black lg:inline-flex"
              aria-label={
                isSidebarMinimized ? 'Expand sidebar' : 'Minimize sidebar'
              }
              title={isSidebarMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
            >
              {isSidebarMinimized ? (
                <PanelLeftOpen className="size-5" />
              ) : (
                <PanelLeftClose className="size-5" />
              )}
            </button>

            <div>
              <h1 className="font-heading flex items-center gap-2 text-sm font-bold tracking-tight text-black sm:text-base">
                <span>Welcome back, {fullName}</span>
                <Badge
                  variant="approved"
                  className="hidden gap-1 px-2 py-0 text-[10px] sm:inline-flex"
                >
                  <CheckCircle2 className="size-3" />
                  NADRA CNIC Linked
                </Badge>
              </h1>
              <span className="hidden text-[11px] text-[#666666] sm:block">
                Session active • Statutory Forensic Attestation Desk
              </span>
            </div>
          </div>

          {/* Right: Quick Notifications & Demo Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Notifications Trigger */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="relative cursor-pointer rounded-lg p-2 text-[#666666] transition-colors outline-none hover:bg-[#f6fbfe] hover:text-black"
                aria-label="View notifications"
              >
                <Bell className="size-4" />
                {pendingTasks.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 size-2 animate-pulse rounded-full bg-[#27b2d7]" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 space-y-1 p-2">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="font-heading text-xs font-bold text-black">
                    Active Notifications
                  </span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {pendingTasks.length} Pending
                  </Badge>
                </div>
                <DropdownMenuSeparator />

                {pendingTasks.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#666666]">
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
                      className="flex cursor-pointer flex-col items-start gap-1 rounded-lg p-2.5 text-xs hover:bg-[#f6fbfe]"
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="max-w-[190px] truncate text-[11px] font-semibold text-black">
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
                      <p className="line-clamp-2 text-[11px] text-[#666666]">
                        {task.description}
                      </p>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Demo Role Switcher Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden cursor-pointer items-center gap-1.5 rounded-[10px] border border-[#87cbde]/60 bg-[#87cbde]/20 px-2.5 py-1.5 text-xs font-semibold text-black transition-colors outline-none hover:bg-[#87cbde]/30 sm:inline-flex">
                <Sparkles className="size-3.5 text-[#27b2d7]" />
                <span>
                  Demo:{' '}
                  {authStatus === 'first_time' ? 'First-Time' : 'Returning'}
                </span>
                <ChevronDown className="size-3 text-[#666666]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 text-xs">
                <DropdownMenuLabel className="font-heading text-[11px] font-bold text-[#666666] uppercase">
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
                    <span className="block font-semibold text-black">
                      Returning Student
                    </span>
                    <span className="block text-[10px] text-[#666666]">
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
                    <span className="block font-semibold text-black">
                      First-Time Student
                    </span>
                    <span className="block text-[10px] text-[#666666]">
                      Ayesha Siddiqua • 35% Onboarding
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Avatar Action Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-[#13c2b6] text-xs font-bold text-black ring-2 ring-[#13c2b6]/30 outline-none"
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
