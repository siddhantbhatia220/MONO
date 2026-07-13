/**
 * MONO — UI Store (Zustand)
 *
 * UI-only state: modals, panels, command palette, toasts.
 * Never persisted — resets on page load.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type ModalId =
  | 'create-workspace'
  | 'create-project'
  | 'item-detail'
  | 'settings'
  | 'keyboard-shortcuts'
  | null

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

interface UIState {
  // ---- Command Palette ----
  commandPaletteOpen: boolean
  commandPaletteQuery: string

  // ---- Sidebar ----
  sidebarOpen: boolean

  // ---- Modals ----
  activeModal: ModalId
  modalData: Record<string, unknown>

  // ---- Item Detail Panel ----
  detailItemId: string | null

  // ---- Toasts ----
  toasts: Toast[]

  // ---- Loading States ----
  isLoading: boolean

  // ---- Actions ----
  openCommandPalette: (query?: string) => void
  closeCommandPalette: () => void
  toggleCommandPalette: () => void
  setCommandPaletteQuery: (q: string) => void

  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  openModal: (id: ModalId, data?: Record<string, unknown>) => void
  closeModal: () => void

  openItemDetail: (itemId: string) => void
  closeItemDetail: () => void

  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void

  setLoading: (loading: boolean) => void
}

let toastCounter = 0

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      commandPaletteOpen: false,
      commandPaletteQuery: '',
      sidebarOpen: true,
      activeModal: null,
      modalData: {},
      detailItemId: null,
      toasts: [],
      isLoading: false,

      openCommandPalette: (query = '') =>
        set({ commandPaletteOpen: true, commandPaletteQuery: query }, false, 'openCommandPalette'),

      closeCommandPalette: () =>
        set({ commandPaletteOpen: false, commandPaletteQuery: '' }, false, 'closeCommandPalette'),

      toggleCommandPalette: () => {
        const { commandPaletteOpen } = get()
        if (commandPaletteOpen) {
          get().closeCommandPalette()
        } else {
          get().openCommandPalette()
        }
      },

      setCommandPaletteQuery: (q) =>
        set({ commandPaletteQuery: q }, false, 'setCommandPaletteQuery'),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),

      setSidebarOpen: (open) => set({ sidebarOpen: open }, false, 'setSidebarOpen'),

      openModal: (id, data = {}) =>
        set({ activeModal: id, modalData: data }, false, 'openModal'),

      closeModal: () =>
        set({ activeModal: null, modalData: {} }, false, 'closeModal'),

      openItemDetail: (itemId) =>
        set({ detailItemId: itemId }, false, 'openItemDetail'),

      closeItemDetail: () =>
        set({ detailItemId: null }, false, 'closeItemDetail'),

      addToast: (toast) => {
        const id = `toast-${++toastCounter}`
        set(
          (state) => ({ toasts: [...state.toasts, { ...toast, id }] }),
          false,
          'addToast'
        )

        // Auto-remove after duration
        const duration = toast.duration ?? 4000
        setTimeout(() => {
          get().removeToast(id)
        }, duration)
      },

      removeToast: (id) =>
        set(
          (state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }),
          false,
          'removeToast'
        ),

      setLoading: (loading) => set({ isLoading: loading }, false, 'setLoading'),
    }),
    { name: 'MONO/UIStore' }
  )
)
