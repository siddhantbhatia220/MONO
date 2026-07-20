'use client'

/**
 * MONO — Sidebar
 * Premium collapsible navigation with workspace nav, project list, and keyboard shortcuts.
 * Supports desktop collapsible sidebar and mobile overlay sliding drawer.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PanelLeft,
  Search,
  Inbox,
  Calendar,
  Star,
  Plus,
  Settings,
  Keyboard,
  X,
} from 'lucide-react'
import { useUIStore } from '@/lib/store/uiStore'
import { useAppStore } from '@/lib/store/appStore'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { useIsMobile } from '@/lib/hooks/useIsMobile'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'
import { listProjects } from '@/lib/db/workspaces'
import type { Project } from '@/lib/types/workspace'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  shortcut?: string
  action: () => void
}

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, openCommandPalette, openModal } = useUIStore()
  const { activeWorkspace, activeProject, setActiveProject } = useAppStore()
  const isMobile = useIsMobile()
  const [projects, setProjects] = useState<Project[]>([])

  const fetchProjects = useCallback(async () => {
    if (!activeWorkspace) {
      setProjects([])
      return
    }
    try {
      const list = await listProjects(activeWorkspace.id)
      setProjects(list)
    } catch (err) {
      console.error('Failed to load projects', err)
    }
  }, [activeWorkspace])

  useEffect(() => {
    void fetchProjects() // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchProjects])

  // Listen for custom event to refresh projects
  useEffect(() => {
    const handler = () => {
      fetchProjects()
    }
    document.addEventListener('mono:projects-updated', handler)
    return () => document.removeEventListener('mono:projects-updated', handler)
  }, [fetchProjects])

  const navItems: NavItem[] = [
    {
      id: 'search',
      label: 'Search',
      icon: <Search size={16} strokeWidth={1.8} />,
      shortcut: '/',
      action: () => {
        openCommandPalette()
        if (isMobile) toggleSidebar()
      },
    },
    {
      id: 'inbox',
      label: 'Inbox',
      icon: <Inbox size={16} strokeWidth={1.8} />,
      action: () => {
        setActiveProject(null)
        if (isMobile) toggleSidebar()
      },
    },
    {
      id: 'today',
      label: 'Today',
      icon: <Calendar size={16} strokeWidth={1.8} />,
      action: () => {
        if (isMobile) toggleSidebar()
      },
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Star size={16} strokeWidth={1.8} />,
      action: () => {
        if (isMobile) toggleSidebar()
      },
    },
  ]

  const sidebarWidth = sidebarOpen ? 260 : 56

  const navContent = (
    <>
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3" aria-label="Primary navigation">
        {/* Main nav items */}
        <div className="flex flex-col gap-0.5 mb-6">
          {navItems.map((item) => (
            <Tooltip
              key={item.id}
              content={item.label}
              shortcut={item.shortcut}
              position="right"
            >
              <button
                onClick={item.action}
                className={`
                  flex items-center gap-3 w-full rounded-lg text-left
                  text-[13px] font-medium cursor-pointer
                  text-zinc-600 dark:text-zinc-400
                  hover:bg-zinc-200/60 hover:text-zinc-900
                  dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100
                  active:bg-zinc-200 dark:active:bg-zinc-800
                  transition-colors duration-75
                  ${(!sidebarOpen && !isMobile) ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                `}
                aria-label={item.label}
              >
                <span className="flex-shrink-0 text-zinc-500 dark:text-zinc-500">{item.icon}</span>
                <AnimatePresence>
                  {(sidebarOpen || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </Tooltip>
          ))}
        </div>

        {/* Projects section */}
        {(sidebarOpen || isMobile) && activeWorkspace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 dark:text-zinc-600">
                Projects
              </span>
              <Tooltip content="New project" position="right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openModal('create-project')}
                  aria-label="Create new project"
                  className="h-5 w-5"
                >
                  <Plus size={12} />
                </Button>
              </Tooltip>
            </div>

            {projects.length === 0 ? (
              <p className="px-3 text-[12px] text-zinc-400 dark:text-zinc-650 py-2">
                No projects yet
              </p>
            ) : (
              <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto px-1">
                {projects.map((project) => {
                  const isActive = activeProject?.id === project.id
                  return (
                    <button
                      key={project.id}
                      onClick={() => {
                        setActiveProject(project)
                        if (isMobile) toggleSidebar()
                      }}
                      className={`
                        flex items-center gap-3 w-full rounded-lg text-left px-2.5 py-1.5
                        text-[12px] font-medium cursor-pointer transition-colors duration-75
                        ${isActive
                          ? 'bg-zinc-150/70 text-zinc-900 dark:bg-zinc-800/70 dark:text-zinc-100'
                          : 'text-zinc-550 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-450 dark:hover:bg-zinc-900/40 dark:hover:text-zinc-200'
                        }
                      `}
                      aria-label={project.name}
                    >
                      <span className="text-sm flex-shrink-0 text-zinc-400 dark:text-zinc-500">
                        {project.icon ?? '📂'}
                      </span>
                      <span className="truncate flex-1">{project.name}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col gap-0.5">
        <Tooltip content="Settings" shortcut="," position="right">
          <button
            onClick={() => openModal('settings')}
            className={`
              flex items-center gap-3 w-full rounded-lg text-left
              text-[13px] font-medium cursor-pointer
              text-zinc-500 dark:text-zinc-500
              hover:bg-zinc-200/60 hover:text-zinc-900
              dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100
              active:bg-zinc-200 dark:active:bg-zinc-800
              transition-colors duration-75
              ${(!sidebarOpen && !isMobile) ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
            `}
            aria-label="Settings"
          >
            <Settings size={16} strokeWidth={1.8} className="text-zinc-400 dark:text-zinc-600" />
            <AnimatePresence>
              {(sidebarOpen || isMobile) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </Tooltip>

        <Tooltip content="Keyboard shortcuts" shortcut="?" position="right">
          <button
            onClick={() => openModal('keyboard-shortcuts')}
            className={`
              flex items-center gap-3 w-full rounded-lg text-left
              text-[13px] font-medium cursor-pointer
              text-zinc-500 dark:text-zinc-500
              hover:bg-zinc-200/60 hover:text-zinc-900
              dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100
              active:bg-zinc-200 dark:active:bg-zinc-800
              transition-colors duration-75
              ${(!sidebarOpen && !isMobile) ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
            `}
            aria-label="Keyboard shortcuts"
          >
            <Keyboard size={16} strokeWidth={1.8} className="text-zinc-400 dark:text-zinc-600" />
            <AnimatePresence>
              {(sidebarOpen || isMobile) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  Shortcuts
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </Tooltip>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[390]"
              aria-hidden="true"
            />

            {/* Sliding Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="
                fixed top-0 left-0 bottom-0 z-[400] w-[280px] flex flex-col
                bg-white dark:bg-[#0c0c0e]
                border-r border-zinc-200 dark:border-zinc-800
                overflow-hidden
                shadow-[8px_0_32px_rgba(0,0,0,0.15)] dark:shadow-[8px_0_32px_rgba(0,0,0,0.5)]
              "
              aria-label="Sidebar navigation"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-3 pt-4 pb-2 border-b border-zinc-150 dark:border-zinc-800/50">
                <WorkspaceSwitcher align="left" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  aria-label="Close sidebar"
                  className="h-8 w-8"
                >
                  <X size={16} />
                </Button>
              </div>

              {navContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    )
  }

  // Desktop sidebar
  return (
    <motion.aside
      animate={{ width: sidebarWidth }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="
        relative flex flex-col h-full flex-shrink-0
        bg-zinc-50 dark:bg-[#0c0c0e]
        border-r border-zinc-200 dark:border-zinc-800
        overflow-hidden
      "
      style={{ width: sidebarWidth }}
      aria-label="Sidebar navigation"
    >
      {/* Header */}
      <div className={`flex items-center pt-4 pb-2 min-h-[56px] border-b border-zinc-200/60 dark:border-zinc-800/60 ${sidebarOpen ? 'justify-between px-3' : 'flex-col gap-2 px-1'}`}>
        <WorkspaceSwitcher align="left" collapsed={!sidebarOpen} />
        <Tooltip content={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'} shortcut="Ctrl+B">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={sidebarOpen}
            className="h-8 w-8"
          >
            <PanelLeft size={16} className={`transition-transform duration-200 ${sidebarOpen ? '' : 'rotate-180'}`} />
          </Button>
        </Tooltip>
      </div>

      {navContent}
    </motion.aside>
  )
}
