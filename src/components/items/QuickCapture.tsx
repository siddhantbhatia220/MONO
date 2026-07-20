'use client'

/**
 * MONO — Quick Capture Bar
 * Native-like bottom input for instant item creation.
 * Supports #tag, !priority, and @date inline syntax.
 */

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Hash, AlertCircle, Calendar, CornerDownLeft } from 'lucide-react'
import { createItem } from '@/lib/db/items'
import { useAppStore } from '@/lib/store/appStore'
import { useItemStore } from '@/lib/store/itemStore'
import { useUIStore } from '@/lib/store/uiStore'
import { Priority, ItemType } from '@/lib/types/item'
import { useIsMobile } from '@/lib/hooks/useIsMobile'

const PRIORITY_MAP: Record<string, Priority> = {
  '!low': Priority.Low,
  '!med': Priority.Medium,
  '!medium': Priority.Medium,
  '!high': Priority.High,
  '!critical': Priority.Critical,
  '!!': Priority.Critical,
  '!': Priority.High,
}

function parseQuickInput(raw: string): {
  title: string
  tags: string[]
  priority: Priority
} {
  let title = raw
  const tags: string[] = []
  let priority: Priority = Priority.None

  // Extract tags (#tag)
  const tagMatches = raw.match(/#(\w+)/g)
  if (tagMatches) {
    tagMatches.forEach((t) => {
      tags.push(t.slice(1))
      title = title.replace(t, '').trim()
    })
  }

  // Extract priority (!high, !, !!, etc.)
  for (const [key, val] of Object.entries(PRIORITY_MAP)) {
    if (title.toLowerCase().includes(key)) {
      priority = val
      title = title.replace(new RegExp(key, 'gi'), '').trim()
      break
    }
  }

  return { title: title.trim(), tags, priority }
}

export function QuickCapture() {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { activeWorkspace, activeProject } = useAppStore()
  const { upsertItem } = useItemStore()
  const { addToast } = useUIStore()

  // Listen for the new-item event from command palette
  useEffect(() => {
    const handler = () => inputRef.current?.focus()
    document.addEventListener('mono:new-item', handler)
    return () => document.removeEventListener('mono:new-item', handler)
  }, [])

  // Global 'N' shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === 'n' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || !activeWorkspace || isSubmitting) return

    setIsSubmitting(true)
    const { title, tags, priority } = parseQuickInput(value)

    if (!title) {
      setIsSubmitting(false)
      return
    }

    try {
      const item = await createItem({
        title,
        tags,
        priority,
        type: ItemType.Task,
        workspaceId: activeWorkspace.id,
        projectId: activeProject?.id,
      })
      upsertItem(item)
      setValue('')
      addToast({ message: 'Item created', type: 'success', duration: 2000 })
    } catch {
      addToast({ message: 'Failed to create item', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const { tags, priority } = parseQuickInput(value)
  const hasTags = tags.length > 0
  const hasPriority = priority !== Priority.None
  const isMobile = useIsMobile()

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <div
        className={`
          flex items-center gap-3
          rounded-xl px-3.5 py-3
          bg-zinc-100 dark:bg-zinc-900
          border transition-all duration-150
          ${focused
            ? 'border-zinc-400 dark:border-zinc-500 ring-2 ring-zinc-300/50 dark:ring-zinc-600/30'
            : 'border-zinc-200 dark:border-zinc-800'
          }
        `}
      >
        {/* Plus icon */}
        <motion.div
          animate={{ rotate: focused ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex-shrink-0"
        >
          <Plus
            size={16}
            className={`transition-colors duration-150 ${
              focused ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400 dark:text-zinc-600'
            }`}
            aria-hidden="true"
          />
        </motion.div>

        <input
          ref={inputRef}
          id="quick-capture-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={isMobile ? 'New task...' : 'New task...  #tag  !priority'}
          className="
            flex-1 bg-transparent text-[14px] text-zinc-900 dark:text-zinc-100
            placeholder:text-zinc-400 dark:placeholder:text-zinc-600
            outline-none min-w-0 font-medium
          "
          aria-label="Quick capture — press Enter to create"
        />

        {/* Inline tags preview */}
        <AnimatePresence>
          {hasTags && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 flex-shrink-0"
            >
              {tags.slice(0, isMobile ? 1 : 2).map((tag) => (
                <span
                  key={tag}
                  className="
                    flex items-center gap-0.5 px-2 py-0.5
                    text-[11px] font-semibold text-zinc-500 dark:text-zinc-400
                    bg-zinc-200 dark:bg-zinc-800 rounded-md
                  "
                >
                  <Hash size={9} />
                  {tag}
                </span>
              ))}
              {isMobile && tags.length > 1 && (
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold">
                  +{tags.length - 1}
                </span>
              )}
            </motion.div>
          )}

          {hasPriority && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex-shrink-0"
            >
              <AlertCircle size={14} className="text-zinc-500 dark:text-zinc-400" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enter hint */}
        <AnimatePresence>
          {focused && !isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 flex-shrink-0"
            >
              <kbd className="
                inline-flex items-center gap-0.5 px-1.5 py-0.5
                text-[10px] font-medium text-zinc-400 dark:text-zinc-500
                bg-zinc-200/70 dark:bg-zinc-800 rounded
                border border-zinc-300/50 dark:border-zinc-700/50
              ">
                <CornerDownLeft size={9} />
              </kbd>
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" className="sr-only">Create item</button>
      </div>

      {/* Syntax hints — only on desktop when focused */}
      <AnimatePresence>
        {focused && !isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="flex items-center gap-4 px-1"
          >
            {[
              { icon: <Hash size={10} />, text: '#tag' },
              { icon: <AlertCircle size={10} />, text: '!priority' },
              { icon: <Calendar size={10} />, text: '@date' },
            ].map((hint) => (
              <span
                key={hint.text}
                className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 dark:text-zinc-600"
              >
                {hint.icon} {hint.text}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
