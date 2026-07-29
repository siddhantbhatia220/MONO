'use client'

/**
 * MONO — Tag Manager Modal
 *
 * Manage, rename, and merge tags across all items in the workspace.
 */
import React, { useState } from 'react'

import { Edit2, Tag } from 'lucide-react'

import { renameTagInWorkspace } from '@/lib/db/tags'
import { useAppStore } from '@/lib/store/appStore'
import { useItemStore } from '@/lib/store/itemStore'
import { useUIStore } from '@/lib/store/uiStore'

import { Modal } from '@/components/ui/Modal'

export function TagManagerModal() {
  const { activeModal, closeModal, addToast } = useUIStore()
  const { activeWorkspace } = useAppStore()
  const { items, upsertItem } = useItemStore()

  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [newTagName, setNewTagName] = useState('')

  // Calculate tag counts
  const tagCounts: Record<string, number> = {}
  Object.values(items).forEach((item) => {
    item.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  const tagList = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])

  const handleRename = async (oldTag: string) => {
    if (!activeWorkspace || !newTagName.trim()) return
    try {
      const updatedItems = await renameTagInWorkspace(activeWorkspace.id, oldTag, newTagName.trim())
      updatedItems.forEach((updated) => upsertItem(updated))
      addToast({ message: `Renamed #${oldTag} to #${newTagName.trim()}`, type: 'success' })
      setEditingTag(null)
      setNewTagName('')
    } catch (err) {
      console.error(err)
      addToast({ message: 'Failed to rename tag', type: 'error' })
    }
  }

  return (
    <Modal
      open={activeModal === ('manage-tags' as unknown as string)}
      onClose={closeModal}
      title="Manage Tags"
      description="Rename or organize tags across your workspace."
      size="md"
    >
      <div className="flex flex-col gap-3 py-2 max-h-[400px] overflow-y-auto">
        {tagList.map(([tag, count]) => (
          <div
            key={tag}
            className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">#{tag}</span>
              <span className="text-[11px] font-medium text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded-full tabular-nums">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
            </div>

            {editingTag === tag ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="New tag name..."
                  className="px-2 py-1 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-hidden"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => handleRename(tag)}
                  className="px-2.5 py-1 text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md cursor-pointer"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditingTag(tag)
                  setNewTagName(tag)
                }}
                className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                title="Rename Tag"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}

        {tagList.length === 0 && (
          <div className="p-6 text-center text-xs text-zinc-400">No tags found in workspace</div>
        )}
      </div>
    </Modal>
  )
}
