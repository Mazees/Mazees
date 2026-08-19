'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Cpu,
  Globe,
  LogOut,
  Sparkles,
  X,
} from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  userEmail?: string | null;
}

export default function Sidebar({
  mobileOpen = false,
  setMobileOpen,
  userEmail,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Projects',
      href: '/dashboard/projects',
      icon: FolderKanban,
      exact: false,
    },
    {
      name: 'Tech Stack',
      href: '/dashboard/techstack',
      icon: Cpu,
      exact: false,
    },
  ];

  function isActive(itemHref: string, exact: boolean) {
    if (exact) return pathname === itemHref;
    return pathname.startsWith(itemHref);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface border-r border-border w-64">
      {/* Brand */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider text-textPrimary block">
              MAZEES
            </span>
            <span className="text-[10px] uppercase tracking-widest text-primary font-medium block">
              Dashboard
            </span>
          </div>
        </Link>
        {setMobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-textSecondary hover:text-textPrimary"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-textSecondary/60 px-3 mb-2">
          Menu
        </div>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen?.(false)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-background/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-textSecondary'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-textSecondary/60 px-3 mb-2">
            Quick Links
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-textSecondary hover:text-primary hover:bg-background/80 transition-all group"
          >
            <Globe className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span>Live Portfolio</span>
          </Link>
        </div>
      </div>

      {/* User info & Logout */}
      <div className="p-4 border-t border-border">
        {userEmail && (
          <div className="px-3 py-2 mb-2 bg-background/50 rounded-lg border border-border/50">
            <span className="text-[10px] uppercase tracking-wider text-textSecondary block">
              Signed in as
            </span>
            <span className="text-xs text-textPrimary truncate block font-mono">
              {userEmail}
            </span>
          </div>
        )}

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen?.(false)}
          />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
