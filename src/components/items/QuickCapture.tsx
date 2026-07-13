'use client'

/**
 * MONO — Quick Capture Bar
 * Always-visible bottom input for instant item creation.
 * Supports #tag, !priority, and @date inline syntax.
 */

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Hash, AlertCircle, Calendar } from 'lucide-react'
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
    <div className="px-4 pb-4 pt-2">
      <motion.form
        onSubmit={handleSubmit}
        animate={{
          boxShadow: focused
            ? '0 0 0 2px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)'
            : '0 1px 3px rgba(0,0,0,0.06)',
        }}
        transition={{ duration: 0.2 }}
        className="
          flex items-center gap-2 md:gap-3
          bg-white dark:bg-[#222]
          border border-[#efefef] dark:border-[#333]
          rounded-xl px-3 md:px-4 py-2.5 md:py-3
        "
      >
        {/* Plus icon */}
        <motion.div
          animate={{ rotate: focused ? 45 : 0, opacity: focused ? 1 : 0.4 }}
          transition={{ duration: 0.15 }}
        >
          <Plus size={16} className="text-[#777] dark:text-[#666] flex-shrink-0" aria-hidden="true" />
        </motion.div>

        <input
          ref={inputRef}
          id="quick-capture-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={isMobile ? "Add item..." : "Add an item... #tag !priority"}
          className="
            flex-1 bg-transparent text-sm text-[#222] dark:text-[#efefef]
            placeholder:text-[#cccccc] dark:placeholder:text-[#555]
            outline-none min-w-0
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
              className="flex items-center gap-1 flex-shrink-0"
            >
              {tags.slice(0, isMobile ? 1 : 2).map((tag) => (
                <span
                  key={tag}
                  className="
                    flex items-center gap-0.5 px-1.5 py-0.5
                    text-[10px] font-medium text-[#777] dark:text-[#666]
                    bg-[#f8f8f8] dark:bg-[#333] rounded
                  "
                >
                  <Hash size={8} />
                  {tag}
                </span>
              ))}
              {isMobile && tags.length > 1 && (
                <span className="text-[10px] text-[#cccccc] font-medium">+{tags.length - 1}</span>
              )}
            </motion.div>
          )}

          {hasPriority && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <AlertCircle size={14} className="text-[#777] dark:text-[#555] flex-shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint */}
        <AnimatePresence>
          {focused && !value && !isMobile && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-[#cccccc] dark:text-[#555] flex-shrink-0 font-mono"
            >
              ↵ create
            </motion.span>
          )}
        </AnimatePresence>

        <button type="submit" className="sr-only">Create item</button>
      </motion.form>

      {/* Syntax hints */}
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 px-1 pt-2 overflow-hidden flex-wrap"
          >
            {[
              { icon: <Hash size={10} />, text: '#tag' },
              { icon: <AlertCircle size={10} />, text: '!priority' },
              { icon: <Calendar size={10} />, text: '@date (soon)' },
            ].map((hint) => (
              <span
                key={hint.text}
                className="flex items-center gap-1 text-[10px] text-[#cccccc] dark:text-[#555]"
              >
                {hint.icon} {hint.text}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
