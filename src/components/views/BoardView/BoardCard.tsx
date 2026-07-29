'use client'

/**
 * MONO — Board Card Component
 *
 * A compact, interactive card rendered inside a Kanban column.
 * Displays title, priority badge, tags, due date, and completion toggle.
 */
import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, Circle, Tag } from 'lucide-react'
import { Item, ItemStatus, Priority } from '@/lib/types/item'
import { useUIStore } from '@/lib/store/uiStore'

interface BoardCardProps {
  item: Item
  onStatusChange: (id: string, status: ItemStatus) => void
}

export function BoardCard({ item, onStatusChange }: BoardCardProps) {
  const { openItemDetail } = useUIStore()
  const isCompleted = item.status === ItemStatus.Completed

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextStatus = isCompleted ? ItemStatus.Active : ItemStatus.Completed
    onStatusChange(item.id, nextStatus)
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
          className="mt-0.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
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

        {/* Priority Indicator */}
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
