import { NotificationList } from '@/components/activity/notification-list';

export default function ActivityPage() {
    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Activity</h2>
                <p className="text-muted-foreground">
                    Recent notifications and system events.
                </p>
            </div>
            <NotificationList />
        </div>
    );
}
