'use client';

import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
  subtitle?: string;
}

export default function Header({
  onMenuClick,
  title = 'Dashboard',
  subtitle,
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-surface/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-textSecondary hover:text-textPrimary p-1 rounded-lg hover:bg-surface"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-base font-bold text-textPrimary leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-textSecondary hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
