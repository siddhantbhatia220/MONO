'use client'

/**
 * MONO — Empty State Component
 * Minimal, premium empty states with subtle icon containers.
 * Used when there's no data to show — makes first impressions memorable.
 */
import React from 'react'

import { motion } from 'framer-motion'
import { FolderOpen, Inbox, SearchX, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/Button'

type EmptyStateVariant = 'no-items' | 'no-workspace' | 'no-results' | 'first-launch'

interface EmptyStateProps {
  variant?: EmptyStateVariant
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const variants: Record<
  EmptyStateVariant,
  {
    icon: React.ReactNode
    defaultTitle: string
    defaultDescription: string
  }
> = {
  'no-items': {
    icon: <Inbox size={24} strokeWidth={1.5} />,
    defaultTitle: 'No items yet',
    defaultDescription: 'Press N or use the input below to create your first task.',
  },
  'no-workspace': {
    icon: <FolderOpen size={24} strokeWidth={1.5} />,
    defaultTitle: 'Create a workspace',
    defaultDescription: 'A workspace holds all your projects and items.',
  },
  'no-results': {
    icon: <SearchX size={24} strokeWidth={1.5} />,
    defaultTitle: 'No results',
    defaultDescription: 'Try adjusting your search or filters.',
  },
  'first-launch': {
    icon: <Sparkles size={24} strokeWidth={1.5} />,
    defaultTitle: 'Welcome to MONO',
    defaultDescription: 'One place. Every workflow. Create your first workspace to begin.',
  },
}

export function EmptyState({
  variant = 'no-items',
  title,
  description,
  action,
  secondaryAction,
  className = '',
}: EmptyStateProps) {
  const { icon, defaultTitle, defaultDescription } = variants[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`
        flex flex-col items-center justify-center gap-4 py-20 md:py-28 px-6 text-center
        ${className}
      `}
      role="status"
      aria-label={title ?? defaultTitle}
    >
      {/* Icon container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
        className="
          w-12 h-12 rounded-2xl
          bg-zinc-100 dark:bg-zinc-900
          border border-zinc-200 dark:border-zinc-800
          flex items-center justify-center
          text-zinc-500 dark:text-zinc-400
        "
      >
        {icon}
      </motion.div>

      <div className="max-w-xs">
        <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 mb-1 tracking-tight">
          {title ?? defaultTitle}
        </h2>
        <p className="text-[13px] leading-relaxed text-zinc-650 dark:text-zinc-400">
          {description ?? defaultDescription}
        </p>
      </div>

      {(action || secondaryAction) && (
        <div className="flex items-center gap-2 mt-1">
          {action && (
            <Button variant="default" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" size="sm" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}
