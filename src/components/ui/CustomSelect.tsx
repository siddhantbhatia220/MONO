'use client'

/**
 * MONO — Custom Motion Select Component
 *
 * Replaces native browser <select> dropdowns with a Framer Motion
 * spring-animated popover. Zero browser-default blue menus, 100% monochrome.
 */
import React, { useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface CustomSelectProps {
  options: SelectOption[]
  value: string
  onChange: (val: string) => void
  placeholder?: string
  ariaLabel?: string
  className?: string
  align?: 'left' | 'right'
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  ariaLabel = 'Select option',
  className = '',
  align = 'left',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selected = options.find((o) => o.value === value)

  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
  }

  return (
    <div className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className="
          flex items-center justify-between gap-2 px-3 py-1.5 text-xs font-semibold
          bg-white dark:bg-zinc-900
          border border-zinc-200 dark:border-zinc-800
          hover:border-zinc-400 dark:hover:border-zinc-700
          rounded-lg text-zinc-900 dark:text-zinc-100
          transition-colors duration-150 cursor-pointer outline-none shadow-xs
          min-w-[120px]
        "
      >
        <div className="flex items-center gap-1.5 truncate">
          {selected?.icon}
          <span className="truncate">{selected ? selected.label : placeholder}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click Outside Overlay */}
            <div
              className="fixed inset-0 z-[190] bg-transparent"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ type: 'spring', damping: 22, stiffness: 350 }}
              className={`
                absolute z-[200] mt-1.5 min-w-[140px] w-full rounded-xl
                bg-white dark:bg-zinc-950
                border border-zinc-200 dark:border-zinc-800
                shadow-xl overflow-hidden py-1 max-h-56 overflow-y-auto
                ${align === 'right' ? 'right-0' : 'left-0'}
              `}
              role="listbox"
            >
              {options.map((opt) => {
                const isSelected = opt.value === value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    role="option"
                    aria-selected={isSelected}
                    className={`
                      w-full flex items-center justify-between px-3 py-1.5 text-xs text-left
                      font-medium transition-colors cursor-pointer select-none
                      ${
                        isSelected
                          ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 font-bold'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-zinc-100'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon}
                      <span className="truncate">{opt.label}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 flex-shrink-0 ml-2" />
                    )}
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
