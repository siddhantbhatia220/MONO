'use client'

/**
 * MONO — Command Palette
 * Universal search and action launcher. Opens with Ctrl+K / Cmd+K.
 * Searches both commands AND items from IndexedDB in real-time.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CornerDownLeft, CheckCircle2, Circle } from 'lucide-react'
import { useUIStore } from '@/lib/store/uiStore'
import { useItemStore } from '@/lib/store/itemStore'
import { useIsMobile } from '@/lib/hooks/useIsMobile'
import { searchItems } from '@/lib/db/items'
import { useAppStore } from '@/lib/store/appStore'
import type { Item } from '@/lib/types/item'
import { ItemStatus } from '@/lib/types/item'

interface CommandItem {
  id: string
  label: string
  description?: string
  category: string
  shortcut?: string
  icon?: React.ReactNode
  action: () => void
  keywords?: string[]
}

function useCommandItems(): CommandItem[] {
  const { openModal, closeCommandPalette } = useUIStore()

  return [
    {
      id: 'new-item',
      label: 'New Item',
      description: 'Create a task, note, or goal',
      category: 'Create',
      shortcut: 'N',
      icon: <span className="text-base">+</span>,
      action: () => {
        closeCommandPalette()
        document.dispatchEvent(new CustomEvent('mono:new-item'))
      },
      keywords: ['add', 'create', 'task', 'note', 'new'],
    },
    {
      id: 'new-workspace',
      label: 'New Workspace',
      description: 'Create a new workspace',
      category: 'Create',
      icon: <span className="text-base">◻</span>,
      action: () => {
        closeCommandPalette()
        openModal('create-workspace')
      },
      keywords: ['workspace', 'create', 'new'],
    },
    {
      id: 'new-project',
      label: 'New Project',
      description: 'Create a project in current workspace',
      category: 'Create',
      icon: <span className="text-base">▦</span>,
      action: () => {
        closeCommandPalette()
        openModal('create-project')
      },
      keywords: ['project', 'folder', 'create'],
    },
    {
      id: 'toggle-sidebar',
      label: 'Toggle Sidebar',
      description: 'Show or hide the sidebar',
      category: 'View',
      shortcut: 'Ctrl+B',
      action: () => {
        closeCommandPalette()
        useUIStore.getState().toggleSidebar()
      },
      keywords: ['sidebar', 'panel', 'hide', 'show'],
    },
    {
      id: 'settings',
      label: 'Open Settings',
      description: 'Preferences and customization',
      category: 'Navigation',
      shortcut: ',',
      action: () => {
        closeCommandPalette()
        openModal('settings')
      },
      keywords: ['settings', 'preferences', 'options'],
    },
    {
      id: 'shortcuts',
      label: 'Keyboard Shortcuts',
      description: 'View all keyboard shortcuts',
      category: 'Navigation',
      shortcut: '?',
      action: () => {
        closeCommandPalette()
        openModal('keyboard-shortcuts')
      },
      keywords: ['keyboard', 'shortcuts', 'help'],
    },
  ]
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text

  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-black dark:text-white">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  )
}

export function CommandPalette() {
  const { commandPaletteOpen, commandPaletteQuery, closeCommandPalette, setCommandPaletteQuery, openItemDetail } =
    useUIStore()
  const { activeWorkspace } = useAppStore()

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [itemResults, setItemResults] = useState<Item[]>([])
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync selectedIndex to 0 when query changes
  const prevQueryRef = useRef(commandPaletteQuery)
  if (prevQueryRef.current !== commandPaletteQuery) {
    prevQueryRef.current = commandPaletteQuery
    if (selectedIndex !== 0) setSelectedIndex(0)
  }
  const inputRef = useRef<HTMLInputElement>(null)
  const allCommands = useCommandItems()

  // Search items from IndexedDB when query changes
  const doSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setItemResults([])
      return
    }
    try {
      const results = await searchItems(query, activeWorkspace?.id)
      setItemResults(results.slice(0, 8))
    } catch {
      setItemResults([])
    }
  }, [activeWorkspace?.id])

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => {
      void doSearch(commandPaletteQuery)
    }, 100)
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    }
  }, [commandPaletteQuery, doSearch])

  // Filter commands
  const filteredCommands = commandPaletteQuery
    ? allCommands.filter((cmd) => {
        const q = commandPaletteQuery.toLowerCase()
        return (
          cmd.label.toLowerCase().includes(q) ||
          cmd.description?.toLowerCase().includes(q) ||
          cmd.keywords?.some((k) => k.toLowerCase().includes(q))
        )
      })
    : allCommands

  // Convert item results to CommandItem format
  const itemCommands: CommandItem[] = itemResults.map((item) => ({
    id: `item-${item.id}`,
    label: item.title,
    description: item.tags.length > 0 ? item.tags.map(t => `#${t}`).join(' ') : undefined,
    category: 'Items',
    icon: item.status === ItemStatus.Completed
      ? <CheckCircle2 size={14} className="text-zinc-400" />
      : <Circle size={14} className="text-zinc-400" />,
    action: () => {
      closeCommandPalette()
      openItemDetail(item.id)
    },
    keywords: [],
  }))

  // Combine: items first (when searching), then commands
  const allResults = commandPaletteQuery.trim()
    ? [...itemCommands, ...filteredCommands]
    : filteredCommands

  // Group by category
  const grouped = allResults.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  // Flat list for keyboard nav
  const flatList = Object.values(grouped).flat()
  const flatListRef = useRef(flatList)
  flatListRef.current = flatList

  useEffect(() => {
    if (commandPaletteOpen) {
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      setItemResults([])
    }
  }, [commandPaletteOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!commandPaletteOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, flatListRef.current.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        flatListRef.current[selectedIndex]?.action()
      } else if (e.key === 'Escape') {
        closeCommandPalette()
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [commandPaletteOpen, selectedIndex, closeCommandPalette])

  const isMobile = useIsMobile()
  let flatIndex = 0

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div
          key="command-palette-container"
          className="fixed inset-0 z-[500] flex items-start justify-center pt-0 px-0 md:pt-[15vh] md:px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closeCommandPalette}
            aria-hidden="true"
          />

          {/* Palette */}
          <motion.div
            initial={isMobile ? { y: '-100%' } : { opacity: 0, scale: 0.97, y: -8 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { y: '-100%' } : { opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="
              relative z-10 w-full max-w-xl h-dvh md:h-auto md:max-h-[450px] flex flex-col
              bg-white dark:bg-[#121214]
              border-b md:border border-zinc-200 dark:border-zinc-800
              rounded-none md:rounded-2xl shadow-2xl overflow-hidden
              pb-safe-bottom
            "
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800">
              <Search size={16} className="text-zinc-400 dark:text-zinc-600 flex-shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search items or type a command..."
                value={commandPaletteQuery}
                onChange={(e) => setCommandPaletteQuery(e.target.value)}
                className="
                  flex-1 bg-transparent text-zinc-800 dark:text-zinc-100
                  text-sm font-normal placeholder:text-zinc-400 dark:placeholder:text-zinc-600
                  outline-none
                "
                aria-autocomplete="list"
                aria-controls="command-list"
              />
              <kbd className="
                px-1.5 py-0.5 text-[10px] font-mono
                bg-zinc-50 dark:bg-zinc-900
                text-zinc-400 dark:text-zinc-500
                border border-zinc-200 dark:border-zinc-800
                rounded
              ">
                esc
              </kbd>
            </div>

            {/* Results */}
            <div
              id="command-list"
              role="listbox"
              className="max-h-[60vh] md:max-h-80 flex-1 overflow-y-auto py-2"
            >
              {Object.entries(grouped).length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-zinc-400 dark:text-zinc-600">No results for &ldquo;{commandPaletteQuery}&rdquo;</p>
                </div>
              ) : (
                Object.entries(grouped).map(([category, categoryItems]) => (
                  <div key={category} className="mb-1">
                    <div className="px-4 py-1">
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-600">
                        {category}
                      </span>
                    </div>

                    {categoryItems.map((item) => {
                      const currentIndex = flatIndex++
                      const isSelected = currentIndex === selectedIndex

                      return (
                        <motion.button
                          key={item.id}
                          role="option"
                          aria-selected={isSelected}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(currentIndex)}
                          whileTap={{ scale: 0.99 }}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2.5 text-left
                            transition-colors duration-75 cursor-pointer
                            ${isSelected
                              ? 'bg-zinc-100 dark:bg-zinc-900'
                              : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
                            }
                          `}
                        >
                          {item.icon && (
                            <span className="text-zinc-400 dark:text-zinc-600 w-4 text-center flex-shrink-0">
                              {item.icon}
                            </span>
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate">
                              {highlightMatch(item.label, commandPaletteQuery)}
                            </p>
                            {item.description && (
                              <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {item.shortcut && (
                            <kbd className="
                              px-1.5 py-0.5 text-[10px] font-mono flex-shrink-0
                              bg-zinc-100 dark:bg-zinc-900
                              text-zinc-500 dark:text-zinc-400
                              border border-zinc-200 dark:border-zinc-800
                              rounded
                            ">
                              {item.shortcut}
                            </kbd>
                          )}

                          {isSelected && (
                            <CornerDownLeft size={12} className="text-zinc-400 dark:text-zinc-600 flex-shrink-0" />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
              <span className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500">
                <kbd className="font-mono">↑↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500">
                <kbd className="font-mono">↵</kbd> select
              </span>
              <span className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500">
                <kbd className="font-mono">esc</kbd> close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
