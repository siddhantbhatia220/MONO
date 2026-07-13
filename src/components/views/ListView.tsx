'use client'

/**
 * MONO — List View
 * The primary item view. Virtualization-ready, animated, grouped.
 */

import React, { useEffect, useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ItemRow } from '@/components/items/ItemRow'
import { EmptyState } from '@/components/views/EmptyState'
import { useUIStore } from '@/lib/store/uiStore'
import { useItemStore } from '@/lib/store/itemStore'
import { useAppStore } from '@/lib/store/appStore'
import { listItems } from '@/lib/db/items'
import { ItemStatus } from '@/lib/types/item'
import type { Item } from '@/lib/types/item'

const SKELETON_WIDTHS = ['45%', '72%', '38%', '60%', '55%']

// Loading skeleton
function ItemSkeleton({ index }: { index: number }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2 animate-pulse">
      <div className="w-4 h-4 rounded bg-zinc-200 dark:bg-zinc-800 flex-shrink-0" />
      <div className="h-3 rounded bg-zinc-200 dark:bg-zinc-800 flex-1" style={{ maxWidth: SKELETON_WIDTHS[index % SKELETON_WIDTHS.length] }} />
    </div>
  )
}

export function ListView() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { activeWorkspace, activeProject, preferences } = useAppStore()
  const { openModal } = useUIStore()

  const loadItems = useCallback(async () => {
    if (!activeWorkspace) {
      setItems([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const fetched = await listItems({
        workspaceId: activeWorkspace.id,
        projectId: activeProject?.id,
        parentId: null, // Only top-level items
        ...(preferences.showCompleted ? {} : { status: ItemStatus.Active }),
      })
      setItems(fetched)
    } finally {
      setLoading(false)
    }
  }, [activeWorkspace, activeProject, preferences.showCompleted])

  // Load on mount and when context changes.
  // Data-fetching that sets state is the correct use of useEffect.
  useEffect(() => {
    void loadItems() // eslint-disable-line react-hooks/set-state-in-effect
  }, [loadItems])

  // Listen for item store updates to refresh
  useEffect(() => {
    const unsubscribe = useItemStore.subscribe(() => {
      void loadItems()
    })
    return unsubscribe
  }, [loadItems])

  if (!activeWorkspace) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState
          variant="no-workspace"
          action={{
            label: 'Create Workspace',
            onClick: () => openModal('create-workspace'),
          }}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="px-4 pt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <ItemSkeleton key={i} index={i} />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState variant="no-items" />
      </div>
    )
  }

  return (
    <div
      role="list"
      aria-label="Items"
      className="px-0 pt-2 pb-4 flex flex-col gap-0.5"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            onSelect={setSelectedId}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
