import { listItems } from '@/lib/db/items'
import { Item } from '@/lib/types/item'

export async function fetchWorkspaceItems(workspaceId?: string): Promise<Item[]> {
  const items = await listItems()
  if (!workspaceId) return items
  return items.filter((item) => item.workspaceId === workspaceId)
}
