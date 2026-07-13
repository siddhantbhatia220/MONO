'use client'

/**
 * MONO — Sidebar
 * Collapsible navigation with workspace nav, project list, and keyboard shortcuts.
 * Supports desktop collapsible sidebar and mobile overlay sliding drawer.
 */

import React from 'react'
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
} from 'lucide-react'
import { useUIStore } from '@/lib/store/uiStore'
import { useAppStore } from '@/lib/store/appStore'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { useIsMobile } from '@/lib/hooks/useIsMobile'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  shortcut?: string
  action: () => void
}

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, openCommandPalette, openModal } = useUIStore()
  const { activeWorkspace, setActiveProject } = useAppStore()
  const isMobile = useIsMobile()

  const navItems: NavItem[] = [
    {
      id: 'search',
      label: 'Search',
      icon: <Search size={15} />,
      shortcut: '/',
      action: () => {
        openCommandPalette()
        if (isMobile) toggleSidebar()
      },
    },
    {
      id: 'inbox',
      label: 'Inbox',
      icon: <Inbox size={15} />,
      action: () => {
        setActiveProject(null)
        if (isMobile) toggleSidebar()
      },
    },
    {
      id: 'today',
      label: 'Today',
      icon: <Calendar size={15} />,
      action: () => {
        if (isMobile) toggleSidebar()
      },
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Star size={15} />,
      action: () => {
        if (isMobile) toggleSidebar()
      },
    },
  ]

  const sidebarWidth = sidebarOpen ? 260 : 60

  const navContent = (
    <>
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2" aria-label="Primary navigation">
        {/* Main nav items */}
        <div className="flex flex-col gap-0.5 mb-4">
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
                  flex items-center gap-3 w-full px-2 py-2 rounded-lg text-left
                  text-sm font-medium cursor-pointer
                  text-zinc-600 dark:text-zinc-400
                  hover:bg-zinc-100 hover:text-zinc-900
                  dark:hover:bg-zinc-900 dark:hover:text-zinc-50
                  transition-colors duration-100
                  ${(!sidebarOpen && !isMobile) ? 'justify-center' : ''}
                `}
                aria-label={item.label}
              >
                <span className="flex-shrink-0">{item.icon}</span>
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
            className="mb-2"
          >
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-600">
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

            <p className="px-2 text-xs text-zinc-400 dark:text-zinc-600 py-1">
              No projects yet
            </p>
          </motion.div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-2 pb-3 pt-2 border-t border-zinc-200/80 dark:border-zinc-900 flex flex-col gap-0.5">
        <Tooltip content="Settings" shortcut="," position="right">
          <button
            onClick={() => openModal('settings')}
            className={`
              flex items-center gap-3 w-full px-2 py-2 rounded-lg text-left
              text-sm font-medium cursor-pointer
              text-zinc-500 dark:text-zinc-400
              hover:bg-zinc-100 hover:text-zinc-900
              dark:hover:bg-zinc-900 dark:hover:text-zinc-50
              transition-colors duration-100
              ${(!sidebarOpen && !isMobile) ? 'justify-center' : ''}
            `}
            aria-label="Settings"
          >
            <Settings size={15} />
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
              flex items-center gap-3 w-full px-2 py-2 rounded-lg text-left
              text-sm font-medium cursor-pointer
              text-zinc-500 dark:text-zinc-400
              hover:bg-zinc-100 hover:text-zinc-900
              dark:hover:bg-zinc-900 dark:hover:text-zinc-50
              transition-colors duration-100
              ${(!sidebarOpen && !isMobile) ? 'justify-center' : ''}
            `}
            aria-label="Keyboard shortcuts"
          >
            <Keyboard size={15} />
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
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black z-[390]"
              aria-hidden="true"
            />

            {/* Sliding Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="
                fixed top-0 left-0 bottom-0 z-[400] w-[260px] flex flex-col
                bg-zinc-50 dark:bg-zinc-950
                border-r border-zinc-200/80 dark:border-zinc-900
                overflow-hidden shadow-2xl
              "
              aria-label="Sidebar navigation"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2 min-h-[56px]">
                <div className="flex items-center gap-2">
                  <div
                    className="
                      w-6 h-6 bg-black dark:bg-white rounded-md
                      flex items-center justify-center flex-shrink-0
                    "
                  >
                    <span className="text-white dark:text-black text-[10px] font-black tracking-widest">
                      M
                    </span>
                  </div>
                  <span className="text-sm font-bold tracking-tight text-[#111] dark:text-white">
                    MONO
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  aria-label="Close sidebar"
                >
                  <PanelLeft size={16} />
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
      transition={{ type: 'spring', damping: 25, stiffness: 250 }}
      className="
        relative flex flex-col h-full flex-shrink-0
        bg-zinc-50 dark:bg-zinc-950
        border-r border-zinc-200/80 dark:border-zinc-900
        overflow-hidden
      "
      style={{ width: sidebarWidth }}
      aria-label="Sidebar navigation"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 min-h-[56px]">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <div
                className="
                  w-6 h-6 bg-black dark:bg-white rounded-md
                  flex items-center justify-center flex-shrink-0
                "
              >
                <span className="text-white dark:text-black text-[10px] font-black tracking-widest">
                  M
                </span>
              </div>
              <span className="text-sm font-bold tracking-tight text-[#111] dark:text-white">
                MONO
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <Tooltip content={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'} shortcut="Ctrl+B">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={sidebarOpen}
          >
            <PanelLeft size={16} className={`transition-transform duration-200 ${sidebarOpen ? '' : 'rotate-180'}`} />
          </Button>
        </Tooltip>
      </div>

      {navContent}
    </motion.aside>
  )
}
