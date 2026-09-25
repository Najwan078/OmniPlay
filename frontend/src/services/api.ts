import type { User, LoginCredentials, AuthResponse } from '../types/auth';

/**
 * OmniPlay Standard Fetch API Service Layer (Zero external dependency)
 * 
 * Built with native Fetch API and `credentials: 'include'` for HttpOnly cookies.
 * Eliminates bundle resolution errors while enforcing industry-standard security:
 * - Credentials (`credentials: 'include'`) for cross-site HttpOnly JWT cookies.
 * - Outbound payload sanitization against Prototype Pollution & XSS.
 * - Anti-CSRF token synchronization via standard headers.
 * - Global 401 interceptor forcefully purging auth state and redirecting to /login.
 * - Strict adherence to zero-localStorage policy for JWT access tokens.
 */

type AuthCallback = () => void;
let onUnauthorizedHandler: AuthCallback | null = null;
let onForbiddenHandler: AuthCallback | null = null;

export const registerAuthCallbacks = (
  onUnauthorized: AuthCallback,
  onForbidden?: AuthCallback
) => {
  onUnauthorizedHandler = onUnauthorized;
  if (onForbidden) {
    onForbiddenHandler = onForbidden;
  }
};

/**
 * Safe cookie reader for CSRF token retrieval
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Deep outbound payload sanitizer:
 * Strips dangerous prototype injection properties and potential malicious script tags.
 */
function sanitizePayload<T>(data: T): T {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizePayload(item)) as unknown as T;
  }

  const cleanObj: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    // Defense against prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      console.warn(`[Security Warning] Blocked prototype pollution attempt on key: "${key}"`);
      continue;
    }

    if (typeof value === 'string') {
      cleanObj[key] = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    } else if (typeof value === 'object' && value !== null) {
      cleanObj[key] = sanitizePayload(value);
    } else {
      cleanObj[key] = value;
    }
  }

  return cleanObj as T;
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || '/api';
  }

  private handleUnauthorized() {
    console.warn('[Security Interceptor] 401 Unauthorized: Session expired or invalid HttpOnly JWT.');

    if (onUnauthorizedHandler) {
      try {
        onUnauthorizedHandler();
      } catch (e) {
        console.error('Error executing unauthorized handler:', e);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('omni:unauthorized'));

      try {
        sessionStorage.clear();
        localStorage.removeItem('omni_operator_role');
      } catch {
        // Ignore
      }

      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/login')) {
        window.location.replace('/login');
      }
    }
  }

  private handleForbidden() {
    console.warn('[Security Interceptor] 403 Forbidden: Insufficient RBAC clearance.');
    if (onForbiddenHandler) {
      try {
        onForbiddenHandler();
      } catch (e) {
        console.error('Error executing forbidden handler:', e);
      }
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('omni:forbidden'));
    }
  }

  private async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    // 1. Build URL
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    if (options.params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(options.params)) {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      }
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    // 2. Prepare headers (Anti-CSRF & Content-Type)
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }
    headers.set('X-Requested-With', 'XMLHttpRequest');

    const csrfToken = getCookie('csrftoken') || getCookie('XSRF-TOKEN') || getCookie('csrf_access_token');
    if (csrfToken) {
      headers.set('X-CSRF-Token', csrfToken);
      headers.set('X-CSRFToken', csrfToken);
    }

    // 3. Outbound Payload Sanitization
    let body = options.body;
    if (body && typeof body === 'string') {
      try {
        const parsed = JSON.parse(body);
        const sanitized = sanitizePayload(parsed);
        body = JSON.stringify(sanitized);
      } catch {
        // Not a JSON string
      }
    }

    // 4. Execute fetch with credentials: 'include' (Critical for HttpOnly cookies)
    const fetchOptions: RequestInit = {
      ...options,
      headers,
      body,
      credentials: 'include', // CRITICAL: Permits transmission/reception of HttpOnly cookies
    };

    let response: Response;
    try {
      response = await fetch(url, fetchOptions);
    } catch (networkError) {
      console.error('[Network Error] Failed to fetch:', networkError);
      throw networkError;
    }

    // 5. Intercept Status Codes
    if (response.status === 401) {
      this.handleUnauthorized();
      throw new Error('401 Unauthorized: Session expired');
    }

    if (response.status === 403) {
      this.handleForbidden();
      throw new Error('403 Forbidden: Access denied');
    }

    // 6. Parse response data
    let data: T;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = (await response.json()) as T;
    } else if (contentType.includes('application/pdf') || headers.get('Accept') === 'application/pdf') {
      data = (await response.blob()) as unknown as T;
    } else {
      data = (await response.text()) as unknown as T;
    }

    if (!response.ok) {
      const errorMsg = typeof data === 'object' && data !== null && 'detail' in data 
        ? String((data as { detail: unknown }).detail) 
        : `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  async get<T = unknown>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    const serializedBody = body !== undefined 
      ? (typeof body === 'string' || body instanceof FormData ? body : JSON.stringify(body)) 
      : undefined;
    return this.request<T>(endpoint, { ...options, method: 'POST', body: serializedBody });
  }

  async put<T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    const serializedBody = body !== undefined 
      ? (typeof body === 'string' || body instanceof FormData ? body : JSON.stringify(body)) 
      : undefined;
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: serializedBody });
  }

  async delete<T = unknown>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

// Typed API Services
export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.warn('Backend logout request completed with non-200 status:', err);
    }
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};

export const gamesApi = {
  async getSteamDetails(appId: number) {
    const response = await apiClient.get(`/steam/details?app_id=${appId}`);
    return response.data;
  },
};

export const rentalApi = {
  async calculatePrice(data: {
    game_id: number;
    game_title: string;
    app_id: number;
    duration_hours: number;
    node_id: string;
    user_id?: string;
  }) {
    const response = await apiClient.post('/rental/calculate', data);
    return response.data;
  },

  async startSession(data: {
    game_id: number;
    app_id: number;
    duration_hours: number;
    node_id: string;
    user_id: string;
  }) {
    const response = await apiClient.post('/rental/session/start', data);
    return response.data;
  },
};

export const analyticsApi = {
  async exportReport(format: 'pdf' | 'json') {
    const response = await apiClient.get(`/analytics/export?format=${format}`);
    return response.data;
  },
};

export default apiClient;
