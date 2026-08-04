'use client'

import React from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

import { Sidebar } from '@/components/layout/Sidebar'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[400] md:hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white dark:bg-[#09090b] shadow-2xl flex flex-col z-10 border-r border-zinc-200 dark:border-zinc-800"
          >
            {/* Close Button Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Menu & Projects
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                aria-label="Close Mobile Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Render Sidebar inside Drawer */}
            <div className="flex-1 overflow-y-auto">
              <Sidebar className="w-full h-full border-r-0" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
