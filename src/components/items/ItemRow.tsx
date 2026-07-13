'use client'

/**
 * MONO — Item Row Component
 * A single item in the list view. Animated, accessible, keyboard navigable.
 */

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreHorizontal, Trash2, Calendar, Tag, ChevronRight } from 'lucide-react'
import { Checkbox, PriorityBadge } from '@/components/ui'
import { useUIStore } from '@/lib/store/uiStore'
import { useItemStore } from '@/lib/store/itemStore'
import { completeItem, restoreItem, deleteItem } from '@/lib/db/items'
import { formatDueDate, isOverdue } from '@/lib/utils/date'
import { useIsMobile } from '@/lib/hooks/useIsMobile'
import type { Item } from '@/lib/types/item'
import { ItemStatus, Priority } from '@/lib/types/item'

interface ItemRowProps {
  item: Item
  depth?: number
  hasChildren?: boolean
  isSelected?: boolean
  onSelect?: (id: string) => void
}

export function ItemRow({
  item,
  depth = 0,
  hasChildren = false,
  isSelected = false,
  onSelect,
}: ItemRowProps) {
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const { openItemDetail, addToast } = useUIStore()
  const { upsertItem, removeItem } = useItemStore()

  const isCompleted = item.status === ItemStatus.Completed
  const overdue = item.dueDate && !isCompleted && isOverdue(item.dueDate)

  const handleToggle = useCallback(
    async (checked: boolean) => {
      try {
        const updated = checked ? await completeItem(item.id) : await restoreItem(item.id)
        if (updated) upsertItem(updated)
      } catch {
        addToast({ message: 'Failed to update item', type: 'error' })
      }
    },
    [item.id, upsertItem, addToast]
  )

  const handleDelete = useCallback(async () => {
    try {
      await deleteItem(item.id)
      removeItem(item.id)
      addToast({ message: 'Item deleted', type: 'info', duration: 3000 })
    } catch {
      addToast({ message: 'Failed to delete item', type: 'error' })
    }
  }, [item.id, removeItem, addToast])

  const handleClick = useCallback(() => {
    onSelect?.(item.id)
    openItemDetail(item.id)
  }, [item.id, onSelect, openItemDetail])

  const isMobile = useIsMobile()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2, layout: { duration: 0.2 } }}
      className={`
        group relative flex items-start gap-2 py-2 px-2.5 rounded-lg
        cursor-pointer transition-colors duration-100
        ${isSelected
          ? 'bg-zinc-100 dark:bg-zinc-900'
          : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
        }
        ${isCompleted ? 'opacity-40' : ''}
      `}
      style={{ paddingLeft: `${(depth * 20) + 8}px` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="article"
      aria-label={item.title}
    >
      {/* Expand/collapse for items with children */}
      {hasChildren ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setExpanded(!expanded)
          }}
          className="mt-1 text-zinc-400 dark:text-zinc-600 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors flex-shrink-0 p-1 -m-1"
          aria-label={expanded ? 'Collapse' : 'Expand'}
          aria-expanded={expanded}
        >
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
            <ChevronRight size={14} />
          </motion.div>
        </button>
      ) : (
        <div className="w-[14px] flex-shrink-0" />
      )}

      {/* Checkbox */}
      <div className="mt-1 flex-shrink-0">
        <Checkbox
          checked={isCompleted}
          onChange={handleToggle}
          size="sm"
          aria-label={`Mark "${item.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0" onClick={handleClick}>
        {isMobile ? (
          <div className="flex flex-col gap-1 min-w-0">
            {/* Title */}
            <span
              className={`
                text-sm leading-snug font-medium break-words
                ${isCompleted
                  ? 'line-through text-zinc-400 dark:text-zinc-650'
                  : 'text-zinc-800 dark:text-zinc-200'
                }
              `}
            >
              {item.title}
            </span>

            {/* Mobile Metadata Sub-row */}
            {(item.priority !== Priority.None || item.dueDate || item.tags.length > 0) && (
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                {item.priority !== Priority.None && (
                  <PriorityBadge priority={item.priority} className="text-[10px] scale-90 origin-left" />
                )}

                {item.dueDate && (
                  <span
                    className={`
                      flex items-center gap-0.5 text-[10px]
                      ${overdue
                        ? 'text-black dark:text-white font-semibold'
                        : 'text-zinc-400 dark:text-zinc-500'
                      }
                    `}
                  >
                    <Calendar size={10} />
                    {formatDueDate(item.dueDate)}
                  </span>
                )}

                {item.tags.length > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                    <Tag size={10} />
                    {item.tags.slice(0, 2).join(', ')}
                    {item.tags.length > 2 && ` +${item.tags.length - 2}`}
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            {/* Title */}
            <span
              className={`
                text-sm leading-snug flex-1 min-w-0
                ${isCompleted
                  ? 'line-through text-zinc-400 dark:text-zinc-600'
                  : 'text-zinc-800 dark:text-zinc-200'
                }
              `}
            >
              {item.title}
            </span>

            {/* Priority badge */}
            {item.priority !== Priority.None && (
              <PriorityBadge priority={item.priority} className="flex-shrink-0" />
            )}

            {/* Due date */}
            {item.dueDate && (
              <span
                className={`
                  flex items-center gap-1 text-xs flex-shrink-0
                  ${overdue
                    ? 'text-zinc-800 dark:text-zinc-200 font-medium'
                    : 'text-zinc-400 dark:text-zinc-500'
                  }
                `}
              >
                <Calendar size={10} />
                {formatDueDate(item.dueDate)}
              </span>
            )}

            {/* Tags */}
            {item.tags.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0">
                <Tag size={10} />
                {item.tags.slice(0, 2).join(', ')}
                {item.tags.length > 2 && ` +${item.tags.length - 2}`}
              </span>
            )}
          </div>
        )}

        {/* Notes preview */}
        {item.notes && !isCompleted && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 truncate">
            {item.notes}
          </p>
        )}
      </div>

      {/* Actions (Hover on Desktop, Always Visible on Mobile) */}
      <AnimatePresence>
        {(hovered || isMobile) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="flex items-center gap-1 flex-shrink-0 self-center"
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              aria-label={`Delete "${item.title}"`}
              className="
                p-2 md:p-1.5 rounded-md text-zinc-400 dark:text-zinc-600
                hover:text-zinc-900 hover:bg-zinc-100
                dark:hover:text-zinc-200 dark:hover:bg-zinc-800
                transition-colors duration-100
                focus-visible:outline-black dark:focus-visible:outline-white cursor-pointer
              "
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClick()
              }}
              aria-label={`Open "${item.title}"`}
              className="
                p-2 md:p-1.5 rounded-md text-zinc-400 dark:text-zinc-600
                hover:text-zinc-900 hover:bg-zinc-100
                dark:hover:text-zinc-200 dark:hover:bg-zinc-800
                transition-colors duration-100
                focus-visible:outline-black dark:focus-visible:outline-white cursor-pointer
              "
            >
              <MoreHorizontal size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
