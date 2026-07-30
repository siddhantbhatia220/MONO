'use client'

/**
 * MONO — Export Workspace Button Component
 *
 * Triggers JSON or Markdown exports of workspace data with direct browser download.
 */
import React, { useState } from 'react'

import { FileJson, FileText } from 'lucide-react'

import { exportWorkspaceBackup } from '@/lib/db/backup'
import { useAppStore } from '@/lib/store/appStore'
import { useItemStore } from '@/lib/store/itemStore'
import type { Item } from '@/lib/types/item'

import { Button } from '@/components/ui/Button'

interface ExportButtonProps {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ExportButton({ variant = 'outline', size = 'sm' }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false)
  const { activeWorkspace } = useAppStore()
  const { items } = useItemStore()

  const currentWorkspaceId = activeWorkspace?.id

  const getWorkspaceItems = (): Item[] => {
    const allItems = Object.values(items)
    return allItems.filter((item) => !currentWorkspaceId || item.workspaceId === currentWorkspaceId)
  }

  const exportAsJson = async () => {
    setExporting(true)
    try {
      await exportWorkspaceBackup()
    } finally {
      setExporting(false)
    }
  }

  const exportAsMarkdown = () => {
    setExporting(true)
    try {
      const workspaceItems = getWorkspaceItems()

      let mdContent = `# MONO Workspace Export\nExported: ${new Date().toLocaleString()}\nTotal Items: ${workspaceItems.length}\n\n---\n\n`

      workspaceItems.forEach((item: Item, index: number) => {
        const checkmark = item.status === 'completed' ? '[x]' : '[ ]'
        mdContent += `### ${index + 1}. ${checkmark} ${item.title}\n`
        mdContent += `- **Type**: ${item.type}\n`
        mdContent += `- **Status**: ${item.status}\n`
        if (item.priority) mdContent += `- **Priority**: ${item.priority}\n`
        if (item.tags?.length) mdContent += `- **Tags**: ${item.tags.join(', ')}\n`
        if (item.notes) mdContent += `\n${item.notes}\n`
        mdContent += `\n`
      })

      const blob = new Blob([mdContent], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `mono-workspace-export-${new Date().toISOString().slice(0, 10)}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <Button
        size={size}
        variant={variant}
        disabled={exporting}
        onClick={exportAsJson}
        className="inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 text-xs font-medium"
        title="Export as JSON"
      >
        <FileJson className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="whitespace-nowrap">JSON</span>
      </Button>

      <Button
        size={size}
        variant={variant}
        disabled={exporting}
        onClick={exportAsMarkdown}
        className="inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 text-xs font-medium"
        title="Export as Markdown"
      >
        <FileText className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="whitespace-nowrap">Markdown</span>
      </Button>
    </div>
  )
}
