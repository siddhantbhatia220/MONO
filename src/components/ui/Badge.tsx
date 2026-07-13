'use client'

/**
 * MONO — Badge Component
 * Priority, status, and tag badges. Always monochrome.
 */

import React from 'react'
import { Priority, ItemStatus } from '@/lib/types/item'

type BadgeVariant = 'priority' | 'status' | 'tag' | 'default'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  priority?: Priority
  status?: ItemStatus
  size?: 'sm' | 'md'
  className?: string
}

function priorityStyles(priority: Priority): string {
  switch (priority) {
    case Priority.Critical:
      return 'bg-black text-white dark:bg-white dark:text-black'
    case Priority.High:
      return 'bg-[#222] text-white dark:bg-[#efefef] dark:text-black'
    case Priority.Medium:
      return 'bg-[#777] text-white dark:bg-[#555] dark:text-white'
    case Priority.Low:
      return 'bg-[#efefef] text-[#444] dark:bg-[#333] dark:text-[#bbbbbb]'
    default:
      return 'bg-[#f8f8f8] text-[#777] dark:bg-[#333] dark:text-[#666]'
  }
}

function statusStyles(status: ItemStatus): string {
  switch (status) {
    case ItemStatus.Completed:
      return 'bg-[#f8f8f8] text-[#999] line-through dark:bg-[#333] dark:text-[#555]'
    case ItemStatus.InProgress:
      return 'bg-[#efefef] text-[#444] dark:bg-[#444] dark:text-[#efefef]'
    case ItemStatus.Cancelled:
      return 'bg-[#f8f8f8] text-[#bbbbbb] dark:bg-[#333] dark:text-[#555]'
    case ItemStatus.Archived:
      return 'bg-[#f8f8f8] text-[#bbbbbb] dark:bg-[#333] dark:text-[#555]'
    default:
      return 'bg-[#f8f8f8] text-[#444] dark:bg-[#333] dark:text-[#bbbbbb]'
  }
}

const sizeStyles = {
  sm: 'text-[10px] px-1.5 py-0.5 rounded',
  md: 'text-xs px-2 py-1 rounded-md',
}

export function Badge({
  label,
  variant = 'default',
  priority,
  status,
  size = 'sm',
  className = '',
}: BadgeProps) {
  let colorStyles = 'bg-[#f8f8f8] text-[#777] dark:bg-[#333] dark:text-[#999]'

  if (variant === 'priority' && priority) {
    colorStyles = priorityStyles(priority)
  } else if (variant === 'status' && status) {
    colorStyles = statusStyles(status)
  } else if (variant === 'tag') {
    colorStyles = 'bg-[#efefef] text-[#444] dark:bg-[#444] dark:text-[#efefef]'
  }

  return (
    <span
      className={`
        inline-flex items-center font-medium tracking-tight
        ${colorStyles}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {label}
    </span>
  )
}

// ============================
// Priority Badge (convenience)
// ============================

interface PriorityBadgeProps {
  priority: Priority
  className?: string
}

const priorityLabels: Record<Priority, string> = {
  [Priority.Critical]: '!! Critical',
  [Priority.High]: '! High',
  [Priority.Medium]: 'Medium',
  [Priority.Low]: 'Low',
  [Priority.None]: '',
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  if (priority === Priority.None) return null

  return (
    <Badge
      label={priorityLabels[priority]}
      variant="priority"
      priority={priority}
      className={className}
    />
  )
}
