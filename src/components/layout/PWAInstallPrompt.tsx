'use client'

import React, { useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { Download, X } from 'lucide-react'

import { usePWA } from '@/lib/hooks/usePWA'

import { Button } from '@/components/ui/Button'

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, promptInstall } = usePWA()
  const [dismissed, setDismissed] = useState(false)

  if (!isInstallable || isInstalled || dismissed) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-[600] sm:max-w-md bg-[#09090b] dark:bg-white text-white dark:text-zinc-900 border border-zinc-800 dark:border-zinc-200 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4"
        role="dialog"
        aria-label="Install MONO App"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 dark:bg-zinc-100 flex items-center justify-center flex-shrink-0 text-white dark:text-zinc-900">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-tight">Install MONO App</h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Install MONO on your device for instant offline access and native speed.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={promptInstall}
            className="whitespace-nowrap bg-white text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 font-semibold"
          >
            Install
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white dark:hover:text-zinc-900 transition-colors"
            aria-label="Dismiss install prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
