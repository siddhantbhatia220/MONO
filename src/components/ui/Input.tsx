'use client'

/**
 * MONO — Input Component
 * Accessible text input with label, error state, and clear button.
 */

import React, { useId, forwardRef } from 'react'
import { X } from 'lucide-react'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  size?: 'sm' | 'md' | 'lg'
  onClear?: () => void
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const sizeStyles = {
  sm: 'h-8 text-sm px-3',
  md: 'h-10 text-sm px-4',
  lg: 'h-12 text-base px-4',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      size = 'md',
      onClear,
      leftIcon,
      rightIcon,
      className = '',
      id: propId,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const id = propId ?? generatedId
    const errorId = `${id}-error`
    const hintId = `${id}-hint`

    const hasValue = value !== undefined ? String(value).length > 0 : false

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-medium tracking-wide text-[#444] dark:text-[#bbbbbb] uppercase"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[#999] pointer-events-none" aria-hidden="true">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            value={value}
            aria-invalid={!!error}
            aria-describedby={
              [error ? errorId : '', hint ? hintId : ''].filter(Boolean).join(' ') || undefined
            }
            className={`
              w-full rounded-lg border bg-white text-[#222]
              placeholder:text-[#bbbbbb]
              transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-black focus:border-black
              ${error
                ? 'border-[#444] bg-[#f8f8f8]'
                : 'border-[#dddddd] hover:border-[#bbbbbb]'
              }
              dark:bg-[#333] dark:text-white dark:border-[#555]
              dark:placeholder:text-[#666]
              dark:focus:ring-white dark:focus:border-white
              dark:hover:border-[#777]
              disabled:opacity-50 disabled:cursor-not-allowed
              ${leftIcon ? 'pl-10' : ''}
              ${(rightIcon || (onClear && hasValue)) ? 'pr-10' : ''}
              ${sizeStyles[size]}
              ${className}
            `}
            {...props}
          />

          {onClear && hasValue && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear input"
              className="absolute right-3 text-[#bbbbbb] hover:text-[#444] transition-colors duration-100 dark:hover:text-white"
            >
              <X size={14} />
            </button>
          )}

          {rightIcon && !onClear && (
            <span className="absolute right-3 text-[#999] pointer-events-none" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-xs text-[#444] font-medium dark:text-[#bbbbbb]">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className="text-xs text-[#999] dark:text-[#666]">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
