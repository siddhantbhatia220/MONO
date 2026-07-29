'use client'

/**
 * MONO — Workspace Sharing & Member Invitation Modal
 *
 * Manage workspace collaborators, invite users by email, assign roles
 * (Owner, Editor, Viewer), and generate shareable access links.
 */
import React, { useState } from 'react'
import { Check, Copy, Shield, UserPlus, Users } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useUIStore } from '@/lib/store/uiStore'
import { useAppStore } from '@/lib/store/appStore'

export function InviteMemberModal() {
  const { activeModal, closeModal, addToast } = useUIStore()
  const { activeWorkspace } = useAppStore()

  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'EDITOR' | 'VIEWER'>('EDITOR')
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/app?invite=${activeWorkspace?.id || 'ws_default'}`
    : ''

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    addToast({ message: 'Invite link copied to clipboard!', type: 'info' })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    addToast({
      message: `Invitation sent to ${email.trim()} (${role})`,
      type: 'success',
    })
    setEmail('')
  }

  return (
    <Modal
      open={activeModal === ('invite-member' as any)}
      onClose={closeModal}
      title="Share Workspace"
      description={`Invite members to collaborate on ${activeWorkspace?.name || 'Workspace'}`}
      size="sm"
    >
      <div className="flex flex-col gap-4 py-2">
        {/* Email Invitation Form */}
        <form onSubmit={handleInvite} className="flex gap-2">
          <Input
            type="email"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'EDITOR' | 'VIEWER')}
            className="px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden cursor-pointer"
          >
            <option value="EDITOR">Can Edit</option>
            <option value="VIEWER">Can View</option>
          </select>

          <Button type="submit" variant="default" size="sm" className="cursor-pointer">
            Invite
          </Button>
        </form>

        {/* Copy Share Link */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            <span>Share Link</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 truncate"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
