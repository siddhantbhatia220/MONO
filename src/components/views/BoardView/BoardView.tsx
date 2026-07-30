'use client'

/**
 * MONO — Board (Kanban) View Component
 *
 * Full interactive Kanban board supporting status drag-and-drop,
 * column layout, and optimistic IndexedDB sync.
 */
import React from 'react'

import { updateItem } from '@/lib/db/items'
import { useItemStore } from '@/lib/store/itemStore'
import { Item, ItemStatus } from '@/lib/types/item'
import { DEFAULT_BOARD_COLUMNS } from '@/lib/types/view'

import { BoardColumn } from './BoardColumn'

interface BoardViewProps {
  items: Item[]
}

export function BoardView({ items }: BoardViewProps) {
  const { upsertItem } = useItemStore()
  const [activeColumnId, setActiveColumnId] = React.useState<string | 'all'>('all')

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

  const visibleColumns = DEFAULT_BOARD_COLUMNS.filter(
    (col) => activeColumnId === 'all' || col.id === activeColumnId
  )

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      {/* Mobile Column Tab Selector */}
      <div className="md:hidden flex items-center gap-1.5 px-4 py-2 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveColumnId('all')}
          className={`
            px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex-shrink-0 cursor-pointer
            ${
              activeColumnId === 'all'
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }
          `}
        >
          All Columns
        </button>
        {DEFAULT_BOARD_COLUMNS.map((col) => (
          <button
            key={col.id}
            type="button"
            onClick={() => setActiveColumnId(col.id)}
            className={`
              px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex-shrink-0 cursor-pointer
              ${
                activeColumnId === col.id
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }
            `}
          >
            {col.title}
          </button>
        ))}
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex-1 overflow-x-auto p-3 md:p-6 snap-x snap-mandatory scroll-smooth">
        <div className="flex gap-3 md:gap-4 h-[calc(100vh-210px)] md:h-[calc(100vh-140px)] min-w-full pb-4">
          {visibleColumns.map((col) => {
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
    </div>
  )
}
