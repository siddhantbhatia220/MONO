'use client'

/**
 * MONO — Command Palette
 * Universal search and action launcher. Opens with Ctrl+K / Cmd+K.
 * The single most important interaction surface in the application.
 */

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CornerDownLeft } from 'lucide-react'
import { useUIStore } from '@/lib/store/uiStore'

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
        // Trigger quick capture via keyboard event
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
  const { commandPaletteOpen, commandPaletteQuery, closeCommandPalette, setCommandPaletteQuery } =
    useUIStore()

  const [selectedIndex, setSelectedIndex] = useState(0)
  // Sync selectedIndex to 0 when query changes — this is the React-recommended pattern
  // for derived state resets without an effect (ref tracks previous value)
  const prevQueryRef = useRef(commandPaletteQuery)
  // eslint-disable-next-line react-hooks/refs
  if (prevQueryRef.current !== commandPaletteQuery) {
    // eslint-disable-next-line react-hooks/refs
    prevQueryRef.current = commandPaletteQuery
    if (selectedIndex !== 0) setSelectedIndex(0)
  }
  const inputRef = useRef<HTMLInputElement>(null)
  const allCommands = useCommandItems()

  const filtered = commandPaletteQuery
    ? allCommands.filter((cmd) => {
        const q = commandPaletteQuery.toLowerCase()
        return (
          cmd.label.toLowerCase().includes(q) ||
          cmd.description?.toLowerCase().includes(q) ||
          cmd.keywords?.some((k) => k.toLowerCase().includes(q))
        )
      })
    : allCommands

  // Group by category
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  // Flat list for keyboard nav — ref updated during render is the recommended React pattern
  // for values that need to be stable in effects without being deps
  const flatList = Object.values(grouped).flat()
  const flatListRef = useRef(flatList)
  // eslint-disable-next-line react-hooks/refs
  flatListRef.current = flatList

  useEffect(() => {
    if (commandPaletteOpen) {
      requestAnimationFrame(() => inputRef.current?.focus())
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

  let flatIndex = 0

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div
          className="fixed inset-0 z-[500] flex items-start justify-center pt-[15vh] px-4"
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
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="
              relative z-10 w-full max-w-xl
              bg-white dark:bg-[#1a1a1a]
              border border-[#efefef] dark:border-[#333]
              rounded-2xl shadow-2xl overflow-hidden
            "
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#efefef] dark:border-[#333]">
              <Search size={16} className="text-[#999] dark:text-[#555] flex-shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search or type a command..."
                value={commandPaletteQuery}
                onChange={(e) => setCommandPaletteQuery(e.target.value)}
                className="
                  flex-1 bg-transparent text-[#111] dark:text-white
                  text-sm font-normal placeholder:text-[#bbbbbb] dark:placeholder:text-[#555]
                  outline-none
                "
                aria-autocomplete="list"
                aria-controls="command-list"
              />
              <kbd className="
                px-1.5 py-0.5 text-[10px] font-mono
                bg-[#f8f8f8] dark:bg-[#333]
                text-[#999] dark:text-[#666]
                border border-[#efefef] dark:border-[#444]
                rounded
              ">
                esc
              </kbd>
            </div>

            {/* Results */}
            <div
              id="command-list"
              role="listbox"
              className="max-h-80 overflow-y-auto py-2"
            >
              {Object.entries(grouped).length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-[#bbbbbb] dark:text-[#555]">No results for &ldquo;{commandPaletteQuery}&rdquo;</p>
                </div>
              ) : (
                Object.entries(grouped).map(([category, items]) => (
                  <div key={category} className="mb-1">
                    <div className="px-4 py-1">
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-[#bbbbbb] dark:text-[#555]">
                        {category}
                      </span>
                    </div>

                    {items.map((item) => {
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
                            transition-colors duration-75
                            ${isSelected
                              ? 'bg-[#f8f8f8] dark:bg-[#2a2a2a]'
                              : 'hover:bg-[#f8f8f8] dark:hover:bg-[#2a2a2a]'
                            }
                          `}
                        >
                          {item.icon && (
                            <span className="text-[#999] dark:text-[#555] w-4 text-center flex-shrink-0">
                              {item.icon}
                            </span>
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#222] dark:text-[#efefef] truncate">
                              {highlightMatch(item.label, commandPaletteQuery)}
                            </p>
                            {item.description && (
                              <p className="text-xs text-[#999] dark:text-[#555] truncate">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {item.shortcut && (
                            <kbd className="
                              px-1.5 py-0.5 text-[10px] font-mono flex-shrink-0
                              bg-[#efefef] dark:bg-[#333]
                              text-[#777] dark:text-[#666]
                              border border-[#dddddd] dark:border-[#444]
                              rounded
                            ">
                              {item.shortcut}
                            </kbd>
                          )}

                          {isSelected && (
                            <CornerDownLeft size={12} className="text-[#bbbbbb] dark:text-[#555] flex-shrink-0" />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 border-t border-[#efefef] dark:border-[#333] flex items-center gap-4">
              <span className="flex items-center gap-1 text-[10px] text-[#bbbbbb] dark:text-[#555]">
                <kbd className="font-mono">↑↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1 text-[10px] text-[#bbbbbb] dark:text-[#555]">
                <kbd className="font-mono">↵</kbd> select
              </span>
              <span className="flex items-center gap-1 text-[10px] text-[#bbbbbb] dark:text-[#555]">
                <kbd className="font-mono">esc</kbd> close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
