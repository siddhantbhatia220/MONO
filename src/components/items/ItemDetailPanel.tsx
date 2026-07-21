'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Calendar, AlertCircle, Tag } from 'lucide-react'
import { useUIStore } from '@/lib/store/uiStore'
import { useItemStore } from '@/lib/store/itemStore'
import {
  getItem,
  updateItem,
  deleteItem,
  listSubItems,
  createSubItem,
  updateSubItem,
  deleteSubItem,
} from '@/lib/db/items'
import { Priority, type Item, type SubItem } from '@/lib/types/item'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'

export function ItemDetailPanel() {
  const { detailItemId, closeItemDetail, addToast } = useUIStore()
  const { items, upsertItem, removeItem } = useItemStore()
  
  const [item, setItem] = useState<Item | null>(null)
  const [notes, setNotes] = useState('')
  const [newTag, setNewTag] = useState('')
  const [subItems, setSubItems] = useState<SubItem[]>([])
  const [newSubTitle, setNewSubTitle] = useState('')
  // Load item and sub-items when detailItemId changes
  const loadItemDetails = useCallback(async () => {
    if (!detailItemId) {
      setItem(null)
      return
    }
    try {
      // First try store cache
      const cached = items[detailItemId]
      if (cached) {
        setItem(cached)
        setNotes(cached.notes ?? '')
      } else {
        const fetched = await getItem(detailItemId)
        setItem(fetched)
        setNotes(fetched?.notes ?? '')
      }

      // Fetch sub-items
      const subs = await listSubItems(detailItemId)
      setSubItems(subs)
    } catch (err) {
      console.error('Failed to load item details', err)
    }
  }, [detailItemId, items])

  useEffect(() => {
    void loadItemDetails() // eslint-disable-line react-hooks/set-state-in-effect
  }, [loadItemDetails])

  // Sync cache changes back to local item state
  useEffect(() => {
    if (detailItemId && items[detailItemId]) {
      setItem(items[detailItemId]) // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [items, detailItemId])

  const handleTitleChange = async (newTitle: string) => {
    if (!item || !newTitle.trim()) return
    try {
      const updated = await updateItem(item.id, { title: newTitle.trim() })
      if (updated) {
        upsertItem(updated)
        setItem(updated)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleNotesBlur = async () => {
    if (!item) return
    if (notes === (item.notes ?? '')) return
    try {
      const updated = await updateItem(item.id, { notes: notes.trim() || undefined })
      if (updated) {
        upsertItem(updated)
        setItem(updated)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handlePriorityChange = async (priority: Priority) => {
    if (!item) return
    try {
      const updated = await updateItem(item.id, { priority })
      if (updated) {
        upsertItem(updated)
        setItem(updated)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!item) return
    const val = e.target.value
    try {
      const dueDate = val ? new Date(val).toISOString() : undefined
      const updated = await updateItem(item.id, { dueDate })
      if (updated) {
        upsertItem(updated)
        setItem(updated)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item || !newTag.trim()) return
    const tag = newTag.trim().toLowerCase()
    if (item.tags.includes(tag)) {
      setNewTag('')
      return
    }

    try {
      const tags = [...item.tags, tag]
      const updated = await updateItem(item.id, { tags })
      if (updated) {
        upsertItem(updated)
        setItem(updated)
        setNewTag('')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!item) return
    try {
      const tags = item.tags.filter((t) => t !== tagToRemove)
      const updated = await updateItem(item.id, { tags })
      if (updated) {
        upsertItem(updated)
        setItem(updated)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteItem = async () => {
    if (!item) return
    try {
      await deleteItem(item.id)
      removeItem(item.id)
      addToast({ message: 'Item deleted', type: 'info', duration: 2500 })
      closeItemDetail()
    } catch (err) {
      console.error(err)
      addToast({ message: 'Failed to delete item', type: 'error' })
    }
  }

  // Sub-items operations
  const handleAddSubItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item || !newSubTitle.trim()) return
    try {
      const sub = await createSubItem(item.id, newSubTitle.trim())
      setSubItems((prev) => [...prev, sub])
      setNewSubTitle('')
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleSubItem = async (id: string, checked: boolean) => {
    try {
      const updated = await updateSubItem(id, { completed: checked })
      if (updated) {
        setSubItems((prev) => prev.map((si) => (si.id === id ? updated : si)))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteSubItem = async (id: string) => {
    try {
      await deleteSubItem(id)
      setSubItems((prev) => prev.filter((si) => si.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (!detailItemId) return null

  return (
    <AnimatePresence>
      {item && (
        <div
          key="item-detail-drawer"
          className="fixed inset-0 z-[280] flex justify-end overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Item details"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeItemDetail}
            className="fixed inset-0 bg-black/25 dark:bg-black/50 backdrop-blur-sm z-[290]"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="
              relative z-[300] w-full sm:max-w-[460px] h-full flex flex-col
              bg-white dark:bg-[#0c0c0e]
              border-l border-zinc-200 dark:border-zinc-800
              shadow-2xl overflow-hidden
            "
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-zinc-100 dark:border-zinc-800/60 flex-shrink-0">
              <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-650">
                Item Details
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteItem}
                  aria-label="Delete item"
                  className="h-8 w-8 text-zinc-400 hover:text-red-650 dark:hover:text-red-400"
                >
                  <Trash2 size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeItemDetail}
                  aria-label="Close panel"
                  className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-150"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* Scrollable details content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6 pb-24">
              {/* Title input */}
              <div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => setItem({ ...item, title: e.target.value })}
                  onBlur={(e) => handleTitleChange(e.target.value)}
                  className="
                    w-full bg-transparent text-xl font-bold tracking-tight
                    text-zinc-900 dark:text-zinc-50 border-none outline-none p-0
                    placeholder:text-zinc-300 dark:placeholder:text-zinc-700
                  "
                  placeholder="Untitled Item"
                  aria-label="Item title"
                />
              </div>

              {/* Attributes (Date & Priority) */}
              <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-zinc-100 dark:border-zinc-800/60">
                {/* Due Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-505 flex items-center gap-1.5">
                    <Calendar size={11} /> Due Date
                  </label>
                  <input
                    type="date"
                    value={item.dueDate ? item.dueDate.split('T')[0] : ''}
                    onChange={handleDateChange}
                    className="
                      bg-zinc-50 dark:bg-zinc-900/60
                      border border-zinc-200 dark:border-zinc-800
                      rounded-lg px-2.5 py-1.5 text-xs font-semibold
                      text-zinc-800 dark:text-zinc-200 outline-none
                    "
                    aria-label="Due date picker"
                  />
                </div>

                {/* Priority */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-505 flex items-center gap-1.5">
                    <AlertCircle size={11} /> Priority
                  </label>
                  <select
                    value={item.priority}
                    onChange={(e) => handlePriorityChange(e.target.value as Priority)}
                    className="
                      bg-zinc-50 dark:bg-zinc-900/60
                      border border-zinc-200 dark:border-zinc-800
                      rounded-lg px-2.5 py-1.5 text-xs font-semibold
                      text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer
                    "
                    aria-label="Priority dropdown"
                  >
                    <option value={Priority.None}>None</option>
                    <option value={Priority.Low}>Low</option>
                    <option value={Priority.Medium}>Medium</option>
                    <option value={Priority.High}>High</option>
                    <option value={Priority.Critical}>Critical</option>
                  </select>
                </div>
              </div>

              {/* Description / Notes */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-505">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={handleNotesBlur}
                  placeholder="Write a description or detail notes here..."
                  className="
                    w-full min-h-[100px] p-3 rounded-xl border border-zinc-200 dark:border-zinc-800
                    bg-transparent text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 outline-none
                    resize-y placeholder:text-zinc-300 dark:placeholder:text-zinc-700
                  "
                  aria-label="Item notes"
                />
              </div>

              {/* Tags Section */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-505 flex items-center gap-1.5">
                  <Tag size={11} /> Tags
                </label>
                
                {/* Tag chips */}
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="
                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold
                        bg-zinc-100 dark:bg-zinc-900 text-zinc-750 dark:text-zinc-200
                      "
                    >
                      #{t}
                      <button
                        onClick={() => handleRemoveTag(t)}
                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex-shrink-0 cursor-pointer"
                        aria-label={`Remove tag ${t}`}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  {item.tags.length === 0 && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-650 italic">No tags</span>
                  )}
                </div>

                {/* Add Tag input */}
                <form onSubmit={handleAddTag} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="
                      flex-1 bg-transparent border border-zinc-200 dark:border-zinc-800
                      rounded-lg px-2.5 py-1.5 text-xs outline-none text-zinc-850 dark:text-zinc-100
                      placeholder:text-zinc-300 dark:placeholder:text-zinc-700
                    "
                    aria-label="Add new tag"
                  />
                  <Button type="submit" variant="outline" size="sm" className="h-8 cursor-pointer">
                    Add
                  </Button>
                </form>
              </div>

              {/* Sub-items / Checklist */}
              <div className="flex flex-col gap-2 border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
                <label className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-505">
                  Checklist
                </label>

                {/* Checklist list */}
                <div className="flex flex-col gap-1.5 my-1">
                  {subItems.map((si) => (
                    <div
                      key={si.id}
                      className="
                        group/sub flex items-center justify-between px-2.5 py-2 rounded-lg
                        hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all duration-75
                      "
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Checkbox
                          checked={si.completed}
                          onChange={(checked) => handleToggleSubItem(si.id, checked)}
                          size="sm"
                          aria-label={`Mark subtask "${si.title}" as completed`}
                        />
                        <span
                          className={`
                            text-xs font-medium truncate
                            ${si.completed
                              ? 'line-through text-zinc-400 dark:text-zinc-650'
                              : 'text-zinc-800 dark:text-zinc-200'
                            }
                          `}
                        >
                          {si.title}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteSubItem(si.id)}
                        className="
                          opacity-0 group-hover/sub:opacity-100 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800
                          text-zinc-400 hover:text-zinc-805 dark:hover:text-zinc-200 transition-all cursor-pointer
                        "
                        aria-label="Delete subtask"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {subItems.length === 0 && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-650 italic px-2">No sub-items yet</span>
                  )}
                </div>

                {/* Add SubItem input */}
                <form onSubmit={handleAddSubItem} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add checklist item..."
                    value={newSubTitle}
                    onChange={(e) => setNewSubTitle(e.target.value)}
                    className="
                      flex-1 bg-transparent border border-zinc-200 dark:border-zinc-800
                      rounded-lg px-2.5 py-1.5 text-xs outline-none text-zinc-850 dark:text-zinc-100
                      placeholder:text-zinc-300 dark:placeholder:text-zinc-700
                    "
                    aria-label="Add new subtask"
                  />
                  <Button type="submit" variant="outline" size="sm" className="h-8 cursor-pointer">
                    Add
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
