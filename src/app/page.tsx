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
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { ListView } from '@/components/views/ListView'
import { QuickCapture } from '@/components/items/QuickCapture'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useUIStore } from '@/lib/store/uiStore'
import { useAppStore } from '@/lib/store/appStore'
import { listWorkspaces, createWorkspace } from '@/lib/db/workspaces'
import { SHORTCUTS } from '@/lib/utils/keyboard'
import { Menu, Plus } from 'lucide-react'
import { useIsMobile } from '@/lib/hooks/useIsMobile'

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
  const [icon, setIcon] = useState('📁')
  const [loading, setLoading] = useState(false)

  const ICON_OPTIONS = ['📁', '⚡', '🎯', '💡', '📝', '🚀', '🌿', '🔬', '🎨', '📊']

  const handleCreate = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      const workspace = await createWorkspace({ name: name.trim(), icon })
      setActiveWorkspace(workspace)
      closeModal()
      setName('')
      setIcon('📁')
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
            {ICON_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setIcon(emoji)}
                className={`
                  w-9 h-9 rounded-lg text-lg flex items-center justify-center
                  border-2 transition-all duration-100
                  ${icon === emoji
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900'
                    : 'border-transparent hover:border-zinc-200 dark:hover:border-zinc-800'
                  }
                `}
                aria-label={`Select ${emoji} as workspace icon`}
                aria-pressed={icon === emoji}
              >
                {emoji}
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
            variant="primary"
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
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{s.description}</span>
                    <kbd className="
                      px-2 py-1 text-xs font-mono
                      bg-zinc-100 dark:bg-zinc-900
                      text-zinc-600 dark:text-zinc-450
                      border border-zinc-200 dark:border-zinc-800
                      rounded-md
                    ">
                      {mod}{key}
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
// Main Workspace Header
// ============================
function WorkspaceHeader() {
  const { activeWorkspace, activeProject } = useAppStore()
  const { openModal, toggleSidebar } = useUIStore()
  const isMobile = useIsMobile()

  if (!activeWorkspace) return null

  return (
    <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-zinc-200/80 dark:border-zinc-900 bg-white dark:bg-[#09090b]">
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Open sidebar menu"
            className="flex-shrink-0"
          >
            <Menu size={18} />
          </Button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl">{activeWorkspace.icon}</span>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#111] dark:text-white">
              {activeProject?.name ?? activeWorkspace.name}
            </h1>
          </div>
          <p className="text-xs text-[#999] dark:text-[#555] mt-0.5 ml-0">
            {activeProject ? `in ${activeWorkspace.name}` : 'All items'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isMobile ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openModal('create-workspace')}
            aria-label="Add workspace"
            className="flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-400 font-semibold px-2.5 py-1.5 rounded-lg"
          >
            <Plus size={13} />
            <span>Workspace</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openModal('create-workspace')}
            aria-label="Add workspace"
            className="h-8 w-8 flex items-center justify-center rounded-lg"
          >
            <Plus size={16} />
          </Button>
        )}
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
    <main className="min-h-dvh bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center p-4 sm:p-8">
      <motion.div
        className="w-full max-w-lg bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl dark:shadow-black/50"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {step === 0 && (
          <div className="text-center">
            {/* Logo */}
            <motion.div
              className="flex items-center justify-center mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', bounce: 0.3 }}
            >
              <div className="w-14 h-14 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white dark:text-black text-2xl font-black tracking-widest">
                  M
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-black dark:text-white mb-3">
                MONO
              </h1>
              <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 font-normal mb-2">
                One place. Every workflow.
              </p>
              <p className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto leading-relaxed px-2">
                A local-first workspace for tasks, notes, projects, and everything in between.
                Keyboard-first. Distraction-free. Yours.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-col gap-3 justify-center px-4"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => setStep(1)}
              >
                Get started
              </Button>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-3 mt-10 text-left"
            >
              {[
                { icon: '⚡', label: 'Instant & Offline-First', desc: 'Works offline with zero loading lag. Your data is stored securely on device.' },
                { icon: '⌨', label: 'Keyboard-Driven Flow', desc: 'Execute commands and find everything in milliseconds with the ⌘K palette.' },
                { icon: '∞', label: 'Adaptive & Flexible OS', desc: 'Unifies tasks, notes, habits, and goals in a system that adapts to your thinking.' },
              ].map((f) => (
                <div key={f.label} className="flex items-start gap-4 p-4 bg-zinc-50/80 dark:bg-zinc-900/30 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-150">
                  <div className="text-2xl flex-shrink-0 mt-0.5">{f.icon}</div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 tracking-tight">{f.label}</p>
                    <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 mt-1">{f.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
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
                    hover:bg-zinc-50 dark:hover:bg-zinc-900/50
                    transition-all duration-150
                    group cursor-pointer
                  "
                >
                  <span className="text-2xl block mb-2">{t.icon}</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors">
                    {t.name}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 leading-relaxed">{t.description}</p>
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(0)}
              className="mt-6"
            >
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
                    ${selectedIcon === emoji
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
                variant="primary"
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
  const { toggleSidebar, openCommandPalette, openModal, setSidebarOpen } = useUIStore()
  const isMobile = useIsMobile()

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
      const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable
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
    <div className="app-shell flex h-dvh overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="app-main flex-1 flex flex-col h-full overflow-hidden bg-[#fafafa] dark:bg-[#0f0f0f]">
        <WorkspaceHeader />

        <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-4 pb-28">
          <div className="max-w-3xl mx-auto w-full">
            <ListView />
          </div>
        </div>

        {/* Floating Quick Capture */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none bg-gradient-to-t from-[#fafafa] via-[#fafafa]/95 to-transparent dark:from-[#0f0f0f] dark:via-[#0f0f0f]/95 dark:to-transparent pt-12 pb-4 md:pb-8">
          <div className="max-w-3xl mx-auto w-full px-4 md:px-8 pointer-events-auto">
            <QuickCapture />
          </div>
        </div>
      </main>
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
      <ShortcutsModal />
      <Toasts />
    </>
  )
}
