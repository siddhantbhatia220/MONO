'use client'

/**
 * MONO — Smart Suggestions Micro-Widget
 *
 * Real-time on-device suggestion pill that offers intelligent auto-categorization
 * suggestions based on user input.
 */
import React, { useMemo } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Sparkles, Tag } from 'lucide-react'

import { classifyInput } from '@/lib/intelligence/autoCategorizer'

interface SmartSuggestionsWidgetProps {
  input: string
  onApplyTag?: (tag: string) => void
  onApplyPriority?: (priority: string) => void
}

export function SmartSuggestionsWidget({
  input,
  onApplyTag,
  onApplyPriority,
}: SmartSuggestionsWidgetProps) {
  const result = useMemo(() => {
    if (!input || input.trim().length < 3) return null
    return classifyInput(input)
  }, [input])

  if (!result || result.confidence < 0.5) return null
  if (result.suggestedTags.length === 0 && !result.suggestedPriority) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        className="flex items-center space-x-2 py-1.5 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 mt-2"
      >
        <Sparkles className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100 flex-shrink-0" />
        <span className="font-medium text-[11px]">Suggested:</span>

        {result.suggestedTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onApplyTag?.(tag)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white transition-colors cursor-pointer text-[11px]"
          >
            <Tag className="w-3 h-3 text-neutral-400" />
            <span>#{tag}</span>
          </button>
        ))}

        {result.suggestedPriority && (
          <button
            type="button"
            onClick={() => onApplyPriority?.(result.suggestedPriority!)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white transition-colors cursor-pointer text-[11px] font-mono capitalize"
          >
            <AlertCircle className="w-3 h-3 text-neutral-400" />
            <span>!{result.suggestedPriority}</span>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
