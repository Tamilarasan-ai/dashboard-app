'use client';

import { useStore } from '@/store';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { AuthGuard } from '@/components/auth/auth-guard';

export function Shell({ children }: { children: React.ReactNode }) {
    const { sidebarOpen } = useStore();

    return (
        <AuthGuard>
            <div className="min-h-screen bg-background">
                <Sidebar />
                <Topbar />
                <main
                    className={cn(
                        "min-h-screen pt-16 transition-all duration-300",
                        sidebarOpen ? "pl-64" : "pl-16"
                    )}
                >
                    <div className="container mx-auto p-6 max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
