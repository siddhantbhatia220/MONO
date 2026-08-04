'use client'

/**
 * MONO — Board Card Component
 *
 * A compact, interactive card rendered inside a Kanban column.
 * Displays title, priority badge, tags, due date, completion toggle, and mobile move actions.
 */
import React, { useState } from 'react'

import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, Circle, MoreHorizontal, MoveRight, Tag } from 'lucide-react'

import { useUIStore } from '@/lib/store/uiStore'
import { Item, ItemStatus, Priority } from '@/lib/types/item'
import { DEFAULT_BOARD_COLUMNS } from '@/lib/types/view'

interface BoardCardProps {
  item: Item
  onStatusChange: (id: string, status: ItemStatus) => void
}

export function BoardCard({ item, onStatusChange }: BoardCardProps) {
  const { openItemDetail } = useUIStore()
  const [showMoveMenu, setShowMoveMenu] = useState(false)
  const isCompleted = item.status === ItemStatus.Completed

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextStatus = isCompleted ? ItemStatus.Active : ItemStatus.Completed
    onStatusChange(item.id, nextStatus)
  }

  const handleMoveStatus = (e: React.MouseEvent, newStatus: ItemStatus) => {
    e.stopPropagation()
    onStatusChange(item.id, newStatus)
    setShowMoveMenu(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      onClick={() => openItemDetail(item.id)}
      className="
        group relative flex flex-col gap-2.5 p-3.5
        bg-white dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-800
        hover:border-zinc-400 dark:hover:border-zinc-600
        rounded-xl shadow-xs hover:shadow-md
        transition-all duration-150 cursor-pointer select-none
      "
    >
      <div className="flex items-start justify-between gap-2">
        {/* Completion Toggle */}
        <button
          type="button"
          onClick={handleToggleComplete}
          className="mt-0.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100 fill-current" />
          ) : (
            <Circle className="w-4 h-4" />
          )}
        </button>

        {/* Title */}
        <h4
          className={`
            flex-1 text-sm font-medium leading-snug tracking-tight
            ${isCompleted ? 'line-through text-zinc-400 dark:text-zinc-600' : 'text-zinc-900 dark:text-zinc-100'}
          `}
        >
          {item.title}
        </h4>

        {/* Mobile Move Button & Priority */}
        <div className="flex items-center gap-1">
          {item.priority !== Priority.None && (
            <span
              className="
                text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5
                bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300
                rounded border border-zinc-200 dark:border-zinc-700
              "
            >
              {item.priority}
            </span>
          )}

          {/* Quick Move Trigger for Mobile & Touch */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowMoveMenu(!showMoveMenu)
              }}
              className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              aria-label="Move card status"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {showMoveMenu && (
              <div
                className="absolute right-0 top-6 z-50 w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-1 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2.5 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                  Move to
                </div>
                {DEFAULT_BOARD_COLUMNS.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={(e) => handleMoveStatus(e, col.id as ItemStatus)}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-between"
                  >
                    <span>{col.title}</span>
                    <MoveRight className="w-3 h-3 text-zinc-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Metadata */}
      {(item.dueDate || item.tags.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-850 text-xs text-zinc-500">
          {item.dueDate && (
            <div className="flex items-center gap-1 text-[11px]">
              <Calendar className="w-3 h-3 text-zinc-400" />
              <span>{item.dueDate.split('T')[0]}</span>
            </div>
          )}

          {item.tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-0.5 text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded"
            >
              <Tag className="w-2.5 h-2.5" />
              <span>{tag}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
