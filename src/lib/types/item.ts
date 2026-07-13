/**
 * MONO — Universal Item Type System
 *
 * Everything in MONO is an "Item". A task, note, goal, habit, event,
 * bookmark, checklist — all inherit from this base. This is the single
 * most important architectural decision: one type, infinite views.
 */

// ============================
// Enums
// ============================

export enum ItemType {
  Task = 'task',
  Note = 'note',
  Goal = 'goal',
  Event = 'event',
  Habit = 'habit',
  Bookmark = 'bookmark',
  Checklist = 'checklist',
}

export enum Priority {
  None = 'none',
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}

export enum ItemStatus {
  Active = 'active',
  InProgress = 'in_progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Archived = 'archived',
}

// ============================
// Core Item Model
// ============================

export interface Item {
  /** Unique identifier (nanoid) */
  id: string

  /** Display title — required, max 500 chars */
  title: string

  /** Plain text notes */
  notes?: string

  /** Markdown content for rich notes */
  content?: string

  /** The type of item — determines rendering and behavior */
  type: ItemType

  /** Current status */
  status: ItemStatus

  /** Priority level */
  priority: Priority

  /** Parent workspace ID */
  workspaceId: string

  /** Parent project ID (optional — items can exist at workspace level) */
  projectId?: string

  /** Parent item ID for nesting (supports infinite depth) */
  parentId?: string

  /** ISO 8601 due date string */
  dueDate?: string

  /** ISO 8601 reminder datetime */
  reminderAt?: string

  /** Tags for cross-project organization */
  tags: string[]

  /** Custom key-value properties (extensible) */
  properties: Record<string, unknown>

  /** Estimated time in minutes */
  estimatedMinutes?: number

  /** Actual time tracked in minutes */
  trackedMinutes?: number

  /** Sort order within parent container (lower = higher) */
  sortOrder: number

  /** Whether this item is pinned to top */
  pinned: boolean

  /** Completion timestamp (ISO 8601) */
  completedAt?: string

  /** Creator user ID (Phase 3 — null in local-first mode) */
  createdBy?: string

  /** ISO 8601 creation timestamp */
  createdAt: string

  /** ISO 8601 last-updated timestamp */
  updatedAt: string
}

// ============================
// Sub-Item (Checklist Item)
// ============================

export interface SubItem {
  id: string
  parentId: string
  title: string
  completed: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// ============================
// Input Types for CRUD
// ============================

export type CreateItemInput = Pick<Item, 'title' | 'workspaceId'> &
  Partial<
    Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'sortOrder' | 'pinned'>
  >

export type UpdateItemInput = Partial<
  Omit<Item, 'id' | 'createdAt' | 'workspaceId' | 'createdBy'>
>

// ============================
// Query / Filter Types
// ============================

export interface ItemFilter {
  workspaceId?: string
  projectId?: string
  parentId?: string | null
  status?: ItemStatus | ItemStatus[]
  priority?: Priority | Priority[]
  type?: ItemType | ItemType[]
  tags?: string[]
  dueBefore?: string
  dueAfter?: string
  pinned?: boolean
  search?: string
}

export interface ItemSort {
  field: keyof Item
  direction: 'asc' | 'desc'
}
