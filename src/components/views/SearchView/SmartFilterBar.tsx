'use client'

/**
 * MONO — Smart Filter Bar Component
 *
 * Provides real-time query text search, priority filtering,
 * and status filtering controls across active workspace items.
 */
import React from 'react'

import { Bookmark, FilterX, Search } from 'lucide-react'

import { useAppStore } from '@/lib/store/appStore'
import { ItemStatus, Priority } from '@/lib/types/item'

export function SmartFilterBar() {
  const { activeFilterCriteria, setActiveFilterCriteria, resetFilterCriteria, addSavedFilter } =
    useAppStore()

  const handleSaveFilter = () => {
    const name = prompt('Enter a name for this saved filter (e.g. Urgent Work):')
    if (name && name.trim()) {
      addSavedFilter(name.trim(), activeFilterCriteria)
    }
  }

  const isFiltered =
    activeFilterCriteria.searchQuery.trim() !== '' ||
    activeFilterCriteria.priority !== 'all' ||
    activeFilterCriteria.status !== 'all' ||
    activeFilterCriteria.pinnedOnly

  return (
    <div className="flex items-center gap-2 md:gap-2.5 px-3 md:px-6 py-2.5 md:py-3 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 overflow-x-auto no-scrollbar flex-nowrap md:flex-wrap">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={activeFilterCriteria.searchQuery}
          onChange={(e) => setActiveFilterCriteria({ searchQuery: e.target.value })}
          placeholder="Filter or search items..."
          className="
            w-full pl-9 pr-3 py-1.5 text-xs font-medium
            bg-white dark:bg-zinc-900
            border border-zinc-200 dark:border-zinc-800
            rounded-lg shadow-xs
            focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-600
            text-zinc-900 dark:text-zinc-100 placeholder-zinc-400
          "
        />
      </div>

      {/* Status Filter */}
      <select
        value={activeFilterCriteria.status}
        onChange={(e) => setActiveFilterCriteria({ status: e.target.value as ItemStatus | 'all' })}
        className="
          px-2.5 py-1.5 text-xs font-medium
          bg-white dark:bg-zinc-900
          border border-zinc-200 dark:border-zinc-800
          rounded-lg text-zinc-700 dark:text-zinc-300
          focus:outline-hidden cursor-pointer
        "
      >
        <option value="all">All Statuses</option>
        <option value={ItemStatus.Active}>Active</option>
        <option value={ItemStatus.InProgress}>In Progress</option>
        <option value={ItemStatus.Completed}>Completed</option>
      </select>

      {/* Priority Filter */}
      <select
        value={activeFilterCriteria.priority}
        onChange={(e) => setActiveFilterCriteria({ priority: e.target.value as Priority | 'all' })}
        className="
          px-2.5 py-1.5 text-xs font-medium
          bg-white dark:bg-zinc-900
          border border-zinc-200 dark:border-zinc-800
          rounded-lg text-zinc-700 dark:text-zinc-300
          focus:outline-hidden cursor-pointer
        "
      >
        <option value="all">All Priorities</option>
        <option value={Priority.Critical}>Critical</option>
        <option value={Priority.High}>High</option>
        <option value={Priority.Medium}>Medium</option>
        <option value={Priority.Low}>Low</option>
      </select>

      {/* Save & Reset Filter Buttons */}
      {isFiltered && (
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={handleSaveFilter}
            className="
              flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium
              text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-800
              hover:bg-zinc-300 dark:hover:bg-zinc-700
              rounded-lg transition-colors cursor-pointer font-semibold
            "
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save Filter</span>
          </button>

          <button
            type="button"
            onClick={resetFilterCriteria}
            className="
              flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium
              text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100
              bg-zinc-200/60 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-800
              rounded-lg transition-colors cursor-pointer
            "
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      )}
    </div>
  )
}
