/**
 * MONO — IndexedDB Database Layer
 *
 * Local-first persistence using the `idb` library.
 * All data lives on-device. Sync (Phase 3) happens on top of this.
 *
 * Schema versioning ensures safe migrations as the app evolves.
 */
import { type DBSchema, type IDBPDatabase, openDB } from 'idb'

import type { Item, SubItem } from '@/lib/types/item'
import type { Project, UserPreferences, Workspace } from '@/lib/types/workspace'
import { DEFAULT_PREFERENCES } from '@/lib/types/workspace'

// ============================
// Database Schema
// ============================

interface MonoDB extends DBSchema {
  items: {
    key: string
    value: Item
    indexes: {
      'by-workspace': string
      'by-project': string
      'by-parent': string
      'by-status': string
      'by-due-date': string
      'by-created-at': string
      'by-updated-at': string
    }
  }
  subItems: {
    key: string
    value: SubItem
    indexes: {
      'by-parent': string
    }
  }
  workspaces: {
    key: string
    value: Workspace
  }
  projects: {
    key: string
    value: Project
    indexes: {
      'by-workspace': string
      'by-parent': string
    }
  }
  preferences: {
    key: 'global'
    value: UserPreferences
  }
}

// ============================
// DB Instance (Singleton)
// ============================

const DB_NAME = 'mono-os'
const DB_VERSION = 1

let dbInstance: IDBPDatabase<MonoDB> | null = null

/**
 * Get or initialize the IndexedDB database.
 * Creates the schema on first run; handles upgrades on version bumps.
 */
export async function getDB(): Promise<IDBPDatabase<MonoDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<MonoDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      // Version 1 — Initial schema
      if (oldVersion < 1) {
        // Items store
        const itemStore = db.createObjectStore('items', { keyPath: 'id' })
        itemStore.createIndex('by-workspace', 'workspaceId')
        itemStore.createIndex('by-project', 'projectId')
        itemStore.createIndex('by-parent', 'parentId')
        itemStore.createIndex('by-status', 'status')
        itemStore.createIndex('by-due-date', 'dueDate')
        itemStore.createIndex('by-created-at', 'createdAt')
        itemStore.createIndex('by-updated-at', 'updatedAt')

        // SubItems store
        const subItemStore = db.createObjectStore('subItems', { keyPath: 'id' })
        subItemStore.createIndex('by-parent', 'parentId')

        // Workspaces store (no indexes needed — small collection)
        db.createObjectStore('workspaces', { keyPath: 'id' })

        // Projects store
        const projectStore = db.createObjectStore('projects', { keyPath: 'id' })
        projectStore.createIndex('by-workspace', 'workspaceId')
        projectStore.createIndex('by-parent', 'parentId')

        // Preferences store (single record)
        db.createObjectStore('preferences')
      }
    },
    blocked() {
      console.warn('[MONO DB] Upgrade blocked by another tab. Please close other tabs.')
    },
    blocking() {
      // Another tab wants to upgrade — close our connection
      dbInstance?.close()
      dbInstance = null
    },
    terminated() {
      dbInstance = null
    },
  })

  return dbInstance
}

// ============================
// Preferences Operations
// ============================

export async function getPreferences(): Promise<UserPreferences> {
  const db = await getDB()
  const prefs = await db.get('preferences', 'global')
  return prefs ?? DEFAULT_PREFERENCES
}

export async function savePreferences(prefs: UserPreferences): Promise<void> {
  const db = await getDB()
  await db.put('preferences', prefs, 'global')
}

export async function updatePreferences(
  partial: Partial<UserPreferences>
): Promise<UserPreferences> {
  const current = await getPreferences()
  const updated = { ...current, ...partial }
  await savePreferences(updated)
  return updated
}
