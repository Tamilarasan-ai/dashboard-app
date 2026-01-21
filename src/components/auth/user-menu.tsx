'use client';

import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function UserMenu() {
    const { user, logout, isAuthenticated } = useStore();

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <User className="h-4 w-4 text-primary" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="flex-shrink-0"
                title="Sign out"
            >
                <LogOut className="h-4 w-4" />
            </Button>
        </div>
    );
}
