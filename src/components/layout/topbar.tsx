'use client';

import { usePathname } from 'next/navigation';
import { useStore } from '@/store';
import { cn } from '@/lib/utils';

export function Topbar() {
    const pathname = usePathname();
    const { sidebarOpen } = useStore();

    const getTitle = () => {
        switch (pathname) {
            case '/overview': return 'Overview';
            case '/projects': return 'Projects';
            case '/analytics': return 'Analytics';
            case '/activity': return 'Activity';
            case '/settings': return 'Settings';
            default: return 'Dashboard';
        }
    };

    return (
        <header
            className={cn(
                "fixed top-0 z-30 flex h-16 w-full items-center border-b bg-background/80 px-6 backdrop-blur transition-all duration-300",
                sidebarOpen ? "pl-64" : "pl-16"
            )}
        >
            <h1 className="text-lg font-semibold">{getTitle()}</h1>
        </header>
    );
}
