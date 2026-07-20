'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/lib/store/uiStore'
import { useAppStore } from '@/lib/store/appStore'

export function SettingsModal() {
  const { activeModal, closeModal, addToast } = useUIStore()
  const { preferences, updatePreferences } = useAppStore()
  const [confirmReset, setConfirmReset] = useState(false)

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updatePreferences({ theme })
    addToast({ message: `Theme set to ${theme}`, type: 'info', duration: 1500 })
  }

  const handleDensityChange = (density: 'compact' | 'comfortable') => {
    updatePreferences({ density })
    addToast({ message: `Layout density set to ${density}`, type: 'info', duration: 1500 })
  }

  const handleShowCompletedToggle = () => {
    const newVal = !preferences.showCompleted
    updatePreferences({ showCompleted: newVal })
    addToast({ message: newVal ? 'Showing completed tasks' : 'Hiding completed tasks', type: 'info', duration: 1500 })
  }

  const handleFactoryReset = async () => {
    try {
      // Clear localStorage
      localStorage.clear()
      
      // Delete IndexedDB database
      const req = window.indexedDB.deleteDatabase('mono-os')
      req.onsuccess = () => {
        addToast({ message: 'Database reset successfully', type: 'success' })
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
      req.onerror = () => {
        addToast({ message: 'Failed to clear IndexedDB database', type: 'error' })
      }
    } catch (err) {
      console.error(err)
      addToast({ message: 'Error resetting application', type: 'error' })
    }
  }

  return (
    <Modal
      open={activeModal === 'settings'}
      onClose={() => {
        closeModal()
        setConfirmReset(false)
      }}
      title="Settings"
      description="Customize your Personal Operating System workspace."
      size="md"
    >
      <div className="flex flex-col gap-6 py-1">
        {/* Theme Settings */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
            Appearance Theme
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <Button
                key={t}
                variant={preferences.theme === t ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange(t)}
                className="capitalize"
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        {/* Density Settings */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
            Layout Density
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {(['comfortable', 'compact'] as const).map((d) => (
              <Button
                key={d}
                variant={preferences.density === d ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDensityChange(d)}
                className="capitalize"
              >
                {d}
              </Button>
            ))}
          </div>
        </div>

        {/* Preferences Toggle */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
            Task Display Options
          </h3>
          <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div>
              <p className="text-xs font-semibold text-zinc-850 dark:text-zinc-200">Show Completed Items</p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Show completed items in lists and projects.</p>
            </div>
            <Button
              variant={preferences.showCompleted ? 'default' : 'outline'}
              size="sm"
              onClick={handleShowCompletedToggle}
            >
              {preferences.showCompleted ? 'On' : 'Off'}
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-2 pt-4 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col gap-2.5">
          <h3 className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
            Danger Zone
          </h3>
          <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <p className="text-xs font-semibold text-zinc-850 dark:text-zinc-200">Factory Reset Application</p>
            <p className="text-[11px] text-zinc-450 dark:text-zinc-550 mb-3.5 leading-relaxed">
              This will permanently delete all workspaces, projects, items, and settings from this device. This operation cannot be undone.
            </p>
            
            {!confirmReset ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmReset(true)}
                className="w-full text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 border-zinc-200 dark:border-zinc-800 cursor-pointer"
              >
                Reset all data...
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-bold text-red-650 dark:text-red-400 text-center mb-1">
                  Are you absolutely sure you want to reset everything?
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFactoryReset}
                    className="flex-1 text-white bg-red-600 hover:bg-red-750 dark:bg-red-900 dark:hover:bg-red-800 border-none cursor-pointer"
                  >
                    Yes, reset everything
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
