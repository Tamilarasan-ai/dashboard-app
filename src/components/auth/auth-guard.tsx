'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { LoginForm } from './login-form';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated } = useStore();
    const [isHydrated, setIsHydrated] = useState(false);

    // Wait for Zustand hydration from localStorage
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Show loading skeleton while hydrating
    if (!isHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="space-y-4 w-full max-w-md p-8">
                    <Skeleton className="h-12 w-12 mx-auto rounded-xl" />
                    <Skeleton className="h-8 w-48 mx-auto" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                    <div className="space-y-3 pt-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    // Show login form if not authenticated
    if (!isAuthenticated) {
        return <LoginForm />;
    }

    // Render protected content
    return <>{children}</>;
}
