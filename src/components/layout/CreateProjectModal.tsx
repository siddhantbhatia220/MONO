'use client'

import React, { useEffect, useState } from 'react'

import { createProject } from '@/lib/db/workspaces'
import { useAppStore } from '@/lib/store/appStore'
import { useUIStore } from '@/lib/store/uiStore'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ProjectIcon } from '@/components/ui/ProjectIcon'

export function CreateProjectModal() {
  const { activeModal, closeModal, addToast } = useUIStore()
  const { activeWorkspace, setActiveProject } = useAppStore()
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('Folder')
  const [loading, setLoading] = useState(false)

  const ICON_OPTIONS = [
    'Folder',
    'Zap',
    'Target',
    'Lightbulb',
    'FileText',
    'Rocket',
    'Leaf',
    'FlaskConical',
    'Palette',
    'BarChart3',
  ]

  // Reset fields when opening modal
  useEffect(() => {
    if (activeModal === 'create-project') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName('')
      setIcon('Folder')
    }
  }, [activeModal])

  const handleCreate = async () => {
    if (!name.trim() || !activeWorkspace) return
    setLoading(true)
    try {
      const project = await createProject({
        name: name.trim(),
        icon,
        workspaceId: activeWorkspace.id,
      })

      // Dispatch custom event to notify Sidebar to re-fetch projects
      document.dispatchEvent(new CustomEvent('mono:projects-updated'))

      setActiveProject(project)
      addToast({ message: 'Project created', type: 'success', duration: 2000 })
      closeModal()
    } catch (err) {
      console.error('Failed to create project', err)
      addToast({ message: 'Failed to create project', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={activeModal === 'create-project'}
      onClose={closeModal}
      title="New Project"
      description="Projects organize your items in a workspace."
      size="sm"
    >
      <div className="flex flex-col gap-4">
        {/* Icon picker */}
        <div>
          <p className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mb-2">
            Icon
          </p>
          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.map((iconName) => (
              <button
                key={iconName}
                onClick={() => setIcon(iconName)}
                className={`
                  w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-100 cursor-pointer
                  ${
                    icon === iconName
                      ? 'border-zinc-900 dark:border-zinc-150 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }
                `}
                aria-label={`Select ${iconName} as project icon`}
                aria-pressed={icon === iconName}
              >
                <ProjectIcon name={iconName} className="h-4.5 w-4.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Name input */}
        <Input
          label="Name"
          placeholder="My Project"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          autoFocus
        />

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleCreate}
            loading={loading}
            disabled={!name.trim()}
          >
            Create Project
          </Button>
        </div>
      </div>
    </Modal>
  )
}
