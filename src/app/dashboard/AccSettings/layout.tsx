'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { User, Lock, Bell } from 'lucide-react';

const settingsLinks = [
  {
    label: 'Account',
    href: '/dashboard/settings/account',
    icon: <User className="h-4 w-4" />,
  },
  {
    label: 'Privacy',
    href: '/dashboard/settings/privacy',
    icon: <Lock className="h-4 w-4" />,
  },
  {
    label: 'Notifications',
    href: '/dashboard/settings/notifications',
    icon: <Bell className="h-4 w-4" />,
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-slate-50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Settings</h2>
        <nav className="space-y-2">
          {settingsLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                pathname.startsWith(link.href)
                  ? 'bg-purple-100 text-purple-900'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}