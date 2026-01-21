import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, getNotifications, type User, type Notification as ApiNotification } from '@/services/mock-api';

// --- Types ---

interface UIState {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

interface SettingsState {
    theme: 'light' | 'dark' | 'system';
    githubUsername: string;
    city: string;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setGithubUsername: (username: string) => void;
    setCity: (city: string) => void;
    // Notification Settings
    emailNotifications: boolean;
    pushNotifications: boolean;
    activityDigest: boolean;
    securityAlerts: boolean;
    setEmailNotifications: (enabled: boolean) => void;
    setPushNotifications: (enabled: boolean) => void;
    setActivityDigest: (enabled: boolean) => void;
    setSecurityAlerts: (enabled: boolean) => void;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    error: string | null;
    loginAsync: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    timestamp: number;
    type?: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationsState {
    notifications: Notification[];
    isLoadingNotifications: boolean;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    clearAll: () => void;
    fetchNotifications: () => Promise<void>;
}

interface AnalyticsState {
    range: '7d' | '30d' | '90d';
    setRange: (range: '7d' | '30d' | '90d') => void;
}

// --- Slices ---

const createUISlice = (set: any): UIState => ({
    sidebarOpen: true,
    toggleSidebar: () => set((state: UIState) => ({ sidebarOpen: !state.sidebarOpen })),
});

const createSettingsSlice = (set: any): SettingsState => ({
    theme: 'system',
    githubUsername: 'tamilarasan-ai',
    city: 'San Francisco',
    setTheme: (theme) => set({ theme }),
    setGithubUsername: (githubUsername) => set({ githubUsername }),
    setCity: (city) => set({ city }),
    // Notification Defaults
    emailNotifications: true,
    pushNotifications: false,
    activityDigest: true,
    securityAlerts: true,
    setEmailNotifications: (emailNotifications) => set({ emailNotifications }),
    setPushNotifications: (pushNotifications) => set({ pushNotifications }),
    setActivityDigest: (activityDigest) => set({ activityDigest }),
    setSecurityAlerts: (securityAlerts) => set({ securityAlerts }),
});

const createAuthSlice = (set: any): AuthState => ({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    isLoading: false,
    error: null,

    loginAsync: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiLogin({ email, password });
            set({
                isAuthenticated: true,
                user: response.user,
                accessToken: response.access_token,
                isLoading: false,
                error: null,
            });
            return true;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.message || 'Login failed. Please try again.',
            });
            return false;
        }
    },

    logout: () => set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        error: null,
    }),

    clearError: () => set({ error: null }),
});

const createNotificationsSlice = (set: any, get: any): NotificationsState => ({
    notifications: [],
    isLoadingNotifications: false,

    addNotification: (n) => set((state: NotificationsState) => ({
        notifications: [
            { ...n, id: Math.random().toString(36).substring(7), read: false, timestamp: Date.now() },
            ...state.notifications
        ]
    })),

    markAsRead: (id) => set((state: NotificationsState) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    })),

    clearAll: () => set({ notifications: [] }),

    fetchNotifications: async () => {
        set({ isLoadingNotifications: true });
        try {
            const apiNotifications = await getNotifications();
            const notifications: Notification[] = apiNotifications.map((n: ApiNotification) => ({
                id: n.id,
                title: n.title,
                message: n.message,
                read: n.read,
                timestamp: new Date(n.timestamp).getTime(),
                type: n.type,
            }));
            set({ notifications, isLoadingNotifications: false });
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            set({ isLoadingNotifications: false });
        }
    },
});

const createAnalyticsSlice = (set: any): AnalyticsState => ({
    range: '7d',
    setRange: (range) => set({ range }),
});

// --- Store ---

interface StoreState extends UIState, SettingsState, AuthState, NotificationsState, AnalyticsState { }

export const useStore = create<StoreState>()(
    persist(
        (set, get, api) => ({
            ...createUISlice(set),
            ...createSettingsSlice(set),
            ...createAuthSlice(set),
            ...createNotificationsSlice(set, get),
            ...createAnalyticsSlice(set),
        }),
        {
            name: 'dev-control-storage',
            partialize: (state) => ({
                theme: state.theme,
                githubUsername: state.githubUsername,
                city: state.city,
                emailNotifications: state.emailNotifications,
                pushNotifications: state.pushNotifications,
                activityDigest: state.activityDigest,
                securityAlerts: state.securityAlerts,
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                accessToken: state.accessToken,
            }),
        }
    )
);
