'use client'

/**
 * MONO — Installed Plugins List Component
 *
 * Displays all plugins currently installed in the system, with toggle controls
 * for workspace activation and uninstallation.
 */
import React, { useCallback, useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { Power, Puzzle, Trash2 } from 'lucide-react'

import { apiClient } from '@/lib/api/apiClient'
import { useAppStore } from '@/lib/store/appStore'

import { Button } from '@/components/ui/Button'

export interface PluginManifest {
  id: string
  name: string
  description: string
  entry: string
  version?: string
}

export function PluginList() {
  const { activeWorkspace } = useAppStore()
  const currentWorkspaceId = activeWorkspace?.id || ''
  const [plugins, setPlugins] = useState<PluginManifest[]>([])
  const [activePluginIds, setActivePluginIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const fetchInstalledPlugins = useCallback(async () => {
    try {
      const data = await apiClient.get<PluginManifest[]>('/plugins')
      setPlugins(data || [])
    } catch {
      // Fallback local plugins list if server offline
      setPlugins([
        {
          id: 'sample-plugin',
          name: 'Sample Plugin',
          description: 'A minimal demo plugin that adds custom widgets to the sidebar.',
          entry: '../sample-plugin/dist/index.js',
          version: '0.1.0',
        },
        {
          id: 'markdown-exporter',
          name: 'Markdown Exporter Plugin',
          description: 'Exports workspace items and notes to clean Markdown format.',
          entry: '../plugins/markdown-exporter/index.js',
          version: '1.0.0',
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchInstalledPlugins()
  }, [fetchInstalledPlugins])

  const toggleActivation = async (pluginId: string) => {
    const isCurrentlyActive = activePluginIds.has(pluginId)

    try {
      if (isCurrentlyActive) {
        await apiClient.post(`/plugins/${pluginId}/deactivate`, { workspaceId: currentWorkspaceId })
        setActivePluginIds((prev) => {
          const next = new Set(prev)
          next.delete(pluginId)
          return next
        })
      } else {
        await apiClient.post(`/plugins/${pluginId}/activate`, { workspaceId: currentWorkspaceId })
        setActivePluginIds((prev) => {
          const next = new Set(prev)
          next.add(pluginId)
          return next
        })
      }
    } catch {
      // Toggle locally for local offline experience
      setActivePluginIds((prev) => {
        const next = new Set(prev)
        if (isCurrentlyActive) {
          next.delete(pluginId)
        } else {
          next.add(pluginId)
        }
        return next
      })
    }
  }

  const handleUninstall = async (pluginId: string) => {
    try {
      await apiClient.delete(`/plugins/${pluginId}`, { workspaceId: currentWorkspaceId })
      setPlugins((prev) => prev.filter((p) => p.id !== pluginId))
    } catch {
      setPlugins((prev) => prev.filter((p) => p.id !== pluginId))
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-xs text-neutral-400">Loading installed plugins...</div>
    )
  }

  if (plugins.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
        <Puzzle className="w-8 h-8 mx-auto mb-3 text-neutral-400" />
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          No plugins installed yet
        </p>
        <p className="text-xs text-neutral-500 mt-1">
          Explore the Plugin Store to extend MONO&apos;s functionality.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {plugins.map((plugin) => {
          const isActive = activePluginIds.has(plugin.id)
          return (
            <motion.div
              key={plugin.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 mt-0.5">
                  <Puzzle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {plugin.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-mono">
                      v{plugin.version || '1.0.0'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5 max-w-md">{plugin.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => toggleActivation(plugin.id)}
                  className="flex items-center space-x-1"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isActive ? 'Active' : 'Enable'}</span>
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleUninstall(plugin.id)}
                  className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  aria-label="Uninstall plugin"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
