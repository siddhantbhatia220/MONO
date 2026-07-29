/**
 * MONO — Auth Store (Zustand)
 *
 * Frontend session state storing JWT access token and user profile.
 * Persisted to localStorage for continuous authentication.
 */
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

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

        logout: () => set({ user: null, token: null, isAuthenticated: false }, false, 'logout'),
      }),
      {
        name: 'mono-auth-store',
      }
    ),
    { name: 'MONO/AuthStore' }
  )
)
