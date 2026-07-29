/**
 * MONO — Recurring Item Recurrence Calculation Engine
 *
 * Compute next scheduled due dates for recurring items.
 */
import { addDays, addMonths, addWeeks, isWeekend } from 'date-fns'

export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'weekdays'

/**
 * Calculate the next due date based on current date and recurrence pattern.
 */
export function calculateNextDueDate(
  currentDate: Date | string = new Date(),
  pattern: RecurrencePattern
): Date {
  const base = typeof currentDate === 'string' ? new Date(currentDate) : currentDate

  switch (pattern) {
    case 'daily':
      return addDays(base, 1)

    case 'weekly':
      return addWeeks(base, 1)

    case 'monthly':
      return addMonths(base, 1)

    case 'weekdays': {
      let next = addDays(base, 1)
      while (isWeekend(next)) {
        next = addDays(next, 1)
      }
      return next
    }

    default:
      return addDays(base, 1)
  }
}
