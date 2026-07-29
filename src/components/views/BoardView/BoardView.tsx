'use client'

/**
 * MONO — Board (Kanban) View Component
 *
 * Full interactive Kanban board supporting status drag-and-drop,
 * column layout, and optimistic IndexedDB sync.
 */
import React from 'react'
import { Item, ItemStatus } from '@/lib/types/item'
import { DEFAULT_BOARD_COLUMNS } from '@/lib/types/view'
import { updateItem } from '@/lib/db/items'
import { useItemStore } from '@/lib/store/itemStore'
import { BoardColumn } from './BoardColumn'

interface BoardViewProps {
  items: Item[]
}

export function BoardView({ items }: BoardViewProps) {
  const { upsertItem } = useItemStore()

  const handleStatusChange = async (id: string, newStatus: ItemStatus) => {
    const item = items.find((i) => i.id === id)
    if (!item || item.status === newStatus) return

    const updated: Item = {
      ...item,
      status: newStatus,
      completedAt: newStatus === ItemStatus.Completed ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    }

    // Optimistic store update
    upsertItem(updated)

    // DB sync
    try {
      await updateItem(id, {
        status: newStatus,
        completedAt: updated.completedAt,
      })
    } catch (err) {
      console.error('Failed to sync status update to DB:', err)
    }
  }

  return (
    <div className="flex-1 overflow-x-auto p-3 md:p-6 snap-x snap-mandatory scroll-smooth">
      <div className="flex gap-3 md:gap-4 h-[calc(100vh-160px)] md:h-[calc(100vh-140px)] min-w-full pb-4">
        {DEFAULT_BOARD_COLUMNS.map((col) => {
          const columnItems = items.filter((item) => col.statuses.includes(item.status))
          return (
            <BoardColumn
              key={col.id}
              column={col}
              items={columnItems}
              onStatusChange={handleStatusChange}
            />
          )
        })}
      </div>
    </div>
  )
}
