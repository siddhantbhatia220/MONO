'use client'

/**
 * MONO — Productivity Insights Dashboard Modal
 *
 * Visual analytics dashboard featuring completion velocity, habit streaks,
 * priority distribution, and actionable local intelligence insights.
 */
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Flame,
  CheckCircle2,
  Tag,
  Calendar,
  Sparkles,
  BarChart2,
  PieChart,
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { useItemStore } from '@/lib/store/itemStore'
import { useUIStore } from '@/lib/store/uiStore'
import { calculateProductivityInsights } from '@/lib/intelligence/productivityInsights'

export function InsightsDashboardModal() {
  const { activeModal, closeModal } = useUIStore()
  const { items } = useItemStore()

  const allItems = useMemo(() => Object.values(items), [items])
  const stats = useMemo(() => calculateProductivityInsights(allItems), [allItems])

  if (activeModal !== 'insights') return null

  return (
    <Modal
      open={activeModal === 'insights'}
      onClose={closeModal}
      title="Productivity Insights & Intelligence"
      size="lg"
    >
      <div className="space-y-6">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="flex items-center space-x-2 text-neutral-500 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium">Completion</span>
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
              {stats.completionRate}%
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {stats.completedItems} of {stats.totalItems} items done
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="flex items-center space-x-2 text-neutral-500 mb-1">
              <Flame className="w-4 h-4 text-neutral-900 dark:text-white" />
              <span className="text-xs font-medium">Habit Streak</span>
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
              {stats.activeHabitStreak} days
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">Active habit rhythm</p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="flex items-center space-x-2 text-neutral-500 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Weekly Velocity</span>
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
              {stats.itemsCompletedThisWeek}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">Completed last 7 days</p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="flex items-center space-x-2 text-neutral-500 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium">Peak Day</span>
            </div>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 truncate">
              {stats.peakDay}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">Most active day</p>
          </div>
        </div>

        {/* Priority Breakdown & Top Tag */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <PieChart className="w-4 h-4" />
              Priority Distribution
            </h4>
            <div className="space-y-2">
              {Object.entries(stats.priorityBreakdown).map(([prio, count]) => {
                const pct = stats.totalItems > 0 ? Math.round((count / stats.totalItems) * 100) : 0
                return (
                  <div key={prio} className="space-y-1">
                    <div className="flex justify-between text-xs capitalize text-neutral-600 dark:text-neutral-400">
                      <span>{prio}</span>
                      <span className="font-mono">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 dark:bg-neutral-100 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                Primary Focus Area
              </h4>
              {stats.topTag ? (
                <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800 text-center">
                  <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    #{stats.topTag.tag}
                  </span>
                  <p className="text-xs text-neutral-500 mt-1 font-mono">
                    {stats.topTag.count} associated items
                  </p>
                </div>
              ) : (
                <p className="text-xs text-neutral-500 italic py-4 text-center">
                  Add tags to your items to discover your primary focus area.
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 text-center font-mono">
              100% On-Device Intelligence • Local Privacy
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-neutral-900 dark:text-white" />
            Smart Recommendations
          </h4>
          <div className="space-y-2">
            {stats.recommendations.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 flex items-start space-x-2"
              >
                <span className="font-bold text-neutral-900 dark:text-white shrink-0">•</span>
                <span>{rec}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
