import { useAppStore } from '../store/appStore'
import { useItemStore } from '../store/itemStore'
import { Item } from '../types/item'
import { Project, Workspace } from '../types/workspace'
import { getDB } from './index'
import { listItems } from './items'
import { listProjects, listWorkspaces } from './workspaces'

export interface BackupSnapshot {
  version: string
  exportedAt: string
  workspaces: Workspace[]
  projects: Project[]
  items: Item[]
}

export async function exportWorkspaceBackup(): Promise<void> {
  const workspaces = await listWorkspaces()
  const projects = await Promise.all(workspaces.map((w) => listProjects(w.id)))
  const items = await listItems()

  const snapshot: BackupSnapshot = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    workspaces,
    projects: projects.flat(),
    items,
  }

  const json = JSON.stringify(snapshot, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mono-backup-${new Date().toISOString().split('T')[0]}.mono.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function restoreWorkspaceBackup(jsonString: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonString) as BackupSnapshot
    if (
      !data.workspaces ||
      !Array.isArray(data.workspaces) ||
      !data.items ||
      !Array.isArray(data.items)
    ) {
      throw new Error('Invalid MONO backup file format')
    }

    const db = await getDB()

    // Clear existing stores
    const txClear = db.transaction(['workspaces', 'projects', 'items'], 'readwrite')
    await txClear.objectStore('workspaces').clear()
    await txClear.objectStore('projects').clear()
    await txClear.objectStore('items').clear()
    await txClear.done

    // Restore stores
    const txRestore = db.transaction(['workspaces', 'projects', 'items'], 'readwrite')
    for (const ws of data.workspaces) {
      await txRestore.objectStore('workspaces').put(ws)
    }
    for (const proj of data.projects) {
      await txRestore.objectStore('projects').put(proj)
    }
    for (const item of data.items) {
      await txRestore.objectStore('items').put(item)
    }
    await txRestore.done

    // Reload Zustand store
    const restoredItems = await listItems()
    const itemMap = restoredItems.reduce<Record<string, (typeof restoredItems)[0]>>((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})
    useItemStore.setState({ items: itemMap })

    const restoredWorkspaces = await listWorkspaces()
    if (restoredWorkspaces.length > 0) {
      useAppStore.setState({ activeWorkspace: restoredWorkspaces[0] })
    }

    return true
  } catch (err) {
    console.error('Backup restoration failed:', err)
    return false
  }
}
