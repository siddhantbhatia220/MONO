'use client'

/**
 * MONO — Button Component
 *
 * Accessible, animated button with multiple variants.
 * Every variant is purely monochrome — no exceptions.
 */

import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

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
  primary: `
    bg-black text-white border border-black
    hover:bg-[#222] active:bg-[#111]
    dark:bg-white dark:text-black dark:border-white
    dark:hover:bg-[#efefef] dark:active:bg-[#dddddd]
  `,
  secondary: `
    bg-white text-black border border-[#dddddd]
    hover:bg-[#f8f8f8] hover:border-[#bbbbbb] active:bg-[#efefef]
    dark:bg-[#333] dark:text-white dark:border-[#444]
    dark:hover:bg-[#444] dark:hover:border-[#555]
  `,
  ghost: `
    bg-transparent text-[#444] border border-transparent
    hover:bg-[#f8f8f8] hover:text-black active:bg-[#efefef]
    dark:text-[#bbbbbb] dark:hover:bg-[#333] dark:hover:text-white
  `,
  destructive: `
    bg-white text-black border border-[#dddddd]
    hover:bg-black hover:text-white hover:border-black
    active:bg-[#222] active:border-[#222]
    dark:bg-[#333] dark:text-white dark:border-[#444]
    dark:hover:bg-white dark:hover:text-black dark:hover:border-white
  `,
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-7 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-9 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-11 px-6 text-base gap-2.5 rounded-xl',
  icon: 'h-9 w-9 p-0 rounded-lg',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
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
        whileTap={{ scale: isDisabled ? 1 : 0.97 }}
        transition={{ duration: 0.1 }}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={`
          inline-flex items-center justify-center
          font-medium tracking-tight
          transition-colors duration-150
          cursor-pointer select-none
          disabled:opacity-40 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `.replace(/\s+/g, ' ').trim()}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin"
            style={{ width: '14px', height: '14px' }}
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

        {!loading && icon && iconPosition === 'left' && (
          <span aria-hidden="true">{icon}</span>
        )}

        {children && <span>{children}</span>}

        {!loading && icon && iconPosition === 'right' && (
          <span aria-hidden="true">{icon}</span>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
