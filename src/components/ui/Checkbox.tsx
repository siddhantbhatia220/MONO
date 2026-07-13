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
          relative flex items-center justify-center flex-shrink-0
          rounded-md border-2 transition-all duration-150
          cursor-pointer focus-visible:outline focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-black
          ${checked
            ? 'bg-black border-black dark:bg-white dark:border-white'
            : 'bg-white border-[#dddddd] hover:border-[#999] dark:bg-[#333] dark:border-[#555] dark:hover:border-[#777]'
          }
          disabled:opacity-40 disabled:cursor-not-allowed
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
                stroke="white"
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
            ${checked ? 'text-[#999] line-through' : 'text-[#222] dark:text-[#efefef]'}
            ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
          `}
        >
          {label}
        </label>
      )}
    </div>
  )
}
