/**
 * MONO — App Store (Zustand)
 *
 * Global application state: active workspace, active project,
 * user preferences, and theme management.
 *
 * Persisted to localStorage for session continuity.
 */
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import type { Project, UserPreferences, Workspace } from '@/lib/types/workspace'
import { DEFAULT_PREFERENCES } from '@/lib/types/workspace'

interface AppState {
  // ---- Active Context ----
  activeWorkspace: Workspace | null
  activeProject: Project | null

  // ---- User Preferences ----
  preferences: UserPreferences

  // ---- Derived: Current theme ----
  resolvedTheme: 'light' | 'dark'

  // ---- Actions ----
  setActiveWorkspace: (workspace: Workspace | null) => void
  setActiveProject: (project: Project | null) => void
  updatePreferences: (partial: Partial<UserPreferences>) => void
  setResolvedTheme: (theme: 'light' | 'dark') => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        activeWorkspace: null,
        activeProject: null,
        preferences: DEFAULT_PREFERENCES,
        resolvedTheme: 'light',

        setActiveWorkspace: (workspace) =>
          set({ activeWorkspace: workspace, activeProject: null }, false, 'setActiveWorkspace'),

        setActiveProject: (project) => set({ activeProject: project }, false, 'setActiveProject'),

        updatePreferences: (partial) =>
          set(
            (state) => ({ preferences: { ...state.preferences, ...partial } }),
            false,
            'updatePreferences'
          ),

        setResolvedTheme: (theme) => set({ resolvedTheme: theme }, false, 'setResolvedTheme'),
      }),
      {
        name: 'mono-app-store',
        partialize: (state) => ({
          preferences: state.preferences,
          // Don't persist active workspace here — handled by preferences
        }),
      }
    ),
    { name: 'MONO/AppStore' }
  )
)
