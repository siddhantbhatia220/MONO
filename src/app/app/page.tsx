'use client'

/**
 * MONO — Main Application Page
 *
 * This is the primary workspace view. It handles:
 * - Onboarding (first-run experience)
 * - App shell (sidebar + main content)
 * - Global keyboard shortcuts
 * - Command palette
 */
import React, { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import { AnimatePresence, motion } from 'framer-motion'
import { Menu } from 'lucide-react'

import { createWorkspace, listWorkspaces } from '@/lib/db/workspaces'
import { useIsMobile } from '@/lib/hooks/useIsMobile'
import { filterItems } from '@/lib/search/fuzzySearch'
import { useAppStore } from '@/lib/store/appStore'
import { useItemStore } from '@/lib/store/itemStore'
import { useUIStore } from '@/lib/store/uiStore'
import { ViewMode } from '@/lib/types/view'
import { SHORTCUTS } from '@/lib/utils/keyboard'

import { ExportButton } from '@/components/ImportExport/ExportButton'
import { ImportDialog } from '@/components/ImportExport/ImportDialog'
import { AutomationModal } from '@/components/automation/AutomationModal'
import { InsightsDashboardModal } from '@/components/intelligence/InsightsDashboardModal'
import { ItemDetailPanel } from '@/components/items/ItemDetailPanel'
import { AuthModal } from '@/components/layout/AuthModal'
import { BatchActionBar } from '@/components/layout/BatchActionBar'
import { CreateProjectModal } from '@/components/layout/CreateProjectModal'
import { FocusModeHeader } from '@/components/layout/FocusModeHeader'
import { InviteMemberModal } from '@/components/layout/InviteMemberModal'
import { MobileNavDock } from '@/components/layout/MobileNavDock'
import { SettingsModal } from '@/components/layout/SettingsModal'
import { Sidebar } from '@/components/layout/Sidebar'
import { TagManagerModal } from '@/components/layout/TagManagerModal'
import { ViewHeaderSwitcher } from '@/components/layout/ViewHeaderSwitcher'
import { WorkspaceSwitcher } from '@/components/layout/WorkspaceSwitcher'
import { PluginList } from '@/components/plugins/PluginList'
import { PluginStore } from '@/components/plugins/PluginStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ProjectIcon } from '@/components/ui/ProjectIcon'
import { BoardView } from '@/components/views/BoardView/BoardView'
import { CalendarView } from '@/components/views/CalendarView/CalendarView'
import { ListView } from '@/components/views/ListView'
import { SmartFilterBar } from '@/components/views/SearchView/SmartFilterBar'
import { TimelineView } from '@/components/views/TimelineView/TimelineView'

const CommandPalette = dynamic(
  () => import('@/components/layout/CommandPalette').then((mod) => mod.CommandPalette),
  { ssr: false }
)
const QuickCapture = dynamic(
  () => import('@/components/items/QuickCapture').then((mod) => mod.QuickCapture),
  { ssr: false }
)

// ============================
// Toast Notification System
// ============================
function Toasts() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div
      className="fixed bottom-6 right-6 z-[500] flex flex-col gap-2"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 16, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="
              flex items-center gap-3 px-4 py-3
              bg-[#111] dark:bg-white
              text-white dark:text-[#111]
              text-sm font-medium
              rounded-xl shadow-xl
              cursor-pointer
            "
            onClick={() => removeToast(toast.id)}
            role="alert"
          >
            {toast.type === 'success' && <span aria-hidden="true">✓</span>}
            {toast.type === 'error' && <span aria-hidden="true">✕</span>}
            {toast.type === 'info' && <span aria-hidden="true">·</span>}
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ============================
// Create Workspace Modal
// ============================
function CreateWorkspaceModal() {
  const { activeModal, closeModal } = useUIStore()
  const { setActiveWorkspace } = useAppStore()
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('Folder')
  const [loading, setLoading] = useState(false)

  const ICON_OPTIONS = [
    'Folder',
    'Zap',
    'Target',
    'Lightbulb',
    'FileText',
    'Rocket',
    'Leaf',
    'FlaskConical',
    'Palette',
    'BarChart3',
  ]

  const handleCreate = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      const workspace = await createWorkspace({ name: name.trim(), icon })
      setActiveWorkspace(workspace)
      closeModal()
      setName('')
      setIcon('Folder')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={activeModal === 'create-workspace'}
      onClose={closeModal}
      title="New Workspace"
      description="A workspace holds all your projects and items."
      size="sm"
    >
      <div className="flex flex-col gap-4">
        {/* Icon picker */}
        <div>
          <p className="text-xs font-medium tracking-wide text-[#777] uppercase mb-2">Icon</p>
          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.map((iconName) => (
              <button
                key={iconName}
                onClick={() => setIcon(iconName)}
                className={`
                  w-9 h-9 rounded-lg flex items-center justify-center
                  border transition-all duration-100 cursor-pointer
                  ${
                    icon === iconName
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }
                `}
                aria-label={`Select ${iconName} as workspace icon`}
                aria-pressed={icon === iconName}
              >
                <ProjectIcon name={iconName} className="h-4.5 w-4.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Name input */}
        <Input
          label="Name"
          placeholder="My Workspace"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          autoFocus
        />

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleCreate}
            loading={loading}
            disabled={!name.trim()}
          >
            Create Workspace
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// ============================
// Keyboard Shortcuts Modal
// ============================
function ShortcutsModal() {
  const { activeModal, closeModal } = useUIStore()
  const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac')

  const grouped = SHORTCUTS.reduce<Record<string, typeof SHORTCUTS>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <Modal
      open={activeModal === 'keyboard-shortcuts'}
      onClose={closeModal}
      title="Keyboard Shortcuts"
      size="md"
    >
      <div className="flex flex-col gap-5">
        {Object.entries(grouped).map(([category, shortcuts]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#bbbbbb] dark:text-[#555] mb-2">
              {category}
            </h3>
            <div className="flex flex-col gap-1">
              {shortcuts.map((s) => {
                const modMap: Record<string, string> = {
                  ctrl: isMac ? '⌘' : 'Ctrl+',
                  meta: '⌘',
                  alt: isMac ? '⌥' : 'Alt+',
                  shift: isMac ? '⇧' : 'Shift+',
                  'ctrl+shift': isMac ? '⌘⇧' : 'Ctrl+Shift+',
                  'meta+shift': isMac ? '⌘⇧' : 'Win+Shift+',
                }
                const mod = s.modifier ? modMap[s.modifier] : ''
                const key = s.key === 'Escape' ? 'Esc' : s.key.toUpperCase()

                return (
                  <div
                    key={`${s.key}-${s.modifier}`}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-100"
                  >
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {s.description}
                    </span>
                    <kbd
                      className="
                      px-2 py-1 text-xs font-mono
                      bg-zinc-100 dark:bg-zinc-900
                      text-zinc-600 dark:text-zinc-450
                      border border-zinc-200 dark:border-zinc-800
                      rounded-md
                    "
                    >
                      {mod}
                      {key}
                    </kbd>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

// ============================
// Plugins Modal
// ============================
function PluginsModal() {
  const { activeModal, closeModal } = useUIStore()
  const [tab, setTab] = useState<'marketplace' | 'installed'>('marketplace')

  return (
    <Modal
      open={activeModal === 'plugins'}
      onClose={closeModal}
      title="Plugins & Extensibility"
      size="lg"
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
          <button
            onClick={() => setTab('marketplace')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              tab === 'marketplace'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setTab('installed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              tab === 'installed'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Installed Plugins
          </button>
        </div>

        {tab === 'marketplace' ? <PluginStore /> : <PluginList />}
      </div>
    </Modal>
  )
}

// ============================
// Main Workspace Header
// ============================
function WorkspaceHeader() {
  const { activeWorkspace, activeProject } = useAppStore()
  const { toggleSidebar } = useUIStore()
  const { items } = useItemStore()
  const isMobile = useIsMobile()

  if (!activeWorkspace) return null

  const itemCount = Object.values(items).filter(
    (i) => i.status !== 'completed' && i.status !== 'archived'
  ).length

  return (
    <header
      className="
      flex items-center justify-between
      px-4 md:px-8 h-14
      border-b border-zinc-200/80 dark:border-zinc-800/60
      bg-white dark:bg-[#0f0f0f]
      flex-shrink-0
    "
    >
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Open sidebar menu"
            className="flex-shrink-0 -ml-1"
          >
            <Menu size={18} />
          </Button>
        )}
        <div className="flex items-center gap-2.5">
          {activeProject ? (
            <>
              <span className="text-base flex-shrink-0">{activeProject.icon ?? '📂'}</span>
              <h1 className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 truncate max-w-[150px] md:max-w-[200px]">
                {activeProject.name}
              </h1>
              <span className="text-[12px] font-medium text-zinc-400 dark:text-zinc-600 flex-shrink-0">
                in {activeWorkspace.name}
              </span>
            </>
          ) : (
            <WorkspaceSwitcher />
          )}
          {itemCount > 0 && (
            <span
              className="
              text-[11px] font-semibold text-zinc-400 dark:text-zinc-600
              bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full
              flex-shrink-0 tabular-nums
            "
            >
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1.5 sm:space-x-3">
        <div className="hidden sm:block">
          <ExportButton size="sm" variant="outline" />
        </div>
        <ViewHeaderSwitcher />
      </div>
    </header>
  )
}

// ============================
// Looping Interactive Mockup
// ============================
function ProductTourMockup() {
  return (
    <div className="w-full aspect-[16/10] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-6 shadow-2xl flex flex-col justify-between select-none">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 ml-2">MONO OS</span>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
          Local-First
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 my-auto">
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-1">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            ⚡ Natural Language
          </span>
          <span className="text-[11px] text-zinc-500">@tomorrow !high #work</span>
        </div>
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-1">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">🤖 Automations</span>
          <span className="text-[11px] text-zinc-500">IF done → THEN #completed</span>
        </div>
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-1">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            💾 1-Click Backup
          </span>
          <span className="text-[11px] text-zinc-500">Full JSON DB snapshot</span>
        </div>
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-1">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            📱 Mobile Responsive
          </span>
          <span className="text-[11px] text-zinc-500">Bottom dock & sheets</span>
        </div>
      </div>
    </div>
  )
}

// ============================
// Onboarding / First Launch
// ============================
function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const [workspaceName, setWorkspaceName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('⚡')
  const [loading, setLoading] = useState(false)
  const { setActiveWorkspace } = useAppStore()

  const ICONS = ['⚡', '🎯', '💡', '📝', '🚀', '🌿']
  const TEMPLATES = [
    { name: 'Personal', icon: '🌿', description: 'Daily tasks, habits, personal goals' },
    { name: 'Work', icon: '⚡', description: 'Projects, meetings, work tasks' },
    { name: 'Study', icon: '📝', description: 'Notes, assignments, research' },
    { name: 'Custom', icon: '🎯', description: 'Start from scratch' },
  ]

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) return
    setLoading(true)
    try {
      const workspace = await createWorkspace({
        name: workspaceName.trim(),
        icon: selectedIcon,
      })
      setActiveWorkspace(workspace)
      onComplete()
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="relative min-h-dvh bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center p-4 sm:p-8 overflow-hidden z-0">
      {/* Background glow portal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.15, 0.95, 1],
            x: [0, 20, -15, 0],
            y: [0, -20, 25, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] opacity-40 dark:opacity-20 blur-[120px] bg-gradient-to-tr from-zinc-200 via-zinc-100 to-zinc-300 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950"
        />
      </div>

      <motion.div
        layout
        className={`w-full relative z-10 transition-all duration-500 ease-in-out ${
          step === 0
            ? 'max-w-5xl bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl dark:shadow-black/50'
            : 'max-w-lg bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl dark:shadow-black/50'
        }`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {step === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left side: branding & onboarding call to action */}
            <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left h-full">
              {/* Logo */}
              <motion.div
                className="flex items-center justify-center lg:justify-start mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', bounce: 0.3 }}
              >
                <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white dark:text-black text-xl font-black">M</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl sm:text-5xl font-black text-black dark:text-white mb-3 flex items-center justify-center lg:justify-start gap-1.5 overflow-hidden tracking-tight">
                  {'MONO'.split('').map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.2 + index * 0.08,
                        type: 'spring',
                        stiffness: 160,
                        damping: 12,
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </h1>
                <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 font-semibold mb-2">
                  One place. Every workflow.
                </p>
                <p className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-500 leading-relaxed max-w-sm mx-auto lg:mx-0 mb-6">
                  A local-first workspace for tasks, notes, projects, and everything in between.
                  Keyboard-first. Distraction-free. Yours.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-3 justify-center lg:justify-start"
              >
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => setStep(1)}
                  className="w-full lg:w-44"
                >
                  Get started
                </Button>
              </motion.div>
            </div>

            {/* Right side: Product Tour Mockup */}
            <div className="lg:col-span-7 hidden lg:flex items-center justify-center relative w-full h-full pl-4">
              <ProductTourMockup />
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white mb-2">
                Choose a template
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">
                Pick a starting point. You can customize everything later.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => {
                    setWorkspaceName(t.name === 'Custom' ? '' : t.name)
                    setSelectedIcon(t.icon)
                    setStep(2)
                  }}
                  className="
                    p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-left
                    hover:border-zinc-400 dark:hover:border-zinc-650
                    hover:bg-zinc-50 dark:hover:bg-zinc-900/55
                    transition-all duration-150
                    group cursor-pointer
                  "
                >
                  <span className="text-2xl block mb-2">{t.icon}</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors">
                    {t.name}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 leading-relaxed">
                    {t.description}
                  </p>
                </button>
              ))}
            </div>

            <Button variant="ghost" size="sm" onClick={() => setStep(0)} className="mt-6">
              ← Back
            </Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white mb-2">
                Name your workspace
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">
                Give it a name that reflects what lives here.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {ICONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedIcon(emoji)}
                  className={`
                    w-10 h-10 rounded-xl text-xl flex items-center justify-center border
                    transition-all duration-100 cursor-pointer
                    ${
                      selectedIcon === emoji
                        ? 'border-black dark:border-white bg-zinc-50 dark:bg-zinc-900/50'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'
                    }
                  `}
                  aria-label={`Choose ${emoji}`}
                  aria-pressed={selectedIcon === emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <Input
              placeholder="e.g. Personal, Work, Study..."
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkspace()}
              autoFocus
              size="lg"
            />

            <div className="flex gap-3 mt-6">
              <Button variant="ghost" onClick={() => setStep(1)} disabled={loading}>
                ← Back
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={handleCreateWorkspace}
                loading={loading}
                disabled={!workspaceName.trim()}
                fullWidth
              >
                Create & Enter MONO →
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </main>
  )
}
// ============================
// App Shell
// ============================
function AppShell() {
  const { toggleSidebar, openCommandPalette, openModal, setSidebarOpen, focusMode } = useUIStore()
  const { activeViewMode, activeFilterCriteria } = useAppStore()
  const { items } = useItemStore()
  const isMobile = useIsMobile()

  const allItems = filterItems(Object.values(items), activeFilterCriteria)

  // Auto-close sidebar on mobile devices on initial render
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile, setSidebarOpen])

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire shortcuts inside text inputs
      const target = e.target as HTMLElement
      const inInput =
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable
      if (inInput && e.key !== 'Escape') return

      // Ctrl+K / Cmd+K — Open command palette
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        openCommandPalette()
        return
      }

      // N — New item (focuses quick capture)
      if (e.key === 'n' && !inInput) {
        e.preventDefault()
        const qInput = document.getElementById('quick-capture-input')
        qInput?.focus()
        return
      }

      // Ctrl+B — Toggle sidebar
      if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        toggleSidebar()
        return
      }

      // ? — Keyboard shortcuts
      if (e.key === '?' && !inInput) {
        openModal('keyboard-shortcuts')
        return
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [openCommandPalette, toggleSidebar, openModal])

  return (
    <div className="app-shell flex h-dvh overflow-hidden flex-col">
      <FocusModeHeader />

      <div className="flex flex-1 h-full overflow-hidden">
        {/* Sidebar */}
        {!focusMode && <Sidebar />}

        {/* Main content */}
        <main className="app-main flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#0f0f0f]">
          {!focusMode && (
            <>
              <WorkspaceHeader />
              <SmartFilterBar />
            </>
          )}

          <div className="flex-1 overflow-y-auto flex flex-col">
            {activeViewMode === ViewMode.List && (
              <div className="px-4 md:px-8 pt-2 pb-4 max-w-3xl mx-auto w-full">
                <ListView />
              </div>
            )}

            {activeViewMode === ViewMode.Board && <BoardView items={allItems} />}

            {activeViewMode === ViewMode.Calendar && <CalendarView items={allItems} />}

            {activeViewMode === ViewMode.Timeline && <TimelineView items={allItems} />}
          </div>

          {/* Floating Batch Action Bar */}
          <BatchActionBar />

          {/* Quick Capture Bar — always visible at bottom */}
          <div className="flex-shrink-0 border-t border-zinc-100 dark:border-zinc-800/50 bg-white/90 dark:bg-[#0f0f0f]/90 backdrop-blur-xl px-4 md:px-8 py-3 md:py-4 pb-[calc(env(safe-area-inset-bottom,0px)+64px)] md:pb-4">
            <div className="max-w-3xl mx-auto w-full">
              <QuickCapture />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation Dock */}
      {!focusMode && <MobileNavDock />}
    </div>
  )
}

// ============================
// Main Page
// ============================
export default function Home() {
  const [initialized, setInitialized] = useState(false)
  const [hasWorkspace, setHasWorkspace] = useState<boolean | null>(null)
  const { setActiveWorkspace } = useAppStore()
  const { activeModal, closeModal } = useUIStore()

  useEffect(() => {
    async function init() {
      const workspaces = await listWorkspaces()
      if (workspaces.length > 0) {
        setActiveWorkspace(workspaces[0])
        setHasWorkspace(true)
      } else {
        setHasWorkspace(false)
      }
      setInitialized(true)
    }
    init()
  }, [setActiveWorkspace])

  if (!initialized) {
    return (
      <div className="min-h-dvh bg-white dark:bg-[#111] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-2xl font-black tracking-widest text-[#222] dark:text-white"
        >
          M
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {hasWorkspace === false ? (
          <OnboardingScreen key="onboarding" onComplete={() => setHasWorkspace(true)} />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-dvh"
          >
            <AppShell />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global overlays */}
      <CommandPalette />
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <SettingsModal />
      <ItemDetailPanel />
      <TagManagerModal />
      <AuthModal />
      <InviteMemberModal />
      <ShortcutsModal />
      <PluginsModal />
      <AutomationModal />
      <ImportDialog isOpen={activeModal === 'import-data'} onClose={closeModal} />
      <InsightsDashboardModal />
      <Toasts />
    </>
  )
}
