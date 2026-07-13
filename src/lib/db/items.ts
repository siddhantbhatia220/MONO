/**
 * MONO — Items Database Operations
 *
 * Full CRUD for Items with filtering, sorting, and search.
 * All operations are optimistic — they update local DB immediately.
 */

import { nanoid } from 'nanoid'
import { getDB } from './index'
import {
  type Item,
  type CreateItemInput,
  type UpdateItemInput,
  type ItemFilter,
  type ItemSort,
  ItemStatus,
  Priority,
  ItemType,
} from '@/lib/types/item'

// ============================
// Create
// ============================

/**
 * Create a new item in the database.
 * Assigns a unique ID, timestamps, and sensible defaults.
 */
export async function createItem(input: CreateItemInput): Promise<Item> {
  const db = await getDB()
  const now = new Date().toISOString()

  // Get next sort order for this parent context
  const siblings = await listItems({
    workspaceId: input.workspaceId,
    projectId: input.projectId ?? undefined,
    parentId: input.parentId ?? null,
  })
  const maxOrder = siblings.reduce((max, i) => Math.max(max, i.sortOrder), -1)

  const item: Item = {
    id: nanoid(),
    title: input.title.trim(),
    notes: input.notes,
    content: input.content,
    type: input.type ?? ItemType.Task,
    status: ItemStatus.Active,
    priority: input.priority ?? Priority.None,
    workspaceId: input.workspaceId,
    projectId: input.projectId,
    parentId: input.parentId,
    dueDate: input.dueDate,
    reminderAt: input.reminderAt,
    tags: input.tags ?? [],
    properties: input.properties ?? {},
    estimatedMinutes: input.estimatedMinutes,
    trackedMinutes: undefined,
    sortOrder: maxOrder + 1,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  }

  await db.put('items', item)
  return item
}

// ============================
// Read
// ============================

/**
 * Get a single item by ID. Returns null if not found.
 */
export async function getItem(id: string): Promise<Item | null> {
  const db = await getDB()
  const item = await db.get('items', id)
  return item ?? null
}

/**
 * List items with optional filtering and sorting.
 * Designed to be the single query API for all views.
 */
export async function listItems(
  filter: ItemFilter = {},
  sort?: ItemSort
): Promise<Item[]> {
  const db = await getDB()
  let items: Item[]

  // Use indexes where possible for performance
  if (filter.workspaceId && !filter.projectId) {
    items = await db.getAllFromIndex('items', 'by-workspace', filter.workspaceId)
  } else if (filter.projectId) {
    items = await db.getAllFromIndex('items', 'by-project', filter.projectId)
  } else {
    items = await db.getAll('items')
  }

  // Apply remaining filters in memory
  items = items.filter((item) => {
    if (filter.workspaceId && item.workspaceId !== filter.workspaceId) return false

    // parentId: null means top-level items, undefined means no filter
    if (filter.parentId !== undefined) {
      if (filter.parentId === null && item.parentId != null) return false
      if (filter.parentId !== null && item.parentId !== filter.parentId) return false
    }

    if (filter.status) {
      const statuses = Array.isArray(filter.status) ? filter.status : [filter.status]
      if (!statuses.includes(item.status)) return false
    }

    if (filter.priority) {
      const priorities = Array.isArray(filter.priority) ? filter.priority : [filter.priority]
      if (!priorities.includes(item.priority)) return false
    }

    if (filter.type) {
      const types = Array.isArray(filter.type) ? filter.type : [filter.type]
      if (!types.includes(item.type)) return false
    }

    if (filter.tags && filter.tags.length > 0) {
      if (!filter.tags.some((tag) => item.tags.includes(tag))) return false
    }

    if (filter.dueBefore && item.dueDate) {
      if (item.dueDate > filter.dueBefore) return false
    }

    if (filter.dueAfter && item.dueDate) {
      if (item.dueDate < filter.dueAfter) return false
    }

    if (filter.pinned !== undefined && item.pinned !== filter.pinned) return false

    if (filter.search) {
      const query = filter.search.toLowerCase()
      const matches =
        item.title.toLowerCase().includes(query) ||
        item.notes?.toLowerCase().includes(query) ||
        item.content?.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
      if (!matches) return false
    }

    return true
  })

  // Sort
  const sortField = sort?.field ?? 'sortOrder'
  const sortDir = sort?.direction ?? 'asc'

  items.sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]

    if (aVal === undefined || aVal === null) return sortDir === 'asc' ? 1 : -1
    if (bVal === undefined || bVal === null) return sortDir === 'asc' ? -1 : 1

    // Pinned items always first
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    }

    return 0
  })

  return items
}

// ============================
// Update
// ============================

/**
 * Update an item by ID. Only the provided fields are changed.
 * Always updates the `updatedAt` timestamp.
 */
export async function updateItem(id: string, input: UpdateItemInput): Promise<Item | null> {
  const db = await getDB()
  const existing = await db.get('items', id)
  if (!existing) return null

  const updated: Item = {
    ...existing,
    ...input,
    id, // never allow id to change
    createdAt: existing.createdAt, // never allow createdAt to change
    updatedAt: new Date().toISOString(),
  }

  await db.put('items', updated)
  return updated
}

/**
 * Mark an item as completed. Sets status and completedAt timestamp.
 */
export async function completeItem(id: string): Promise<Item | null> {
  return updateItem(id, {
    status: ItemStatus.Completed,
    completedAt: new Date().toISOString(),
  })
}

/**
 * Restore a completed item back to active status.
 */
export async function restoreItem(id: string): Promise<Item | null> {
  return updateItem(id, {
    status: ItemStatus.Active,
    completedAt: undefined,
  })
}

/**
 * Reorder items by updating their sortOrder values.
 */
export async function reorderItems(orderedIds: string[]): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('items', 'readwrite')

  await Promise.all(
    orderedIds.map(async (id, index) => {
      const item = await tx.store.get(id)
      if (item) {
        await tx.store.put({ ...item, sortOrder: index, updatedAt: new Date().toISOString() })
      }
    })
  )

  await tx.done
}

// ============================
// Delete
// ============================

/**
 * Permanently delete an item and all its children.
 */
export async function deleteItem(id: string): Promise<void> {
  const db = await getDB()

  // Recursively find and delete all children
  const children = await db.getAllFromIndex('items', 'by-parent', id)
  await Promise.all(children.map((child) => deleteItem(child.id)))

  // Delete sub-items
  const subItems = await db.getAllFromIndex('subItems', 'by-parent', id)
  const tx = db.transaction(['items', 'subItems'], 'readwrite')
  await Promise.all([
    tx.objectStore('items').delete(id),
    ...subItems.map((si) => tx.objectStore('subItems').delete(si.id)),
  ])
  await tx.done
}

/**
 * Archive an item (soft delete — keeps data, hides from views).
 */
export async function archiveItem(id: string): Promise<Item | null> {
  return updateItem(id, { status: ItemStatus.Archived })
}

// ============================
// Search
// ============================

/**
 * Full-text search across all items in a workspace.
 * Searches title, notes, content, and tags.
 */
export async function searchItems(query: string, workspaceId?: string): Promise<Item[]> {
  if (!query.trim()) return []

  return listItems(
    { workspaceId, search: query },
    { field: 'updatedAt', direction: 'desc' }
  )
}
