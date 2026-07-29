'use client'

/**
 * MONO — Checklist Manager Component
 *
 * Dedicated sub-item checklist widget with completion progress bar,
 * inline sub-item addition, check toggle, and item deletion.
 */
import React, { useState } from 'react'

import { Plus, Trash2 } from 'lucide-react'

import { SubItem } from '@/lib/types/item'

import { Checkbox } from '@/components/ui/Checkbox'

interface ChecklistManagerProps {
  subItems: SubItem[]
  onAddSubItem: (title: string) => Promise<void>
  onToggleSubItem: (id: string, checked: boolean) => Promise<void>
  onDeleteSubItem: (id: string) => Promise<void>
}

export function ChecklistManager({
  subItems,
  onAddSubItem,
  onToggleSubItem,
  onDeleteSubItem,
}: ChecklistManagerProps) {
  const [newTitle, setNewTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const completedCount = subItems.filter((s) => s.completed).length
  const totalCount = subItems.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setLoading(true)
    try {
      await onAddSubItem(newTitle.trim())
      setNewTitle('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 p-3.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30">
      {/* Header & Progress Indicator */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          Checklist ({completedCount}/{totalCount})
        </h4>
        {totalCount > 0 && (
          <span className="text-xs font-semibold text-zinc-500 tabular-nums">
            {progressPercent}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Sub-Items List */}
      <div className="flex flex-col gap-1.5 mt-1">
        {subItems.map((subItem) => (
          <div
            key={subItem.id}
            className="group flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Checkbox
                checked={subItem.completed}
                onChange={(checked) => onToggleSubItem(subItem.id, checked)}
                aria-label={`Mark "${subItem.title}" as completed`}
              />
              <span
                className={`text-xs md:text-sm truncate ${
                  subItem.completed
                    ? 'line-through text-zinc-400 dark:text-zinc-600'
                    : 'text-zinc-800 dark:text-zinc-200'
                }`}
              >
                {subItem.title}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onDeleteSubItem(subItem.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all cursor-pointer"
              title="Delete sub-item"
              aria-label="Delete sub-item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Sub-Item Inline Form */}
      <form onSubmit={handleAdd} className="flex items-center gap-2 mt-1">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add sub-task... Press Enter"
          disabled={loading}
          className="
            flex-1 px-3 py-1.5 text-xs
            bg-white dark:bg-zinc-900
            border border-zinc-200 dark:border-zinc-800
            rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400
            focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-600
          "
        />
        <button
          type="submit"
          disabled={!newTitle.trim() || loading}
          className="
            px-2.5 py-1.5 text-xs font-medium
            bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900
            disabled:opacity-40 rounded-lg transition-opacity cursor-pointer
          "
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  )
}
