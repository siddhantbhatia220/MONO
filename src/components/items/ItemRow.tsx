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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2, layout: { duration: 0.2 } }}
      className={`
        group relative flex items-start gap-2 py-1.5 px-2 rounded-lg
        cursor-pointer transition-colors duration-100
        ${isSelected
          ? 'bg-[#f8f8f8] dark:bg-[#2a2a2a]'
          : 'hover:bg-[#f8f8f8] dark:hover:bg-[#2a2a2a]'
        }
        ${isCompleted ? 'opacity-50' : ''}
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
          className="mt-0.5 text-[#bbbbbb] hover:text-[#444] dark:hover:text-white transition-colors flex-shrink-0"
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
      <div className="mt-0.5 flex-shrink-0">
        <Checkbox
          checked={isCompleted}
          onChange={handleToggle}
          size="sm"
          aria-label={`Mark "${item.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0" onClick={handleClick}>
        <div className="flex items-center gap-2 min-w-0">
          {/* Title */}
          <span
            className={`
              text-sm leading-snug flex-1 min-w-0
              ${isCompleted
                ? 'line-through text-[#bbbbbb] dark:text-[#555]'
                : 'text-[#222] dark:text-[#efefef]'
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
                  ? 'text-[#444] dark:text-[#bbbbbb] font-medium'
                  : 'text-[#999] dark:text-[#555]'
                }
              `}
            >
              <Calendar size={10} />
              {formatDueDate(item.dueDate)}
            </span>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-[#bbbbbb] dark:text-[#555] flex-shrink-0">
              <Tag size={10} />
              {item.tags.slice(0, 2).join(', ')}
              {item.tags.length > 2 && ` +${item.tags.length - 2}`}
            </span>
          )}
        </div>

        {/* Notes preview */}
        {item.notes && !isCompleted && (
          <p className="text-xs text-[#bbbbbb] dark:text-[#555] mt-0.5 truncate">
            {item.notes}
          </p>
        )}
      </div>

      {/* Hover actions */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="flex items-center gap-0.5 flex-shrink-0"
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              aria-label={`Delete "${item.title}"`}
              className="
                p-1.5 rounded-md text-[#cccccc] dark:text-[#555]
                hover:text-[#444] hover:bg-[#efefef]
                dark:hover:text-[#efefef] dark:hover:bg-[#333]
                transition-colors duration-100
              "
            >
              <Trash2 size={13} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClick()
              }}
              aria-label={`Open "${item.title}"`}
              className="
                p-1.5 rounded-md text-[#cccccc] dark:text-[#555]
                hover:text-[#444] hover:bg-[#efefef]
                dark:hover:text-[#efefef] dark:hover:bg-[#333]
                transition-colors duration-100
              "
            >
              <MoreHorizontal size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
