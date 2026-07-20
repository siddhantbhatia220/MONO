'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Plus, Check } from 'lucide-react'
import { useAppStore } from '@/lib/store/appStore'
import { useUIStore } from '@/lib/store/uiStore'
import { listWorkspaces } from '@/lib/db/workspaces'
import type { Workspace } from '@/lib/types/workspace'

interface WorkspaceSwitcherProps {
  align?: 'left' | 'right'
  collapsed?: boolean
}

export function WorkspaceSwitcher({ align = 'left', collapsed = false }: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const { activeWorkspace, setActiveWorkspace } = useAppStore()
  const { openModal } = useUIStore()

  // Load workspaces on mount or when popover opens or when modal closes
  const loadList = async () => {
    try {
      const list = await listWorkspaces()
      setWorkspaces(list)
    } catch (err) {
      console.error('Failed to load workspaces', err)
    }
  }

  useEffect(() => {
    void loadList() // eslint-disable-line react-hooks/set-state-in-effect
  }, [activeWorkspace])

  // Also listen for workspace changes in DB
  useEffect(() => {
    if (isOpen) {
      void loadList() // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [isOpen])

  const handleSwitch = (workspace: Workspace) => {
    setActiveWorkspace(workspace)
    setIsOpen(false)
  }

  const handleCreateNew = () => {
    setIsOpen(false)
    openModal('create-workspace')
  }

  if (!activeWorkspace) return null

  return (
    <div className="relative inline-block text-left">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 rounded-lg
          hover:bg-zinc-105 dark:hover:bg-zinc-800/50
          transition-colors duration-100 cursor-pointer text-left
          ${collapsed ? 'p-1.5 justify-center' : 'px-2 py-1.5'}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Switch workspace"
      >
        <span className="text-base flex-shrink-0" aria-hidden="true">
          {activeWorkspace.icon}
        </span>
        {!collapsed && (
          <>
            <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 max-w-[120px] md:max-w-[180px] truncate">
              {activeWorkspace.name}
            </span>
            <ChevronDown size={14} className={`text-zinc-400 dark:text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click-outside backdrop */}
            <div
              className="fixed inset-0 z-[190] bg-transparent"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 4 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={`
                absolute z-[200] mt-1.5 w-60 rounded-xl
                bg-white dark:bg-zinc-950
                border border-zinc-200/80 dark:border-zinc-800/80
                shadow-lg dark:shadow-black/40 overflow-hidden py-1.5
                ${align === 'right' ? 'right-0' : 'left-0'}
              `}
              role="listbox"
              aria-label="Workspaces"
            >
              <div className="px-3.5 py-1 mb-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
                  Workspaces
                </span>
              </div>

              {/* Workspace list */}
              <div className="max-h-60 overflow-y-auto flex flex-col gap-0.5">
                {workspaces.map((w) => {
                  const isActive = w.id === activeWorkspace.id
                  return (
                    <button
                      key={w.id}
                      onClick={() => handleSwitch(w)}
                      role="option"
                      aria-selected={isActive}
                      className={`
                        w-full flex items-center justify-between px-3.5 py-2 text-left
                        text-xs font-medium cursor-pointer transition-colors duration-75
                        ${isActive
                          ? 'bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
                          : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-450 dark:hover:bg-zinc-900/50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-sm flex-shrink-0" aria-hidden="true">
                          {w.icon}
                        </span>
                        <span className="truncate">{w.name}</span>
                      </div>
                      {isActive && (
                        <Check size={14} className="text-zinc-900 dark:text-zinc-150 flex-shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="h-px bg-zinc-100 dark:bg-zinc-800/50 my-1.5" aria-hidden="true" />

              {/* Add workspace button */}
              <button
                onClick={handleCreateNew}
                className="
                  w-full flex items-center gap-2.5 px-3.5 py-2 text-left
                  text-xs font-semibold text-zinc-850 dark:text-zinc-200
                  hover:bg-zinc-50 dark:hover:bg-zinc-900/50
                  transition-colors duration-75 cursor-pointer
                "
              >
                <Plus size={14} className="text-zinc-500 dark:text-zinc-400" />
                <span>Create Workspace...</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
