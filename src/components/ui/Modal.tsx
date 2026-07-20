'use client'

/**
 * MONO — Modal Component
 * Focus-trapped, accessible modal with backdrop blur and spring animation.
 */

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './Button'

import { useIsMobile } from '@/lib/hooks/useIsMobile'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  hideCloseButton?: boolean
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  hideCloseButton = false,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  // Escape key to close
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Focus first focusable element on open
  useEffect(() => {
    if (open && contentRef.current) {
      const focusable = contentRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      focusable?.focus()
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div
          key={title ? `modal-${title}` : 'modal'}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
          className="fixed inset-0 z-[400] flex items-end md:items-center justify-center p-0 md:p-4"
        >
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Content */}
          <motion.div
            ref={contentRef}
            initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 8 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.97, y: 4 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280, bounce: 0.1 }}
            className={`
              relative z-10 w-full ${sizeStyles[size]}
              bg-white dark:bg-zinc-950
              border-t sm:border border-zinc-200 dark:border-zinc-800
              rounded-t-2xl sm:rounded-lg shadow-lg
              p-6 max-h-[85vh] overflow-y-auto pb-safe-bottom
            `}
          >
            {/* Header */}
            {(title || !hideCloseButton) && (
              <div className="flex items-start justify-between mb-4 gap-4">
                <div>
                  {title && (
                    <h2
                      id="modal-title"
                      className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id="modal-description"
                      className="text-sm text-zinc-500 dark:text-zinc-400 mt-1"
                    >
                      {description}
                    </p>
                  )}
                </div>

                {!hideCloseButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="flex-shrink-0 -mt-1 -mr-2"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
