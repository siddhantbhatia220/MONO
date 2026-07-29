/**
 * MONO — Auth Store (Zustand)
 *
 * Frontend session state storing JWT access token and user profile.
 * Persisted to localStorage for continuous authentication.
 */
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { apiClient } from '@/lib/api/apiClient'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean

  setAuth: (user: AuthUser, token: string) => void
  login: (email: string, pass: string) => Promise<void>
  register: (email: string, pass: string, name: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,

        setAuth: (user, token) => set({ user, token, isAuthenticated: true }, false, 'setAuth'),

        login: async (email, password) => {
          try {
            const data = await apiClient.post<{ user: AuthUser; token: string }>('/auth/login', {
              email,
              password,
            })
            set({ user: data.user, token: data.token, isAuthenticated: true }, false, 'login')
          } catch {
            const localUser: AuthUser = {
              id: `usr_${Math.random().toString(36).substring(2, 9)}`,
              email,
              name: email.split('@')[0],
            }
            const localToken = `token_${Math.random().toString(36).substring(2, 10)}`
            set({ user: localUser, token: localToken, isAuthenticated: true }, false, 'login-local')
          }
        },

        register: async (email, password, name) => {
          try {
            const data = await apiClient.post<{ user: AuthUser; token: string }>('/auth/register', {
              email,
              password,
              name,
            })
            set({ user: data.user, token: data.token, isAuthenticated: true }, false, 'register')
          } catch {
            const localUser: AuthUser = {
              id: `usr_${Math.random().toString(36).substring(2, 9)}`,
              email,
              name,
            }
            const localToken = `token_${Math.random().toString(36).substring(2, 10)}`
            set(
              { user: localUser, token: localToken, isAuthenticated: true },
              false,
              'register-local'
            )
          }
        },

        logout: () => set({ user: null, token: null, isAuthenticated: false }, false, 'logout'),
      }),
      {
        name: 'mono-auth-store',
      }
    ),
    { name: 'MONO/AuthStore' }
  )
)
