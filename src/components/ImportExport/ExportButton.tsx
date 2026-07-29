'use client'

/**
 * MONO — Export Workspace Button Component
 *
 * Triggers JSON or Markdown exports of workspace data with direct browser download.
 */
import React, { useState } from 'react'
import { Download, FileJson, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/lib/store/appStore'
import { useItemStore } from '@/lib/store/itemStore'

interface ExportButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'xs'
}

export function ExportButton({ variant = 'outline', size = 'xs' }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false)
  const { currentWorkspaceId } = useAppStore()
  const { items } = useItemStore()

  const exportAsJson = () => {
    setExporting(true)
    try {
      const workspaceItems = items.filter(
        (item) => !currentWorkspaceId || item.workspaceId === currentWorkspaceId
      )

      const payload = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        workspaceId: currentWorkspaceId,
        itemsCount: workspaceItems.length,
        items: workspaceItems,
      }

      const jsonStr = JSON.stringify(payload, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `mono-workspace-export-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  const exportAsMarkdown = () => {
    setExporting(true)
    try {
      const workspaceItems = items.filter(
        (item) => !currentWorkspaceId || item.workspaceId === currentWorkspaceId
      )

      let mdContent = `# MONO Workspace Export\nExported: ${new Date().toLocaleString()}\nTotal Items: ${workspaceItems.length}\n\n---\n\n`

      workspaceItems.forEach((item, index) => {
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
    <div className="flex items-center space-x-1">
      <Button
        size={size}
        variant={variant}
        disabled={exporting}
        onClick={exportAsJson}
        className="flex items-center space-x-1"
        title="Export as JSON"
      >
        <FileJson className="w-3.5 h-3.5" />
        <span>JSON</span>
      </Button>

      <Button
        size={size}
        variant={variant}
        disabled={exporting}
        onClick={exportAsMarkdown}
        className="flex items-center space-x-1"
        title="Export as Markdown"
      >
        <FileText className="w-3.5 h-3.5" />
        <span>Markdown</span>
      </Button>
    </div>
  )
}
