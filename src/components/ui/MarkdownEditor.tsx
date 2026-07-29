'use client'

/**
 * MONO — Rich Block Markdown Editor
 *
 * Provides live markdown editing and formatted preview modes
 * with a monochrome formatting toolbar (Bold, Italic, Code, Heading, List, Quote).
 */
import React, { useState } from 'react'
import { Bold, Code, Eye, Edit3, Heading, Italic, List, Quote } from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange: (val: string) => void
  onBlur?: () => void
  placeholder?: string
}

export function MarkdownEditor({
  value,
  onChange,
  onBlur,
  placeholder = 'Add notes or detailed markdown content...',
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<'write' | 'preview'>('write')

  const insertFormat = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('mono-md-textarea') as HTMLTextAreaElement | null
    if (!textarea) {
      onChange(value + prefix + suffix)
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const replacement = `${prefix}${selectedText || 'text'}${suffix}`
    const newValue = value.substring(0, start) + replacement + value.substring(end)

    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, end + prefix.length)
    }, 0)
  }

  // Basic client-side Markdown parser for preview mode
  const renderSimpleMarkdown = (content: string) => {
    if (!content.trim()) {
      return <p className="text-zinc-400 italic text-xs">Nothing to preview</p>
    }

    const lines = content.split('\n')
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-2 text-xs md:text-sm text-zinc-800 dark:text-zinc-200">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                {line.replace('### ', '')}
              </h3>
            )
          }
          if (line.startsWith('## ')) {
            return (
              <h2 key={idx} className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                {line.replace('## ', '')}
              </h2>
            )
          }
          if (line.startsWith('# ')) {
            return (
              <h1 key={idx} className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100">
                {line.replace('# ', '')}
              </h1>
            )
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <li key={idx} className="ml-4 list-disc text-zinc-700 dark:text-zinc-300">
                {line.substring(2)}
              </li>
            )
          }
          if (line.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="pl-3 border-l-2 border-zinc-400 dark:border-zinc-600 italic text-zinc-500"
              >
                {line.replace('> ', '')}
              </blockquote>
            )
          }
          return line.trim() ? (
            <p key={idx} className="leading-relaxed">
              {line}
            </p>
          ) : (
            <div key={idx} className="h-2" />
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/60">
      {/* Editor Header & Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-zinc-900/40">
        {/* Formatting actions */}
        <div className="flex items-center gap-1">
          {mode === 'write' && (
            <>
              <button
                type="button"
                onClick={() => insertFormat('**', '**')}
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded cursor-pointer"
                title="Bold"
                aria-label="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormat('*', '*')}
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded cursor-pointer"
                title="Italic"
                aria-label="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormat('`', '`')}
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded cursor-pointer"
                title="Code"
                aria-label="Code"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormat('### ')}
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded cursor-pointer"
                title="Heading"
                aria-label="Heading"
              >
                <Heading className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormat('- ')}
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded cursor-pointer"
                title="Bullet List"
                aria-label="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormat('> ')}
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded cursor-pointer"
                title="Blockquote"
                aria-label="Blockquote"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-zinc-200/60 dark:bg-zinc-800 p-0.5 rounded-md">
          <button
            type="button"
            onClick={() => setMode('write')}
            className={`
              flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded transition-all cursor-pointer
              ${
                mode === 'write'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }
            `}
          >
            <Edit3 className="w-3 h-3" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`
              flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded transition-all cursor-pointer
              ${
                mode === 'preview'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }
            `}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="p-3 min-h-[140px]">
        {mode === 'write' ? (
          <textarea
            id="mono-md-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            rows={5}
            className="
              w-full h-full text-xs md:text-sm bg-transparent
              text-zinc-900 dark:text-zinc-100 placeholder-zinc-400
              focus:outline-hidden resize-y font-mono leading-relaxed
            "
          />
        ) : (
          renderSimpleMarkdown(value)
        )}
      </div>
    </div>
  )
}
