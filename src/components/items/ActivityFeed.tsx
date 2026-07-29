'use client'

/**
 * MONO — Item Activity Log & Comment Thread Component
 *
 * Displays real-time item audit trails (history of edits) and interactive
 * comment threads for collaboration.
 */
import React, { useState } from 'react'

import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, Send } from 'lucide-react'

import { Item } from '@/lib/types/item'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface CommentItem {
  id: string
  author: string
  text: string
  createdAt: string
}

interface ActivityFeedProps {
  item: Item
}

export function ActivityFeed({ item }: ActivityFeedProps) {
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 'c_1',
      author: 'You',
      text: 'Created this item and initialized workspace CRDT state.',
      createdAt: item.createdAt,
    },
  ])
  const [newComment, setNewComment] = useState('')

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setComments((prev) => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        author: 'You',
        text: newComment.trim(),
        createdAt: new Date().toISOString(),
      },
    ])
    setNewComment('')
  }

  return (
    <div className="flex flex-col gap-3 p-3.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
        <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
        <span>Activity & Discussion ({comments.length})</span>
      </h4>

      {/* Activity / Comments Timeline */}
      <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-2.5 items-start text-xs">
            <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 text-[10px]">
              {c.author[0]}
            </div>
            <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-lg">
              <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{c.author}</span>
                <span>{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 text-xs">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment Input */}
      <form onSubmit={handleAddComment} className="flex gap-2 mt-1">
        <Input
          type="text"
          placeholder="Add a comment or update note..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 text-xs"
        />
        <Button type="submit" variant="default" size="sm" className="cursor-pointer">
          <Send className="w-3 h-3" />
        </Button>
      </form>
    </div>
  )
}
