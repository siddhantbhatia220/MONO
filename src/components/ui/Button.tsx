'use client'

/**
 * MONO — Button Component
 *
 * Accessible, animated button matching Shadcn UI design specs.
 * Every variant uses the monochrome (Zinc/Black/White) scale.
 */
import React from 'react'

import { type HTMLMotionProps, motion } from 'framer-motion'

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  children?: React.ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  default: `
    bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/90
    dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90
  `,
  secondary: `
    bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-100/80
    dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80
  `,
  outline: `
    border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100 hover:text-zinc-900
    dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50
  `,
  ghost: `
    hover:bg-zinc-100 hover:text-zinc-900
    dark:hover:bg-zinc-800 dark:hover:text-zinc-50
  `,
  destructive: `
    bg-red-500 text-zinc-50 shadow-sm hover:bg-red-500/90
    dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/90
  `,
  link: `
    text-zinc-900 underline-offset-4 hover:underline
    dark:text-zinc-50
  `,
}

const sizeStyles: Record<ButtonSize, string> = {
  default: 'h-9 px-4 py-2 text-sm',
  sm: 'h-8 rounded-md px-3 text-xs',
  lg: 'h-10 rounded-md px-8 text-sm font-semibold',
  icon: 'h-9 w-9 p-0 flex items-center justify-center',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'default',
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      fullWidth = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        transition={{ duration: 0.1 }}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={`
          inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium
          transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300
          disabled:pointer-events-none disabled:opacity-50
          gap-2
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `
          .replace(/\s+/g, ' ')
          .trim()}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}

        {!loading && icon && iconPosition === 'left' && <span aria-hidden="true">{icon}</span>}

        {children && <span>{children}</span>}

        {!loading && icon && iconPosition === 'right' && <span aria-hidden="true">{icon}</span>}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
