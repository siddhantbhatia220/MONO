/**
 * MONO — Universal Search & Filter Engine
 *
 * Perform fast, in-memory filtering and full-text matching
 * over Universal Items based on query text, tags, status, and priority.
 */
import { Item, ItemStatus, Priority } from '@/lib/types/item'
import { FilterCriteria } from '@/lib/types/view'

/**
 * Filter items by active criteria (search text, tags, priority, status).
 */
export function filterItems(items: Item[], filter: FilterCriteria): Item[] {
  const query = filter.searchQuery.trim().toLowerCase()
  const hasQuery = query.length > 0
  const hasTags = filter.tags.length > 0
  const filterPriority = filter.priority !== 'all'
  const filterStatus = filter.status !== 'all'

  return items.filter((item) => {
    // Pinned filter
    if (filter.pinnedOnly && !item.pinned) {
      return false
    }

    // Status filter
    if (filterStatus && item.status !== filter.status) {
      return false
    }

    // Priority filter
    if (filterPriority && item.priority !== filter.priority) {
      return false
    }

    // Tag filter (item must contain all selected tags)
    if (hasTags) {
      const itemTagSet = new Set(item.tags.map((t) => t.toLowerCase()))
      const matchesAllTags = filter.tags.every((t) => itemTagSet.has(t.toLowerCase()))
      if (!matchesAllTags) return false
    }

    // Text search (title, notes, content, and tag strings)
    if (hasQuery) {
      const matchTitle = item.title.toLowerCase().includes(query)
      const matchNotes = item.notes?.toLowerCase().includes(query) ?? false
      const matchContent = item.content?.toLowerCase().includes(query) ?? false
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(query))

      if (!matchTitle && !matchNotes && !matchContent && !matchTags) {
        return false
      }
    }

    return true
  })
}
