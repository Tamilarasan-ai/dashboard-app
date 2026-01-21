'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { saveSettings } from '@/lib/settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, Mail, MessageSquare, Smartphone, Save, Loader2, Check } from 'lucide-react';

interface ToggleSwitchProps {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

function ToggleSwitch({ id, checked, onChange }: ToggleSwitchProps) {
    return (
        <button
            id={id}
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted'
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );
}

export default function NotificationSettingsPage() {
    const router = useRouter();
    const store = useStore();

    // Local state initialized from store
    const [settings, setSettings] = useState({
        emailNotifications: store.emailNotifications,
        pushNotifications: store.pushNotifications,
        activityDigest: store.activityDigest,
        securityAlerts: store.securityAlerts,
        productUpdates: false, // Not in store, kept local
    });

    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    // Sync from store on mount/update
    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            emailNotifications: store.emailNotifications,
            pushNotifications: store.pushNotifications,
            activityDigest: store.activityDigest,
            securityAlerts: store.securityAlerts,
        }));
    }, [store.emailNotifications, store.pushNotifications, store.activityDigest, store.securityAlerts]);

    const updateSetting = (key: keyof typeof settings, value: boolean) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        startTransition(async () => {
            // 1. Save to cookies
            await saveSettings({
                emailNotifications: settings.emailNotifications,
                pushNotifications: settings.pushNotifications,
                activityDigest: settings.activityDigest,
                securityAlerts: settings.securityAlerts,
            });

            // 2. Update store
            store.setEmailNotifications(settings.emailNotifications);
            store.setPushNotifications(settings.pushNotifications);
            store.setActivityDigest(settings.activityDigest);
            store.setSecurityAlerts(settings.securityAlerts);

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            router.refresh();
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notification Preferences
                    </CardTitle>
                    <CardDescription>
                        Choose how and when you want to be notified.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between py-3 border-b">
                        <div className="space-y-0.5">
                            <Label htmlFor="email-notif" className="flex items-center gap-2 cursor-pointer">
                                <Mail className="h-4 w-4" />
                                Email Notifications
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Receive notifications via email
                            </p>
                        </div>
                        <ToggleSwitch
                            id="email-notif"
                            checked={settings.emailNotifications}
                            onChange={(v) => updateSetting('emailNotifications', v)}
                        />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                        <div className="space-y-0.5">
                            <Label htmlFor="push-notif" className="flex items-center gap-2 cursor-pointer">
                                <Smartphone className="h-4 w-4" />
                                Push Notifications
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Receive push notifications on your devices
                            </p>
                        </div>
                        <ToggleSwitch
                            id="push-notif"
                            checked={settings.pushNotifications}
                            onChange={(v) => updateSetting('pushNotifications', v)}
                        />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                        <div className="space-y-0.5">
                            <Label htmlFor="activity-digest" className="flex items-center gap-2 cursor-pointer">
                                <MessageSquare className="h-4 w-4" />
                                Weekly Activity Digest
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Get a weekly summary of your activity
                            </p>
                        </div>
                        <ToggleSwitch
                            id="activity-digest"
                            checked={settings.activityDigest}
                            onChange={(v) => updateSetting('activityDigest', v)}
                        />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                        <div className="space-y-0.5">
                            <Label htmlFor="security-alerts" className="flex items-center gap-2 cursor-pointer">
                                <Bell className="h-4 w-4 text-red-500" />
                                Security Alerts
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified about security events
                            </p>
                        </div>
                        <ToggleSwitch
                            id="security-alerts"
                            checked={settings.securityAlerts}
                            onChange={(v) => updateSetting('securityAlerts', v)}
                        />
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div className="space-y-0.5">
                            <Label htmlFor="product-updates" className="flex items-center gap-2 cursor-pointer">
                                Product Updates
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Receive news about product features and updates
                            </p>
                        </div>
                        <ToggleSwitch
                            id="product-updates"
                            checked={settings.productUpdates}
                            onChange={(v) => updateSetting('productUpdates', v)}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : saved ? (
                        <>
                            <Check className="mr-2 h-4 w-4" />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Preferences
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
