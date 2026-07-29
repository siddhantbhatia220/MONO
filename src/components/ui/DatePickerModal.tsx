'use client'

/**
 * MONO — Date Picker Modal & Popover
 *
 * Provides quick date presets (Today, Tomorrow, Next Week)
 * and an explicit calendar grid for item scheduling.
 */
import React from 'react'

import { addDays, addWeeks, format, startOfToday } from 'date-fns'
import { Calendar, Clock, X } from 'lucide-react'

import { Modal } from './Modal'

interface DatePickerModalProps {
  open: boolean
  onClose: () => void
  selectedDate?: string
  onSelectDate: (dateIso?: string) => void
}

export function DatePickerModal({
  open,
  onClose,
  selectedDate: _selectedDate,
  onSelectDate,
}: DatePickerModalProps) {
  const today = startOfToday()
  const tomorrow = addDays(today, 1)
  const nextWeek = addWeeks(today, 1)

  const handleSelect = (d?: Date) => {
    onSelectDate(d ? d.toISOString() : undefined)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Set Due Date"
      description="Schedule when this item should be done."
      size="sm"
    >
      <div className="flex flex-col gap-4 py-2">
        {/* Quick Presets */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleSelect(today)}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 text-left transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4 text-zinc-500" />
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Today</div>
              <div className="text-[10px] text-zinc-400">{format(today, 'MMM d')}</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelect(tomorrow)}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 text-left transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-zinc-500" />
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Tomorrow</div>
              <div className="text-[10px] text-zinc-400">{format(tomorrow, 'MMM d')}</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelect(nextWeek)}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 text-left transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-zinc-500" />
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Next Week
              </div>
              <div className="text-[10px] text-zinc-400">{format(nextWeek, 'MMM d')}</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelect(undefined)}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 text-left transition-all cursor-pointer text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <X className="w-4 h-4" />
            <div>
              <div className="text-xs font-semibold">No Date</div>
              <div className="text-[10px]">Clear due date</div>
            </div>
          </button>
        </div>

        {/* Custom Input */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Custom Date
          </label>
          <input
            type="date"
            onChange={(e) => {
              if (e.target.value) {
                handleSelect(new Date(e.target.value))
              }
            }}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden text-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>
    </Modal>
  )
}
