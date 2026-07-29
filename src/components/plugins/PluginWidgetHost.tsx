'use client'

/**
 * MONO — Plugin Widget Host Component
 *
 * Dynamically renders widget cards contributed by active plugins.
 */
import React from 'react'

import { Puzzle } from 'lucide-react'

interface PluginWidgetHostProps {
  pluginId: string
  title: string
  children?: React.ReactNode
}

export function PluginWidgetHost({ pluginId, title, children }: PluginWidgetHostProps) {
  return (
    <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 my-2">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="flex items-center space-x-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200">
          <Puzzle className="w-3.5 h-3.5 text-neutral-500" />
          <span>{title}</span>
        </div>
        <span className="text-[10px] text-neutral-400 font-mono">{pluginId}</span>
      </div>

      <div className="text-xs text-neutral-600 dark:text-neutral-400">
        {children || (
          <div className="py-2 text-center text-neutral-400 text-[11px] italic">Widget active</div>
        )}
      </div>
    </div>
  )
}
