'use client'

/**
 * MONO — Timeline (Gantt) View Component
 *
 * Interactive horizontal Gantt schedule view displaying scheduled
 * items along a date axis with status badges and item detail triggers.
 */
import React from 'react'
import {
  addDays,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  startOfWeek,
} from 'date-fns'
import { Item, ItemStatus } from '@/lib/types/item'
import { useUIStore } from '@/lib/store/uiStore'

interface TimelineViewProps {
  items: Item[]
}

export function TimelineView({ items }: TimelineViewProps) {
  const { openItemDetail } = useUIStore()

  // Generate 14-day window starting from start of current week
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 })
  const endDate = addDays(startDate, 13)
  const timelineDays = eachDayOfInterval({ start: startDate, end: endDate })

  return (
    <div className="flex-1 overflow-x-auto p-4 md:p-6">
      <div className="min-w-[800px] border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
        {/* Timeline Header Row (Days) */}
        <div className="grid grid-cols-14 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          {timelineDays.map((day) => {
            const today = isToday(day)
            return (
              <div
                key={day.toISOString()}
                className={`
                  p-2 text-center border-r border-zinc-200/60 dark:border-zinc-800/60 last:border-r-0
                  ${today ? 'bg-zinc-200/50 dark:bg-zinc-800/50 font-bold' : ''}
                `}
              >
                <span className="block text-[10px] uppercase font-semibold text-zinc-400">
                  {format(day, 'EEE')}
                </span>
                <span
                  className={`
                    inline-flex items-center justify-center text-xs font-bold w-5 h-5 rounded-full mt-0.5
                    ${today ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'text-zinc-700 dark:text-zinc-300'}
                  `}
                >
                  {format(day, 'd')}
                </span>
              </div>
            )
          })}
        </div>

        {/* Timeline Item Rows */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-850">
          {items.map((item) => {
            const itemDate = item.dueDate ? new Date(item.dueDate) : new Date(item.createdAt)
            const isCompleted = item.status === ItemStatus.Completed

            return (
              <div
                key={item.id}
                onClick={() => openItemDetail(item.id)}
                className="grid grid-cols-14 items-center py-2.5 px-1 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer group"
              >
                {timelineDays.map((day) => {
                  const isScheduledDay = isSameDay(itemDate, day)

                  return (
                    <div
                      key={day.toISOString()}
                      className="h-7 px-1 flex items-center justify-center border-r border-zinc-100/40 dark:border-zinc-850/40 last:border-r-0"
                    >
                      {isScheduledDay && (
                        <div
                          className={`
                            w-full h-full rounded-lg px-2 flex items-center gap-1.5 truncate text-[11px] font-medium transition-all shadow-xs
                            ${
                              isCompleted
                                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 line-through'
                                : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold'
                            }
                          `}
                          title={item.title}
                        >
                          <span className="truncate">{item.title}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}

          {items.length === 0 && (
            <div className="p-8 text-center text-xs text-zinc-400">
              No scheduled items found on timeline
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
