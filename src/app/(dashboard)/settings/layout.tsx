'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, Settings, Bell, Shield } from 'lucide-react';

const settingsNav = [
    { href: '/settings', label: 'General', icon: Settings, exact: true },
    { href: '/settings/profile', label: 'Profile', icon: User },
    { href: '/settings/notifications', label: 'Notifications', icon: Bell },
    { href: '/settings/security', label: 'Security', icon: Shield },
];

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Settings Navigation */}
                <nav className="w-full md:w-48 flex-shrink-0">
                    <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                        {settingsNav.map((item) => {
                            const isActive = item.exact
                                ? pathname === item.href
                                : pathname.startsWith(item.href);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Settings Content */}
                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>
        </div>
    );
}
