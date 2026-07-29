'use client'

/**
 * MONO — Board Column Component
 *
 * A status lane container in the Kanban board.
 * Accepts dropped items and renders item cards.
 */
import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Item, ItemStatus } from '@/lib/types/item'
import { BoardColumnConfig } from '@/lib/types/view'
import { BoardCard } from './BoardCard'

interface BoardColumnProps {
  column: BoardColumnConfig
  items: Item[]
  onStatusChange: (id: string, status: ItemStatus) => void
  onQuickAdd?: (status: ItemStatus) => void
}

export function BoardColumn({ column, items, onStatusChange, onQuickAdd }: BoardColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const itemId = e.dataTransfer.getData('text/plain')
    if (itemId) {
      onStatusChange(itemId, column.id)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        flex flex-col flex-1 min-w-[280px] max-w-[340px] h-full
        bg-zinc-50/70 dark:bg-zinc-900/40
        border rounded-2xl p-3
        transition-colors duration-150
        ${
          isDragOver
            ? 'border-zinc-500 dark:border-zinc-400 bg-zinc-100/80 dark:bg-zinc-850/60'
            : 'border-zinc-200/80 dark:border-zinc-800/80'
        }
      `}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            {column.title}
          </h3>
          <span className="px-2 py-0.5 text-[11px] font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full">
            {items.length}
          </span>
        </div>

        {onQuickAdd && (
          <button
            type="button"
            onClick={() => onQuickAdd(column.id)}
            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            aria-label={`Add item to ${column.title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', item.id)
            }}
          >
            <BoardCard item={item} onStatusChange={onStatusChange} />
          </div>
        ))}

        {items.length === 0 && (
          <div className="h-24 flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            <span className="text-xs text-zinc-400">No items</span>
          </div>
        )}
      </div>
    </div>
  )
}
