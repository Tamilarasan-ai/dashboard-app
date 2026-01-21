'use client';

import { useEffect } from 'react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Check, Trash2, RefreshCw, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeIcons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
};

const typeColors = {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
};

export function NotificationList() {
    const {
        notifications,
        markAsRead,
        clearAll,
        addNotification,
        fetchNotifications,
        isLoadingNotifications,
    } = useStore();

    // Fetch notifications on mount
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleRefresh = () => {
        fetchNotifications();
    };

    const handleSimulate = () => {
        addNotification({
            title: 'New Event',
            message: `Something happened at ${new Date().toLocaleTimeString()}`,
        });
    };

    // Loading skeleton
    if (isLoadingNotifications && notifications.length === 0) {
        return (
            <div className="space-y-4">
                <div className="flex justify-end gap-2">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-9 w-24" />
                </div>
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoadingNotifications}
                >
                    <RefreshCw className={cn("mr-2 h-4 w-4", isLoadingNotifications && "animate-spin")} />
                    Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={handleSimulate}>
                    Simulate
                </Button>
                <Button variant="destructive" size="sm" onClick={clearAll}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All
                </Button>
            </div>

            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <Bell className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No notifications yet.</p>
                        <Button variant="link" onClick={handleRefresh} className="mt-2">
                            Refresh to check for updates
                        </Button>
                    </div>
                ) : (
                    notifications.map((notification) => {
                        const notificationType = notification.type || 'info';
                        const Icon = typeIcons[notificationType];
                        const colorClass = typeColors[notificationType];

                        return (
                            <Card
                                key={notification.id}
                                className={cn(
                                    "transition-all hover:shadow-md",
                                    notification.read && "opacity-60"
                                )}
                            >
                                <CardContent className="p-4 flex items-start justify-between gap-4">
                                    <div className="flex gap-4">
                                        <div className={cn("mt-0.5", colorClass)}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold leading-none">{notification.title}</h4>
                                                {!notification.read && (
                                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                                            <p className="text-xs text-muted-foreground pt-1">
                                                {new Date(notification.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    {!notification.read && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => markAsRead(notification.id)}
                                            title="Mark as read"
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
