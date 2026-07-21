/**
 * MONO — Item Store (Zustand)
 *
 * Manages in-memory item cache with optimistic updates.
 * The DB is the source of truth; this store is the fast read layer.
 */
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import type { Item } from '@/lib/types/item'

interface ItemState {
  // ---- Cache ----
  items: Record<string, Item>
  /** IDs of items currently being optimistically updated */
  pendingIds: Set<string>

  // ---- Undo/Redo ----
  history: Item[][]
  historyIndex: number

  // ---- Actions ----
  setItems: (items: Item[]) => void
  upsertItem: (item: Item) => void
  removeItem: (id: string) => void
  pushHistory: (snapshot: Item[]) => void
  undo: () => Item[] | null
  redo: () => Item[] | null
}

export const useItemStore = create<ItemState>()(
  devtools(
    (set, get) => ({
      items: {},
      pendingIds: new Set(),
      history: [],
      historyIndex: -1,

      setItems: (items) => {
        const itemMap = Object.fromEntries(items.map((item) => [item.id, item]))
        set({ items: itemMap }, false, 'setItems')
      },

      upsertItem: (item) =>
        set((state) => ({ items: { ...state.items, [item.id]: item } }), false, 'upsertItem'),

      removeItem: (id) =>
        set(
          (state) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [id]: _removed, ...rest } = state.items
            return { items: rest }
          },
          false,
          'removeItem'
        ),

      pushHistory: (snapshot) => {
        const { history, historyIndex } = get()
        // Truncate forward history on new action
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(snapshot)

        // Cap history at 50 states
        if (newHistory.length > 50) newHistory.shift()

        set({ history: newHistory, historyIndex: newHistory.length - 1 }, false, 'pushHistory')
      },

      undo: () => {
        const { historyIndex, history } = get()
        if (historyIndex <= 0) return null
        const newIndex = historyIndex - 1
        set({ historyIndex: newIndex }, false, 'undo')
        return history[newIndex]
      },

      redo: () => {
        const { historyIndex, history } = get()
        if (historyIndex >= history.length - 1) return null
        const newIndex = historyIndex + 1
        set({ historyIndex: newIndex }, false, 'redo')
        return history[newIndex]
      },
    }),
    { name: 'MONO/ItemStore' }
  )
)
