/**
 * API Client with retry logic, auth token injection, and error handling
 * Uses Beeceptor mock endpoints for development
 */

// Types
export interface ApiError {
    message: string;
    status: number;
    code?: string;
}

export interface ApiResponse<T> {
    data: T | null;
    error: ApiError | null;
    loading: boolean;
}

// Configuration
const getBaseUrl = () => {
    // Use JSONPlaceholder mock for general REST endpoints
    // Use OAuth mock for auth endpoints
    return process.env.NEXT_PUBLIC_MOCK_API_URL || 'https://json-placeholder.mock.beeceptor.com';
};

const OAUTH_BASE_URL = 'https://oauth-mock.mock.beeceptor.com';

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get auth token from localStorage (if available)
 */
const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
        const storage = localStorage.getItem('dev-control-storage');
        if (storage) {
            const parsed = JSON.parse(storage);
            return parsed.state?.accessToken || null;
        }
    } catch {
        // Ignore parse errors
    }
    return null;
};

/**
 * Fetch wrapper with retry logic and auth
 */
export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = MAX_RETRIES
): Promise<ApiResponse<T>> {
    const baseUrl = endpoint.startsWith('/auth') ? OAUTH_BASE_URL : getBaseUrl();
    const url = `${baseUrl}${endpoint}`;

    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    let lastError: ApiError | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            if (attempt > 0) {
                // Exponential backoff
                const delay = INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
                console.log(`[API] Retry ${attempt}/${retries} after ${delay}ms`);
                await sleep(delay);
            }

            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                throw {
                    message: `HTTP ${response.status}: ${response.statusText}`,
                    status: response.status,
                    code: response.status === 401 ? 'UNAUTHORIZED' : 'HTTP_ERROR',
                };
            }

            const data = await response.json();
            return { data, error: null, loading: false };
        } catch (error: any) {
            lastError = {
                message: error.message || 'Network error',
                status: error.status || 0,
                code: error.code || 'NETWORK_ERROR',
            };

            // Don't retry on auth errors
            if (error.status === 401 || error.status === 403) {
                break;
            }

            console.error(`[API] Request failed (attempt ${attempt + 1}):`, lastError.message);
        }
    }

    return { data: null, error: lastError, loading: false };
}

/**
 * Convenience methods
 */
export const api = {
    get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),

    post: <T>(endpoint: string, body: any) =>
        apiRequest<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        }),

    put: <T>(endpoint: string, body: any) =>
        apiRequest<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        }),

    delete: <T>(endpoint: string) =>
        apiRequest<T>(endpoint, { method: 'DELETE' }),
};
