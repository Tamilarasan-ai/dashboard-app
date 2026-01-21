/**
 * Mock API service layer using Beeceptor endpoints
 * Provides auth, profile, preferences, and notifications endpoints
 */

import { api } from '@/lib/api-client';

// Types
export interface User {
    id: number;
    email: string;
    name: string;
    avatar: string;
    username?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface Preferences {
    theme: 'light' | 'dark' | 'system';
    githubUsername: string;
    city: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    timestamp: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

/**
 * Simulate login - accepts any credentials for demo
 * Skips external API call and uses mock response directly for reliability
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 800));

    // For demo, always return mock response
    // In production, replace with real API call
    return {
        access_token: `mock_token_${Date.now()}`,
        token_type: 'Bearer',
        user: {
            id: 1,
            email: credentials.email,
            name: credentials.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
            username: credentials.email.split('@')[0],
        },
    };
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<User | null> {
    const response = await api.get<any>('/users/1');

    if (response.error || !response.data) {
        console.log('[Mock API] Profile endpoint unavailable');
        return null;
    }

    // Map JSONPlaceholder response to our User type
    return {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.data.email}`,
        username: response.data.username,
    };
}

/**
 * Get user preferences
 */
export async function getPreferences(): Promise<Preferences | null> {
    // JSONPlaceholder doesn't have preferences, so we simulate
    const response = await api.get<any>('/users/1');

    if (response.error) {
        return null;
    }

    // Return default preferences (in real app, would come from API)
    return {
        theme: 'system',
        githubUsername: response.data?.username || 'tamilarasan-ai',
        city: response.data?.address?.city || 'San Francisco',
        emailNotifications: true,
        pushNotifications: false,
    };
}

/**
 * Update user preferences
 */
export async function updatePreferences(prefs: Partial<Preferences>): Promise<boolean> {
    const response = await api.put<any>('/users/1', prefs);

    // Mock always succeeds for demo
    if (response.error) {
        console.log('[Mock API] Preferences update simulated successfully');
        return true; // Simulate success even if API fails
    }

    return true;
}

/**
 * Get notifications feed
 */
export async function getNotifications(): Promise<Notification[]> {
    // Use JSONPlaceholder posts as mock notifications
    const response = await api.get<any[]>('/posts');

    if (response.error || !response.data) {
        // Return mock notifications if API fails
        return generateMockNotifications();
    }

    // Transform posts to notifications
    return response.data.slice(0, 10).map((post, index) => ({
        id: String(post.id),
        title: post.title.substring(0, 50),
        message: post.body.substring(0, 100) + '...',
        read: index > 2, // First 3 are unread
        timestamp: new Date(Date.now() - index * 3600000).toISOString(),
        type: (['info', 'success', 'warning', 'info'] as const)[index % 4],
    }));
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(id: string): Promise<boolean> {
    const response = await api.put<any>(`/posts/${id}`, { read: true });
    return !response.error;
}

/**
 * Generate mock notifications for fallback
 */
function generateMockNotifications(): Notification[] {
    return [
        {
            id: '1',
            title: 'Welcome to Dev Control',
            message: 'Your dashboard is ready. Start exploring your projects and analytics.',
            read: false,
            timestamp: new Date().toISOString(),
            type: 'success',
        },
        {
            id: '2',
            title: 'New GitHub Activity',
            message: 'You have 3 new stars on your repositories.',
            read: false,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            type: 'info',
        },
        {
            id: '3',
            title: 'Settings Updated',
            message: 'Your preferences have been saved successfully.',
            read: true,
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            type: 'success',
        },
    ];
}
