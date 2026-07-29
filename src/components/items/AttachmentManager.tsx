'use client'

/**
 * MONO — Attachment Manager Component
 *
 * Upload, preview, and manage local file and image attachments
 * stored directly inside local-first IndexedDB items.
 */
import React, { useState } from 'react'

import { FileText, Paperclip, Trash2, Upload } from 'lucide-react'
import { nanoid } from 'nanoid'

import { updateItem } from '@/lib/db/items'
import { useItemStore } from '@/lib/store/itemStore'
import { Attachment, Item } from '@/lib/types/item'

interface AttachmentManagerProps {
  item: Item
}

export function AttachmentManager({ item }: AttachmentManagerProps) {
  const { upsertItem } = useItemStore()
  const [uploading, setUploading] = useState(false)

  const attachments = item.attachments || []

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const newAttachments: Attachment[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const dataUrl = await readFileAsDataUrl(file)

        newAttachments.push({
          id: nanoid(),
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl,
          createdAt: new Date().toISOString(),
        })
      }

      const updatedList = [...attachments, ...newAttachments]
      const updatedItem: Item = {
        ...item,
        attachments: updatedList,
        updatedAt: new Date().toISOString(),
      }

      upsertItem(updatedItem)
      await updateItem(item.id, { attachments: updatedList })
    } catch (err) {
      console.error('Failed to attach files:', err)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDeleteAttachment = async (attachmentId: string) => {
    const updatedList = attachments.filter((a) => a.id !== attachmentId)
    const updatedItem: Item = {
      ...item,
      attachments: updatedList,
      updatedAt: new Date().toISOString(),
    }

    upsertItem(updatedItem)
    await updateItem(item.id, { attachments: updatedList })
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="flex flex-col gap-3 p-3.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <Paperclip className="w-3.5 h-3.5 text-zinc-400" />
          <span>Attachments ({attachments.length})</span>
        </h4>

        {/* Upload button */}
        <label className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
          <Upload className="w-3 h-3" />
          <span>Attach File</span>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Attachments List / Grid */}
      {attachments.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-1">
          {attachments.map((att) => {
            const isImage = att.type.startsWith('image/')
            return (
              <div
                key={att.id}
                className="group relative flex flex-col p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 overflow-hidden"
              >
                {/* Image Thumbnail Preview */}
                {isImage ? (
                  <div className="w-full h-24 rounded bg-zinc-100 dark:bg-zinc-950 overflow-hidden mb-1.5 flex items-center justify-center">
                    <img src={att.dataUrl} alt={att.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-16 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-1.5 text-zinc-400">
                    <FileText className="w-6 h-6" />
                  </div>
                )}

                {/* File info */}
                <div className="flex items-center justify-between text-xs min-w-0">
                  <a
                    href={att.dataUrl}
                    download={att.name}
                    className="truncate font-medium text-zinc-800 dark:text-zinc-200 hover:underline text-[11px]"
                    title={att.name}
                  >
                    {att.name}
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDeleteAttachment(att.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-opacity cursor-pointer"
                    title="Delete attachment"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <span className="text-[9px] font-medium text-zinc-400 tabular-nums">
                  {formatSize(att.size)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}
