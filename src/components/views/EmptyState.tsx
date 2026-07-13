'use client'

/**
 * MONO — Empty State Component
 * Hand-crafted monochrome SVG illustrations with animations.
 * Used when there's no data to show — makes first impressions memorable.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

type EmptyStateVariant =
  | 'no-items'
  | 'no-workspace'
  | 'no-results'
  | 'first-launch'

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

// Monochrome animated SVG illustrations
function NoItemsIllustration() {
  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
      aria-hidden="true"
    >
      {/* Notebook lines */}
      {[0, 1, 2, 3].map((i) => (
        <motion.line
          key={i}
          x1="30"
          y1={45 + i * 14}
          x2="90"
          y2={45 + i * 14}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.15"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
        />
      ))}
      {/* Checkboxes */}
      {[0, 1, 2].map((i) => (
        <motion.rect
          key={i}
          x="20"
          y={42 + i * 14}
          width="8"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.3"
          fill="none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.08, type: 'spring', bounce: 0.4 }}
        />
      ))}
      {/* Pencil */}
      <motion.g
        initial={{ opacity: 0, y: 8, rotate: -10 }}
        animate={{ opacity: 0.4, y: 0, rotate: 0 }}
        transition={{ delay: 0.5, type: 'spring', bounce: 0.3 }}
        style={{ transformOrigin: '75px 30px' }}
      >
        <rect x="68" y="18" width="8" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M68 38 L72 46 L76 38" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
        <line x1="68" y1="25" x2="76" y2="25" stroke="currentColor" strokeWidth="1" />
      </motion.g>
    </motion.svg>
  )
}

function NoWorkspaceIllustration() {
  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
      aria-hidden="true"
    >
      {/* Folder outline */}
      <motion.path
        d="M20 45 L20 85 Q20 88 23 88 L97 88 Q100 88 100 85 L100 48 Q100 45 97 45 L55 45 L50 38 L23 38 Q20 38 20 41 Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.25"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      {/* Plus symbol */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ delay: 0.6, type: 'spring', bounce: 0.5 }}
      >
        <line x1="60" y1="57" x2="60" y2="77" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="67" x2="70" y2="67" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>
    </motion.svg>
  )
}

function NoResultsIllustration() {
  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Search circle */}
      <motion.circle
        cx="52"
        cy="52"
        r="24"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.25"
        fill="none"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      {/* Handle */}
      <motion.line
        x1="70"
        y1="70"
        x2="90"
        y2="90"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="0.25"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      />
      {/* X inside */}
      <motion.g
        initial={{ opacity: 0, rotate: -45 }}
        animate={{ opacity: 0.35, rotate: 0 }}
        transition={{ delay: 0.5, type: 'spring' }}
        style={{ transformOrigin: '52px 52px' }}
      >
        <line x1="44" y1="44" x2="60" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="60" y1="44" x2="44" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
    </motion.svg>
  )
}

const variants: Record<EmptyStateVariant, {
  illustration: React.ReactNode
  defaultTitle: string
  defaultDescription: string
}> = {
  'no-items': {
    illustration: <NoItemsIllustration />,
    defaultTitle: 'Nothing here yet',
    defaultDescription: 'Create your first item with N or the quick capture bar below.',
  },
  'no-workspace': {
    illustration: <NoWorkspaceIllustration />,
    defaultTitle: 'Create your first workspace',
    defaultDescription: 'A workspace is where all your work, projects, and items live.',
  },
  'no-results': {
    illustration: <NoResultsIllustration />,
    defaultTitle: 'No results found',
    defaultDescription: 'Try adjusting your search or filters.',
  },
  'first-launch': {
    illustration: <NoWorkspaceIllustration />,
    defaultTitle: 'Welcome to MONO',
    defaultDescription: 'One place. Every workflow. Let\'s set up your first workspace.',
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
  const { illustration, defaultTitle, defaultDescription } = variants[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        flex flex-col items-center justify-center gap-4 py-16 px-8 text-center
        text-[#bbbbbb] dark:text-[#444]
        ${className}
      `}
      role="status"
      aria-label={title ?? defaultTitle}
    >
      <div className="opacity-70">{illustration}</div>

      <div className="max-w-xs">
        <h3 className="text-base font-semibold text-[#444] dark:text-[#777] mb-1 tracking-tight">
          {title ?? defaultTitle}
        </h3>
        <p className="text-sm leading-relaxed text-[#999] dark:text-[#555]">
          {description ?? defaultDescription}
        </p>
      </div>

      {(action || secondaryAction) && (
        <div className="flex items-center gap-2 mt-1">
          {action && (
            <Button variant="primary" size="sm" onClick={action.onClick}>
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
