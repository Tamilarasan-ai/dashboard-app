'use server';

import { cookies } from 'next/headers';

const SETTINGS_COOKIE = 'dashboard-settings';
const DEFAULT_SETTINGS = {
    githubUsername: 'tamilarasan-ai',
    city: 'San Francisco',
    theme: 'system' as const,
    emailNotifications: true,
    pushNotifications: false,
    activityDigest: true,
    securityAlerts: true,
};

export interface DashboardSettings {
    githubUsername: string;
    city: string;
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
    pushNotifications: boolean;
    activityDigest: boolean;
    securityAlerts: boolean;
}

/**
 * Get settings from cookies (for server components)
 */
export async function getSettings(): Promise<DashboardSettings> {
    const cookieStore = await cookies();
    const settingsCookie = cookieStore.get(SETTINGS_COOKIE);

    if (!settingsCookie?.value) {
        return DEFAULT_SETTINGS;
    }

    try {
        const parsed = JSON.parse(settingsCookie.value);
        return {
            ...DEFAULT_SETTINGS,
            ...parsed,
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

/**
 * Save settings to cookies (server action)
 */
export async function saveSettings(settings: Partial<DashboardSettings>): Promise<{ success: boolean }> {
    const cookieStore = await cookies();
    const current = await getSettings();

    const updated = {
        ...current,
        ...settings,
    };

    cookieStore.set(SETTINGS_COOKIE, JSON.stringify(updated), {
        httpOnly: false, // Allow client access for Zustand sync
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
    });

    return { success: true };
}
