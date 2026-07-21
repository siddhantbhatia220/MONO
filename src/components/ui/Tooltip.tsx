'use client'

/**
 * MONO — Tooltip Component
 * Accessible tooltip triggered on hover and focus.
 */
import React, { useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps {
  content: string
  position?: TooltipPosition
  children: React.ReactElement
  shortcut?: string
  delay?: number
}

const positionStyles: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

export function Tooltip({
  content,
  position = 'top',
  children,
  shortcut,
  delay = 500,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    const id = setTimeout(() => setVisible(true), delay)
    setTimeoutId(id)
  }

  const hide = () => {
    if (timeoutId) clearTimeout(timeoutId)
    setVisible(false)
  }

  return (
    <div className="relative inline-flex">
      {React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        onMouseEnter: show,
        onMouseLeave: hide,
        onFocus: () => setVisible(true),
        onBlur: hide,
        'aria-label': (children.props as Record<string, string>)['aria-label'] ?? content,
      })}

      <AnimatePresence>
        {visible && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`
              absolute z-[600] pointer-events-none
              ${positionStyles[position]}
            `}
          >
            <div
              className="
                flex items-center gap-2
                bg-[#111] text-white dark:bg-white dark:text-[#111]
                text-xs font-medium tracking-tight
                px-2.5 py-1.5 rounded-lg
                whitespace-nowrap shadow-xl
              "
            >
              <span>{content}</span>
              {shortcut && <span className="opacity-60 text-[10px] font-mono">{shortcut}</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
