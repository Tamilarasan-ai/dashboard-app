'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import {
    LayoutDashboard,
    FolderGit2,
    BarChart3,
    Bell,
    Settings,
    ChevronLeft,
    Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/auth/user-menu';

const navItems = [
    { href: '/overview', label: 'Overview', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: FolderGit2 },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/activity', label: 'Activity', icon: Bell },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { sidebarOpen, toggleSidebar } = useStore();

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300 ease-in-out flex flex-col",
                sidebarOpen ? "w-64" : "w-16"
            )}
        >
            <div className="flex h-16 items-center justify-between border-b px-4">
                {sidebarOpen && (
                    <span className="text-lg font-bold tracking-tight">DevControl</span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className={cn("ml-auto", !sidebarOpen && "mx-auto")}
                >
                    {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </div>

            <nav className="flex-1 space-y-2 p-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                !sidebarOpen && "justify-center px-2"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", sidebarOpen && "mr-3")} />
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* User Menu at bottom */}
            {sidebarOpen && (
                <div className="border-t p-3">
                    <UserMenu />
                </div>
            )}
        </aside>
    );
}
