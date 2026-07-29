/**
 * MONO — Offline Sync Queue
 *
 * Queues mutations made while offline in IndexedDB.
 * Automatically replays them against the server when connectivity returns.
 */
import { IDBPDatabase, openDB } from 'idb'

export interface QueuedMutation {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  itemId: string
  payload: Record<string, unknown>
  timestamp: number
}

const DB_NAME = 'mono-sync-queue'
const STORE_NAME = 'mutations'

async function getDb(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    },
  })
}

/**
 * Enqueue a mutation for later server replay.
 */
export async function enqueueMutation(mutation: QueuedMutation): Promise<void> {
  const db = await getDb()
  await db.put(STORE_NAME, mutation)
}

/**
 * Get all queued mutations in chronological order.
 */
export async function getQueuedMutations(): Promise<QueuedMutation[]> {
  const db = await getDb()
  const all = await db.getAll(STORE_NAME)
  return (all as QueuedMutation[]).sort((a, b) => a.timestamp - b.timestamp)
}

/**
 * Remove a mutation from the queue after successful server push.
 */
export async function dequeueMutation(id: string): Promise<void> {
  const db = await getDb()
  await db.delete(STORE_NAME, id)
}

/**
 * Clear the entire mutation queue.
 */
export async function clearQueue(): Promise<void> {
  const db = await getDb()
  await db.clear(STORE_NAME)
}
