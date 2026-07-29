'use client'

/**
 * MONO — Calendar Day Cell
 *
 * Renders a single date cell inside the month calendar grid.
 * Highlights current day, displays item pills, and handles item selection.
 */
import React from 'react'
import { isSameDay, isToday } from 'date-fns'
import { Item, ItemStatus } from '@/lib/types/item'
import { useUIStore } from '@/lib/store/uiStore'

interface CalendarDayCellProps {
  date: Date
  isCurrentMonth: boolean
  items: Item[]
}

export function CalendarDayCell({ date, isCurrentMonth, items }: CalendarDayCellProps) {
  const { openItemDetail } = useUIStore()
  const today = isToday(date)

  return (
    <div
      className={`
        flex flex-col min-h-[90px] md:min-h-[110px] p-1.5 md:p-2 border border-zinc-200/60 dark:border-zinc-800/60
        bg-white dark:bg-zinc-950 transition-colors
        ${!isCurrentMonth ? 'opacity-35 bg-zinc-50/50 dark:bg-zinc-900/30' : ''}
      `}
    >
      {/* Date Header */}
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={`
            text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full
            ${
              today
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold'
                : 'text-zinc-700 dark:text-zinc-300'
            }
          `}
        >
          {date.getDate()}
        </span>
        {items.length > 0 && (
          <span className="text-[10px] font-medium text-zinc-400">{items.length}</span>
        )}
      </div>

      {/* Item Badges */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {items.slice(0, 3).map((item) => {
          const isDone = item.status === ItemStatus.Completed
          return (
            <button
              key={item.id}
              onClick={() => openItemDetail(item.id)}
              className={`
                w-full text-left px-1.5 py-0.5 rounded text-[11px] font-medium truncate
                border transition-all cursor-pointer
                ${
                  isDone
                    ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-800 line-through'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                }
              `}
            >
              {item.title}
            </button>
          )
        })}

        {items.length > 3 && (
          <div className="text-[10px] font-medium text-zinc-400 pl-1">
            +{items.length - 3} more
          </div>
        )}
      </div>
    </div>
  )
}
