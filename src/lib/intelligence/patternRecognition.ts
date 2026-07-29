/**
 * MONO — Local Pattern Recognition Engine
 *
 * Discovers user work patterns from historical IndexedDB items.
 * Computes tag co-occurrence matrix and optimal completion day recommendations.
 */
import type { Item } from '@/lib/types/item'

export interface TagCoOccurrence {
  tag: string
  relatedTags: { tag: string; score: number }[]
}

export interface CompletionPattern {
  dayOfWeek: string
  count: number
  percentage: number
}

/**
 * Computes tag co-occurrence relationships across all items.
 */
export function analyzeTagPatterns(items: Item[]): TagCoOccurrence[] {
  const coMap: Record<string, Record<string, number>> = {}

  items.forEach((item) => {
    const tags = item.tags || []
    for (let i = 0; i < tags.length; i++) {
      for (let j = 0; j < tags.length; j++) {
        if (i === j) continue
        const t1 = tags[i]
        const t2 = tags[j]
        if (!coMap[t1]) coMap[t1] = {}
        coMap[t1][t2] = (coMap[t1][t2] || 0) + 1
      }
    }
  })

  return Object.entries(coMap).map(([tag, related]) => {
    const sorted = Object.entries(related)
      .map(([relTag, score]) => ({ tag: relTag, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    return {
      tag,
      relatedTags: sorted,
    }
  })
}

/**
 * Analyzes historical completion timestamps by day of week.
 */
export function analyzeCompletionDays(items: Item[]): CompletionPattern[] {
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const counts: Record<string, number> = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  }

  let totalCompleted = 0

  items.forEach((item) => {
    if (item.status === 'completed' && item.completedAt) {
      const date = new Date(item.completedAt)
      const dayName = DAYS[date.getDay()]
      if (dayName) {
        counts[dayName] = (counts[dayName] || 0) + 1
        totalCompleted++
      }
    }
  })

  return DAYS.map((day) => ({
    dayOfWeek: day,
    count: counts[day] || 0,
    percentage: totalCompleted > 0 ? Math.round(((counts[day] || 0) / totalCompleted) * 100) : 0,
  }))
}

/**
 * Predicts the optimal due date string (YYYY-MM-DD) based on most active completion day.
 */
export function predictOptimalDueDate(items: Item[]): string {
  const patterns = analyzeCompletionDays(items)
  const bestDayPattern = [...patterns].sort((a, b) => b.count - a.count)[0]

  const today = new Date()
  if (!bestDayPattern || bestDayPattern.count === 0) {
    // Default to tomorrow
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().slice(0, 10)
  }

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const targetDayIndex = DAYS.indexOf(bestDayPattern.dayOfWeek)

  const resultDate = new Date(today)
  let daysUntil = (targetDayIndex - today.getDay() + 7) % 7
  if (daysUntil === 0) daysUntil = 7
  resultDate.setDate(resultDate.getDate() + daysUntil)

  return resultDate.toISOString().slice(0, 10)
}
