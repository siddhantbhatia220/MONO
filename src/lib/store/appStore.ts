/**
 * MONO — App Store (Zustand)
 *
 * Global application state: active workspace, active project,
 * user preferences, and theme management.
 *
 * Persisted to localStorage for session continuity.
 */
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { SavedFilter } from '@/lib/types/filterPreset'
import { DEFAULT_FILTER_CRITERIA, FilterCriteria, ViewMode } from '@/lib/types/view'
import type { Project, UserPreferences, Workspace } from '@/lib/types/workspace'
import { DEFAULT_PREFERENCES } from '@/lib/types/workspace'

interface AppState {
  // ---- Active Context ----
  activeWorkspace: Workspace | null
  activeProject: Project | null

  // ---- View & Filter State ----
  activeViewMode: ViewMode
  activeFilterCriteria: FilterCriteria
  savedFilters: SavedFilter[]

  // ---- User Preferences ----
  preferences: UserPreferences

  // ---- Derived: Current theme ----
  resolvedTheme: 'light' | 'dark'

  // ---- Actions ----
  setActiveWorkspace: (workspace: Workspace | null) => void
  setActiveProject: (project: Project | null) => void
  setActiveViewMode: (viewMode: ViewMode) => void
  setActiveFilterCriteria: (filter: Partial<FilterCriteria>) => void
  resetFilterCriteria: () => void
  addSavedFilter: (name: string, criteria: FilterCriteria) => void
  removeSavedFilter: (id: string) => void
  updatePreferences: (partial: Partial<UserPreferences>) => void
  setResolvedTheme: (theme: 'light' | 'dark') => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        activeWorkspace: null,
        activeProject: null,
        activeViewMode: ViewMode.List,
        activeFilterCriteria: DEFAULT_FILTER_CRITERIA,
        savedFilters: [],
        preferences: DEFAULT_PREFERENCES,
        resolvedTheme: 'light',

        setActiveWorkspace: (workspace) =>
          set({ activeWorkspace: workspace, activeProject: null }, false, 'setActiveWorkspace'),

        setActiveProject: (project) => set({ activeProject: project }, false, 'setActiveProject'),

        setActiveViewMode: (viewMode) =>
          set({ activeViewMode: viewMode }, false, 'setActiveViewMode'),

        setActiveFilterCriteria: (partialFilter) =>
          set(
            (state) => ({
              activeFilterCriteria: { ...state.activeFilterCriteria, ...partialFilter },
            }),
            false,
            'setActiveFilterCriteria'
          ),

        resetFilterCriteria: () =>
          set({ activeFilterCriteria: DEFAULT_FILTER_CRITERIA }, false, 'resetFilterCriteria'),

        addSavedFilter: (name, criteria) =>
          set(
            (state) => ({
              savedFilters: [
                ...state.savedFilters,
                { id: nanoid(), name, criteria, createdAt: new Date().toISOString() },
              ],
            }),
            false,
            'addSavedFilter'
          ),

        removeSavedFilter: (id) =>
          set(
            (state) => ({
              savedFilters: state.savedFilters.filter((f) => f.id !== id),
            }),
            false,
            'removeSavedFilter'
          ),

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
          activeViewMode: state.activeViewMode,
          savedFilters: state.savedFilters,
        }),
      }
    ),
    { name: 'MONO/AppStore' }
  )
)
