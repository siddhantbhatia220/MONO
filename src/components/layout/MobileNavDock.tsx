'use client'

/**
 * MONO — Mobile Navigation Dock
 *
 * Fixed bottom navigation bar visible on mobile viewports (< md breakpoint).
 * Provides one-tap access to primary views, universal search, and quick capture.
 * Features touch targets (min 44px), spring animated active tab indicators,
 * and safe-area inset support for mobile screens.
 */
import React from 'react'

import { motion } from 'framer-motion'
import { Calendar, GanttChart, LayoutGrid, List, Plus, Search } from 'lucide-react'

import { useAppStore } from '@/lib/store/appStore'
import { useUIStore } from '@/lib/store/uiStore'
import { ViewMode } from '@/lib/types/view'

export function MobileNavDock() {
  const { activeViewMode, setActiveViewMode } = useAppStore()
  const { openCommandPalette } = useUIStore()

  const tabs = [
    { id: ViewMode.List, label: 'List', icon: List },
    { id: ViewMode.Board, label: 'Board', icon: LayoutGrid },
    { id: ViewMode.Calendar, label: 'Calendar', icon: Calendar },
    { id: ViewMode.Timeline, label: 'Timeline', icon: GanttChart },
  ]

  const handleQuickAddFocus = () => {
    const input = document.getElementById('quick-capture-input')
    if (input) {
      input.focus()
    }
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[200] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-2 bg-white/90 dark:bg-[#0c0c0e]/90 backdrop-blur-xl border-t border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* View Tabs */}
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeViewMode === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveViewMode(tab.id)}
              className="relative flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-2 py-1 rounded-xl transition-colors cursor-pointer select-none"
              aria-label={`Switch to ${tab.label} view`}
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active-pill"
                  className="absolute inset-0 bg-zinc-100 dark:bg-zinc-850 rounded-xl -z-10"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-400 dark:text-zinc-500'
                }`}
              />
              <span
                className={`text-[10px] font-semibold mt-0.5 transition-colors ${
                  isActive ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-400 dark:text-zinc-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}

        {/* Divider */}
        <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 my-auto" />

        {/* Search Action */}
        <button
          type="button"
          onClick={() => openCommandPalette()}
          className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-2 py-1 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          aria-label="Open Search & Command Palette"
        >
          <Search className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 mt-0.5">
            Search
          </span>
        </button>

        {/* Quick Add Action */}
        <button
          type="button"
          onClick={handleQuickAddFocus}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-lg active:scale-95 transition-transform cursor-pointer"
          aria-label="Quick add new task"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  )
}
