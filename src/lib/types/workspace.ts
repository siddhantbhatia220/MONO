/**
 * MONO — Workspace & Project Type System
 *
 * Data hierarchy: Workspace → Space → Project → Collection → Items
 * This mirrors a filesystem — predictable, composable, extensible.
 */

// ============================
// Workspace
// ============================

export interface Workspace {
  /** Unique identifier (nanoid) */
  id: string

  /** Display name */
  name: string

  /** Emoji icon for visual identification */
  icon: string

  /** Optional description */
  description?: string

  /** Sort order in workspace list */
  sortOrder: number

  /** Theme override ('light' | 'dark' | 'system') */
  theme: 'light' | 'dark' | 'system'

  /** Density preference */
  density: 'compact' | 'comfortable' | 'spacious'

  /** ISO 8601 creation timestamp */
  createdAt: string

  /** ISO 8601 last-updated timestamp */
  updatedAt: string
}

// ============================
// Project
// ============================

export interface Project {
  /** Unique identifier (nanoid) */
  id: string

  /** Parent workspace ID */
  workspaceId: string

  /** Parent project ID (for nested projects) */
  parentId?: string

  /** Display name */
  name: string

  /** Emoji or text icon */
  icon: string

  /** Optional description */
  description?: string

  /** Sort order within workspace */
  sortOrder: number

  /** Whether project is archived */
  archived: boolean

  /** ISO 8601 creation timestamp */
  createdAt: string

  /** ISO 8601 last-updated timestamp */
  updatedAt: string
}

// ============================
// User Preferences
// ============================

export interface UserPreferences {
  /** Active workspace ID */
  activeWorkspaceId?: string

  /** Active project ID */
  activeProjectId?: string

  /** Global theme */
  theme: 'light' | 'dark' | 'system'

  /** UI density */
  density: 'compact' | 'comfortable' | 'spacious'

  /** Whether sidebar is collapsed */
  sidebarCollapsed: boolean

  /** Whether to show completed items */
  showCompleted: boolean

  /** Default item sort */
  defaultSort: 'manual' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt' | 'title'

  /** Animation speed multiplier (0.5 = faster, 2 = slower) */
  animationSpeed: number

  /** Whether reduced motion is enabled */
  reducedMotion: boolean
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  density: 'comfortable',
  sidebarCollapsed: false,
  showCompleted: false,
  defaultSort: 'manual',
  animationSpeed: 1,
  reducedMotion: false,
}

// ============================
// Input Types
// ============================

export type CreateWorkspaceInput = Pick<Workspace, 'name' | 'icon'> &
  Partial<Omit<Workspace, 'id' | 'createdAt' | 'updatedAt' | 'sortOrder'>>

export type UpdateWorkspaceInput = Partial<Omit<Workspace, 'id' | 'createdAt'>>

export type CreateProjectInput = Pick<Project, 'workspaceId' | 'name'> &
  Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'sortOrder' | 'archived'>>

export type UpdateProjectInput = Partial<Omit<Project, 'id' | 'createdAt' | 'workspaceId'>>
