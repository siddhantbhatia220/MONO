'use client'

/**
 * MONO — Batch Operations Action Bar
 *
 * Floating action bar for multi-selected items.
 * Supports Bulk Complete, Bulk Delete, and Selection Reset.
 */
import React from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Trash2, X } from 'lucide-react'

import { deleteItem, updateItem } from '@/lib/db/items'
import { useItemStore } from '@/lib/store/itemStore'
import { useUIStore } from '@/lib/store/uiStore'
import { ItemStatus } from '@/lib/types/item'

export function BatchActionBar() {
  const { selectedItemIds, clearSelection, addToast } = useUIStore()
  const { items, upsertItem, removeItem } = useItemStore()

  const count = selectedItemIds.size
  if (count === 0) return null

  const handleBulkComplete = async () => {
    const ids = Array.from(selectedItemIds)
    try {
      for (const id of ids) {
        const existing = items[id]
        if (!existing) continue
        const updated = {
          ...existing,
          status: ItemStatus.Completed,
          completedAt: new Date().toISOString(),
        }
        upsertItem(updated)
        await updateItem(id, {
          status: ItemStatus.Completed,
          completedAt: updated.completedAt,
        })
      }
      addToast({ message: `Completed ${count} items`, type: 'success' })
      clearSelection()
    } catch (err) {
      console.error('Batch complete failed:', err)
      addToast({ message: 'Failed to complete items', type: 'error' })
    }
  }

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedItemIds)
    try {
      for (const id of ids) {
        removeItem(id)
        await deleteItem(id)
      }
      addToast({ message: `Deleted ${count} items`, type: 'info' })
      clearSelection()
    } catch (err) {
      console.error('Batch delete failed:', err)
      addToast({ message: 'Failed to delete items', type: 'error' })
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="
          fixed bottom-20 left-1/2 -translate-x-1/2 z-[400]
          flex items-center gap-3 px-4 py-2.5
          bg-zinc-900 dark:bg-white text-white dark:text-zinc-900
          rounded-2xl shadow-2xl border border-zinc-800 dark:border-zinc-200
        "
      >
        <span className="text-xs font-semibold px-2 py-0.5 bg-zinc-800 dark:bg-zinc-200 rounded-full tabular-nums">
          {count} selected
        </span>

        <div className="h-4 w-px bg-zinc-700 dark:bg-zinc-300" />

        {/* Complete */}
        <button
          type="button"
          onClick={handleBulkComplete}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Complete</span>
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={handleBulkDelete}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer text-zinc-300 dark:text-zinc-700 hover:text-white dark:hover:text-black"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>

        <div className="h-4 w-px bg-zinc-700 dark:bg-zinc-300" />

        {/* Clear selection */}
        <button
          type="button"
          onClick={clearSelection}
          className="p-1 hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
          aria-label="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
