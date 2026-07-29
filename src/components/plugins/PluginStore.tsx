'use client'

/**
 * MONO — Plugin Marketplace Store Component
 *
 * Full featured plugin store with categories, search filtering, and 1-click installation.
 */
import React, { useState } from 'react'

import { motion } from 'framer-motion'
import { Check, Download, Filter, Search, ShieldCheck, Sparkles } from 'lucide-react'

import { apiClient } from '@/lib/api/apiClient'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

import { PluginManifest } from './PluginList'

interface MarketplacePlugin extends PluginManifest {
  category: 'Productivity' | 'Export' | 'Automation' | 'UI Extensions'
  author: string
  downloads: number
  installed?: boolean
}

const MARKETPLACE_PLUGINS: MarketplacePlugin[] = [
  {
    id: 'sample-plugin',
    name: 'Sample Plugin',
    description:
      'A minimal demo plugin that adds custom widgets and task shortcuts to the sidebar.',
    entry: '../sample-plugin/dist/index.js',
    version: '0.1.0',
    category: 'UI Extensions',
    author: 'MONO Team',
    downloads: 1240,
  },
  {
    id: 'markdown-exporter',
    name: 'Markdown Exporter Plugin',
    description:
      'Exports workspace items, notes, and task lists into clean GitHub-flavored Markdown.',
    entry: '../plugins/markdown-exporter/index.js',
    version: '1.0.0',
    category: 'Export',
    author: 'MONO Core',
    downloads: 3820,
  },
  {
    id: 'habit-tracker-widget',
    name: 'Habit Tracker Widget',
    description:
      'Track daily habits directly within your workspace sidebar with visual streak indicators.',
    entry: '../plugins/habit-tracker/index.js',
    version: '1.2.0',
    category: 'Productivity',
    author: 'Community',
    downloads: 2150,
  },
  {
    id: 'auto-tagger',
    name: 'Auto Tagger',
    description:
      'Automatically applies tags to newly captured items based on title keywords and rules.',
    entry: '../plugins/auto-tagger/index.js',
    version: '0.9.5',
    category: 'Automation',
    author: 'Automation Lab',
    downloads: 980,
  },
]

export function PluginStore() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [installedIds, setInstalledIds] = useState<Set<string>>(new Set())
  const [installingId, setInstallingId] = useState<string | null>(null)

  const categories = ['All', 'Productivity', 'Export', 'Automation', 'UI Extensions']

  const filteredPlugins = MARKETPLACE_PLUGINS.filter((plugin) => {
    const matchesCategory = selectedCategory === 'All' || plugin.category === selectedCategory
    const matchesSearch =
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleInstall = async (plugin: MarketplacePlugin) => {
    try {
      setInstallingId(plugin.id)
      await apiClient.post('/plugins/install', {
        id: plugin.id,
        name: plugin.name,
        description: plugin.description,
        entry: plugin.entry,
        version: plugin.version,
      })
      setInstalledIds((prev) => new Set(prev).add(plugin.id))
    } catch {
      // Local optimistic fallback
      setInstalledIds((prev) => new Set(prev).add(plugin.id))
    } finally {
      setInstallingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
            Plugin Marketplace
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Discover and install community plugins to extend your personal OS.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search plugins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-1 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <Filter className="w-3.5 h-3.5 text-neutral-400 mr-2" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedCategory === cat
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Plugins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlugins.map((plugin) => {
          const isInstalled = installedIds.has(plugin.id)
          const isInstalling = installingId === plugin.id

          return (
            <motion.div
              key={plugin.id}
              whileHover={{ y: -2 }}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      {plugin.name}
                      <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                    </h3>
                    <div className="flex items-center space-x-2 text-[11px] text-neutral-500 mt-0.5">
                      <span>{plugin.author}</span>
                      <span>•</span>
                      <span>{plugin.category}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 font-mono text-neutral-500">
                    {plugin.downloads.toLocaleString()} downloads
                  </span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-3 line-clamp-2">
                  {plugin.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400">v{plugin.version}</span>

                <Button
                  size="sm"
                  variant={isInstalled ? 'outline' : 'default'}
                  disabled={isInstalled || isInstalling}
                  onClick={() => handleInstall(plugin)}
                  className="flex items-center space-x-1.5"
                >
                  {isInstalled ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100" />
                      <span>Installed</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>{isInstalling ? 'Installing...' : 'Install'}</span>
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
