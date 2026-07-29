'use client'

/**
 * MONO — View Header Switcher Component
 *
 * Segmented control in the application toolbar for toggling between
 * List, Board (Kanban), and Calendar views.
 */
import React from 'react'
import { Calendar, LayoutGrid, List } from 'lucide-react'
import { ViewMode } from '@/lib/types/view'
import { useAppStore } from '@/lib/store/appStore'

const VIEW_OPTIONS = [
  { id: ViewMode.List, label: 'List', icon: List },
  { id: ViewMode.Board, label: 'Board', icon: LayoutGrid },
  { id: ViewMode.Calendar, label: 'Calendar', icon: Calendar },
]

export function ViewHeaderSwitcher() {
  const { activeViewMode, setActiveViewMode } = useAppStore()

  return (
    <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800">
      {VIEW_OPTIONS.map((opt) => {
        const Icon = opt.icon
        const isActive = activeViewMode === opt.id

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setActiveViewMode(opt.id)}
            className={`
              flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md
              transition-all duration-150 cursor-pointer select-none
              ${
                isActive
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }
            `}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
