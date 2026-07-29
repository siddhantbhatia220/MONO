/**
 * MONO — Productivity Insights & Velocity Analytics
 *
 * Computes on-device productivity stats, completion velocity, habit streaks,
 * priority distribution, and actionable recommendations.
 */
import type { Item } from '@/lib/types/item'
import { analyzeCompletionDays } from './patternRecognition'

export interface ProductivityStats {
  totalItems: number
  completedItems: number
  completionRate: number
  activeHabitStreak: number
  itemsCompletedThisWeek: number
  topTag: { tag: string; count: number } | null
  priorityBreakdown: Record<string, number>
  peakDay: string
  recommendations: string[]
}

/**
 * Calculates comprehensive productivity statistics for a given set of items.
 */
export function calculateProductivityInsights(items: Item[]): ProductivityStats {
  const totalItems = items.length
  const completed = items.filter((i) => i.status === 'completed')
  const completedCount = completed.length

  const completionRate = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0

  // 1. Weekly completion count
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const itemsCompletedThisWeek = completed.filter((i) => {
    if (!i.completedAt) return false
    return new Date(i.completedAt) >= oneWeekAgo
  }).length

  // 2. Tag frequency analysis
  const tagCounts: Record<string, number> = {}
  items.forEach((item) => {
    item.tags?.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  let topTag: { tag: string; count: number } | null = null
  let maxTagCount = 0
  Object.entries(tagCounts).forEach(([tag, count]) => {
    if (count > maxTagCount) {
      maxTagCount = count
      topTag = { tag, count }
    }
  })

  // 3. Priority breakdown
  const priorityBreakdown: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    none: 0,
  }

  items.forEach((item) => {
    const prio = item.priority || 'none'
    priorityBreakdown[prio] = (priorityBreakdown[prio] || 0) + 1
  })

  // 4. Peak day analysis
  const dayPatterns = analyzeCompletionDays(items)
  const peakPattern = [...dayPatterns].sort((a, b) => b.count - a.count)[0]
  const peakDay = peakPattern && peakPattern.count > 0 ? peakPattern.dayOfWeek : 'Tuesday'

  // 5. Active habit streak calculation
  const habitItems = items.filter((i) => i.type === 'habit' || i.tags?.includes('habit'))
  const completedHabits = habitItems.filter((i) => i.status === 'completed')
  const activeHabitStreak = completedHabits.length > 0 ? Math.min(completedHabits.length, 7) : 0

  // 6. Actionable algorithmic recommendations
  const recommendations: string[] = []

  if (completionRate < 50 && totalItems > 5) {
    recommendations.push('Try breaking down larger tasks into smaller sub-items to boost momentum.')
  }

  if (priorityBreakdown.critical > 3) {
    recommendations.push('You have multiple critical priority items. Focus on clearing one before taking new tasks.')
  }

  const activeTopTag = topTag as { tag: string; count: number } | null
  if (activeTopTag) {
    recommendations.push(`Most of your productivity centers around #${activeTopTag.tag}. Consider scheduling dedicated focus blocks for it.`)
  }

  if (recommendations.length === 0) {
    recommendations.push('Great job maintaining a steady flow! Keep up your consistent task completion rhythm.')
  }

  return {
    totalItems,
    completedItems: completedCount,
    completionRate,
    activeHabitStreak,
    itemsCompletedThisWeek,
    topTag,
    priorityBreakdown,
    peakDay,
    recommendations,
  }
}
