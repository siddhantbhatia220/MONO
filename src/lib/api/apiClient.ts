/**
 * MONO — Frontend API Client
 *
 * Centralized HTTP fetch wrapper for interacting with NestJS backend APIs.
 * Automatically attaches JWT auth bearer tokens if present in local state.
 */
import { useAuthStore } from '../store/authStore'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface FetchOptions extends RequestInit {
  params?: Record<string, string>
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options
  const token = useAuthStore.getState().token

  let url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const config: RequestInit = {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...customConfig,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    let errorMsg = `HTTP error ${response.status}`
    try {
      const errData = await response.json()
      errorMsg = errData.message || errorMsg
    } catch {}
    throw new Error(errorMsg)
  }

  return response.json()
}

export const apiClient = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'DELETE',
      ...(body ? { body: JSON.stringify(body) } : {}),
    }),
}
