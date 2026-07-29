'use client'

/**
 * MONO — Workspace Data Import Dialog Modal
 *
 * Allows users to upload a JSON backup file to restore or add workspace items.
 */
import React, { useRef, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, FileJson, UploadCloud, X } from 'lucide-react'

import { createItem } from '@/lib/db/items'
import { useAppStore } from '@/lib/store/appStore'
import { useItemStore } from '@/lib/store/itemStore'

import { Button } from '@/components/ui/Button'

interface ImportDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ImportDialog({ isOpen, onClose }: ImportDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [successCount, setSuccessCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { upsertItem } = useItemStore()
  const { activeWorkspace } = useAppStore()

  const currentWorkspaceId = activeWorkspace?.id

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (!selected.name.endsWith('.json')) {
        setError('Please select a valid .json file')
        setFile(null)
        return
      }
      setFile(selected)
      setError(null)
      setSuccessCount(null)
    }
  }

  const handleImport = async () => {
    if (!file) return
    setImporting(true)
    setError(null)

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)

      const itemsToImport = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.items)
          ? parsed.items
          : null

      if (!itemsToImport) {
        throw new Error('Invalid backup file structure. Expected an array of items.')
      }

      let count = 0
      for (const itemData of itemsToImport) {
        if (itemData.title) {
          const newItem = await createItem({
            title: itemData.title,
            workspaceId: currentWorkspaceId || itemData.workspaceId || 'default-workspace',
            notes: itemData.notes,
            type: itemData.type || 'task',
            status: itemData.status || 'active',
            priority: itemData.priority || 'none',
            tags: itemData.tags || [],
          })
          upsertItem(newItem)
          count++
        }
      }

      setSuccessCount(count)
      setFile(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to parse and import JSON file'
      setError(msg)
    } finally {
      setImporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <UploadCloud className="w-5 h-5" />
            Import Workspace Items
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Upload a JSON workspace export file to restore items into your active workspace.
          </p>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="mt-5 p-6 border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white rounded-xl text-center cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <FileJson className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
            {file ? (
              <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            ) : (
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Click to browse or drop your{' '}
                <span className="font-mono text-neutral-900 dark:text-white">.json</span> file here
              </p>
            )}
          </div>

          {error && (
            <div className="mt-3 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-neutral-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successCount !== null && (
            <div className="mt-3 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white shrink-0" />
              <span>Successfully imported {successCount} items into your workspace!</span>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-2">
            <Button size="sm" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" disabled={!file || importing} onClick={handleImport}>
              {importing ? 'Importing...' : 'Import Data'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
