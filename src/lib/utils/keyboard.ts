/**
 * MONO — Keyboard Shortcut Utilities
 * Maps key combinations to human-readable labels.
 */

export interface KeyboardShortcut {
  key: string
  modifier?: 'ctrl' | 'meta' | 'alt' | 'shift' | 'ctrl+shift' | 'meta+shift'
  description: string
  category: 'Navigation' | 'Items' | 'Views' | 'Global'
}

export const SHORTCUTS: KeyboardShortcut[] = [
  // Global
  { key: 'k', modifier: 'ctrl', description: 'Open Command Palette', category: 'Global' },
  { key: '?', description: 'Show keyboard shortcuts', category: 'Global' },
  { key: '/', description: 'Focus search', category: 'Global' },
  { key: 'Escape', description: 'Close / Cancel', category: 'Global' },

  // Navigation
  { key: 'b', modifier: 'ctrl', description: 'Toggle sidebar', category: 'Navigation' },
  { key: '1', modifier: 'ctrl', description: 'Go to Inbox', category: 'Navigation' },
  { key: '2', modifier: 'ctrl', description: 'Go to Today', category: 'Navigation' },

  // Items
  { key: 'n', description: 'New item', category: 'Items' },
  { key: 'e', description: 'Edit selected item', category: 'Items' },
  { key: 'd', description: 'Delete selected item', category: 'Items' },
  { key: 'Enter', description: 'Complete / Open item', category: 'Items' },
  { key: 'Tab', description: 'Indent (make sub-item)', category: 'Items' },
  { key: 'Tab', modifier: 'shift', description: 'Unindent item', category: 'Items' },
  { key: 'z', modifier: 'ctrl', description: 'Undo', category: 'Items' },
  { key: 'z', modifier: 'ctrl+shift', description: 'Redo', category: 'Items' },
]

/**
 * Get a human-readable shortcut label like "⌘K" or "Ctrl+K"
 */
export function getShortcutLabel(shortcut: KeyboardShortcut, isMac: boolean): string {
  const modifierMap = {
    ctrl: isMac ? '⌃' : 'Ctrl+',
    meta: isMac ? '⌘' : 'Win+',
    alt: isMac ? '⌥' : 'Alt+',
    shift: isMac ? '⇧' : 'Shift+',
    'ctrl+shift': isMac ? '⌃⇧' : 'Ctrl+Shift+',
    'meta+shift': isMac ? '⌘⇧' : 'Win+Shift+',
  }

  const mod = shortcut.modifier ? modifierMap[shortcut.modifier] : ''
  const key = shortcut.key === 'Escape' ? 'Esc' : shortcut.key.toUpperCase()
  return `${mod}${key}`
}

/**
 * Check if a keyboard event matches a shortcut definition
 */
export function matchesShortcut(e: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()

  if (!shortcut.modifier) {
    return keyMatch && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey
  }

  switch (shortcut.modifier) {
    case 'ctrl':
      return keyMatch && (e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey
    case 'meta':
      return keyMatch && e.metaKey && !e.shiftKey && !e.altKey
    case 'alt':
      return keyMatch && e.altKey && !e.ctrlKey && !e.metaKey
    case 'shift':
      return keyMatch && e.shiftKey && !e.ctrlKey && !e.metaKey
    case 'ctrl+shift':
      return keyMatch && (e.ctrlKey || e.metaKey) && e.shiftKey && !e.altKey
    case 'meta+shift':
      return keyMatch && e.metaKey && e.shiftKey && !e.altKey
    default:
      return false
  }
}
