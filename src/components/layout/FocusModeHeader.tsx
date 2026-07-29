'use client'

/**
 * MONO — Focus Mode Zen Header
 *
 * Minimalist top banner displayed when distraction-free Focus Mode is active.
 */
import React from 'react'
import { Minimize2, Sparkles } from 'lucide-react'
import { useUIStore } from '@/lib/store/uiStore'

export function FocusModeHeader() {
  const { focusMode, toggleFocusMode } = useUIStore()

  if (!focusMode) return null

  return (
    <div className="flex items-center justify-between px-6 py-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-b border-zinc-800 dark:border-zinc-200">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Zen Focus Mode</span>
      </div>

      <button
        type="button"
        onClick={toggleFocusMode}
        className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-zinc-800 dark:bg-zinc-100 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
        aria-label="Exit Focus Mode"
      >
        <Minimize2 className="w-3.5 h-3.5" />
        <span>Exit Focus Mode</span>
      </button>
    </div>
  )
}
