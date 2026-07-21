/**
 * MONO — Date Utilities
 * Powered by date-fns (tree-shakeable, no bloat)
 */
import {
  addDays,
  endOfDay,
  format,
  formatDistanceToNow,
  isAfter,
  isBefore,
  isPast,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
  startOfDay,
} from 'date-fns'

/**
 * Format a date string for display in task rows.
 * Shows relative labels for today/tomorrow/yesterday.
 */
export function formatDueDate(isoString: string): string {
  const date = parseISO(isoString)

  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  if (isYesterday(date)) return 'Yesterday'

  // Within this year — show month + day
  if (date.getFullYear() === new Date().getFullYear()) {
    return format(date, 'MMM d')
  }

  // Different year — show full date
  return format(date, 'MMM d, yyyy')
}

/**
 * Returns true if the due date has passed and the item is not completed.
 */
export function isOverdue(isoString: string): boolean {
  return isPast(endOfDay(parseISO(isoString)))
}

/**
 * Returns true if the due date is today or in the past.
 */
export function isDueToday(isoString: string): boolean {
  return isToday(parseISO(isoString))
}

/**
 * Human-readable relative time: "3 minutes ago", "in 2 days"
 */
export function timeAgo(isoString: string): string {
  return formatDistanceToNow(parseISO(isoString), { addSuffix: true })
}

/**
 * Format for datetime-local input elements
 */
export function toDateTimeLocal(isoString: string): string {
  return format(parseISO(isoString), "yyyy-MM-dd'T'HH:mm")
}

/**
 * Get ISO string for start of today
 */
export function todayStart(): string {
  return startOfDay(new Date()).toISOString()
}

/**
 * Get ISO string for end of today
 */
export function todayEnd(): string {
  return endOfDay(new Date()).toISOString()
}

export { parseISO, addDays, isBefore, isAfter, format }
