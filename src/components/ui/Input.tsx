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
            className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-zinc-400 dark:text-zinc-500 pointer-events-none" aria-hidden="true">
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
              w-full rounded-lg border bg-white text-zinc-800
              placeholder:text-zinc-400
              transition-all duration-150
              focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400
              ${error
                ? 'border-zinc-500 bg-zinc-50'
                : 'border-zinc-200 hover:border-zinc-400'
              }
              dark:bg-zinc-950 dark:text-zinc-200 dark:border-zinc-800
              dark:placeholder:text-zinc-600
              dark:focus:ring-zinc-500 dark:focus:border-zinc-500
              dark:hover:border-zinc-600
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
              className="absolute right-3 text-zinc-400 hover:text-zinc-800 transition-colors duration-100 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}

          {rightIcon && !onClear && (
            <span className="absolute right-3 text-zinc-400 dark:text-zinc-500 pointer-events-none" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-xs text-zinc-600 font-semibold dark:text-zinc-400">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className="text-xs text-zinc-400 dark:text-zinc-600">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
