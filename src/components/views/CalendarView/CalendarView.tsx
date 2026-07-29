'use client'

/**
 * MONO — Calendar View Component
 *
 * Full interactive month view powered by date-fns.
 * Maps universal items with due dates directly onto the calendar grid.
 */
import React, { useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Item } from '@/lib/types/item'
import { Button } from '@/components/ui/Button'
import { CalendarDayCell } from './CalendarDayCell'

interface CalendarViewProps {
  items: Item[]
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarView({ items }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const handleToday = () => setCurrentMonth(new Date())

  return (
    <div className="flex flex-col flex-1 h-full p-4 md:p-6 overflow-hidden">
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-lg md:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleToday}>
            Today
          </Button>
          <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-t border-l border-zinc-200/60 dark:border-zinc-800/60">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 bg-zinc-50 dark:bg-zinc-900 border-r border-b border-zinc-200/60 dark:border-zinc-800/60"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 flex-1 overflow-y-auto border-l border-zinc-200/60 dark:border-zinc-800/60">
        {days.map((date) => {
          const dayItems = items.filter((item) => {
            if (!item.dueDate) return false
            return isSameDay(new Date(item.dueDate), date)
          })

          return (
            <CalendarDayCell
              key={date.toISOString()}
              date={date}
              isCurrentMonth={isSameMonth(date, currentMonth)}
              items={dayItems}
            />
          )
        })}
      </div>
    </div>
  )
}
