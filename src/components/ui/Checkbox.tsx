'use client'

/**
 * MONO — Checkbox Component
 *
 * Custom animated checkbox — the SVG checkmark draws itself on check.
 * This is the most used interaction in the entire app.
 */

import React, { useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  id?: string
}

const sizeMap = {
  sm: { box: 16, stroke: 2, check: 10 },
  md: { box: 20, stroke: 2, check: 12 },
  lg: { box: 24, stroke: 2.5, check: 14 },
}

const checkPath = 'M3 10l4 4 8-8'

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = '',
  id: propId,
}: CheckboxProps) {
  const generatedId = useId()
  const id = propId ?? generatedId
  const { box, stroke, check } = sizeMap[size]

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        id={id}
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          peer relative flex items-center justify-center shrink-0
          rounded-sm border border-zinc-200 transition-colors
          cursor-pointer focus-visible:outline-none focus-visible:ring-1
          focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300
          ${checked
            ? 'bg-zinc-900 border-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-900'
            : 'bg-transparent dark:border-zinc-800'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        style={{ width: box, height: box }}
        type="button"
      >
        <AnimatePresence>
          {checked && (
            <motion.svg
              key="check"
              width={check}
              height={check}
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              aria-hidden="true"
            >
              <motion.path
                d={checkPath}
                className="stroke-white dark:stroke-black"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ pathLength: 0 }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

      {label && (
        <label
          htmlFor={id}
          className={`
            text-sm leading-none cursor-pointer select-none
            transition-all duration-200
            ${checked ? 'text-zinc-400 line-through dark:text-zinc-600' : 'text-zinc-800 dark:text-zinc-200'}
            ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
          `}
        >
          {label}
        </label>
      )}
    </div>
  )
}
