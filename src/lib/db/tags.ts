/**
 * MONO — Tag Database Operations
 *
 * Batch operations for renaming and merging tags across all items in a workspace.
 */
import { getDB } from './index'
import { Item } from '../types/item'

/**
 * Rename a tag across all items in a workspace.
 */
export async function renameTagInWorkspace(
  workspaceId: string,
  oldTag: string,
  newTag: string
): Promise<Item[]> {
  const db = await getDB()
  const tx = db.transaction('items', 'readwrite')
  const index = tx.store.index('by-workspace')

  const items = await index.getAll(workspaceId)
  const updatedItems: Item[] = []

  const source = oldTag.trim().toLowerCase()
  const target = newTag.trim().toLowerCase()

  if (!source || !target || source === target) return []

  for (const item of items) {
    if (item.tags.includes(source)) {
      const nextTags = Array.from(
        new Set(item.tags.map((t) => (t === source ? target : t)))
      )
      const updated: Item = {
        ...item,
        tags: nextTags,
        updatedAt: new Date().toISOString(),
      }
      await tx.store.put(updated)
      updatedItems.push(updated)
    }
  }

  await tx.done
  return updatedItems
}

/**
 * Merge sourceTag into targetTag across all items in a workspace.
 */
export async function mergeTagsInWorkspace(
  workspaceId: string,
  sourceTag: string,
  targetTag: string
): Promise<Item[]> {
  return renameTagInWorkspace(workspaceId, sourceTag, targetTag)
}
