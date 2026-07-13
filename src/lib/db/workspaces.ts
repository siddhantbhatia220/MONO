/**
 * MONO — Workspace & Project Database Operations
 */

import { nanoid } from 'nanoid'
import { getDB } from './index'
import type {
  Workspace,
  Project,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  CreateProjectInput,
  UpdateProjectInput,
} from '@/lib/types/workspace'

// ============================
// Workspace CRUD
// ============================

export async function createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
  const db = await getDB()
  const all = await db.getAll('workspaces')
  const maxOrder = all.reduce((max, w) => Math.max(max, w.sortOrder), -1)
  const now = new Date().toISOString()

  const workspace: Workspace = {
    id: nanoid(),
    name: input.name.trim(),
    icon: input.icon ?? '📁',
    description: input.description,
    sortOrder: maxOrder + 1,
    theme: input.theme ?? 'system',
    density: input.density ?? 'comfortable',
    createdAt: now,
    updatedAt: now,
  }

  await db.put('workspaces', workspace)
  return workspace
}

export async function getWorkspace(id: string): Promise<Workspace | null> {
  const db = await getDB()
  return (await db.get('workspaces', id)) ?? null
}

export async function listWorkspaces(): Promise<Workspace[]> {
  const db = await getDB()
  const all = await db.getAll('workspaces')
  return all.sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function updateWorkspace(
  id: string,
  input: UpdateWorkspaceInput
): Promise<Workspace | null> {
  const db = await getDB()
  const existing = await db.get('workspaces', id)
  if (!existing) return null

  const updated: Workspace = {
    ...existing,
    ...input,
    id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  }

  await db.put('workspaces', updated)
  return updated
}

export async function deleteWorkspace(id: string): Promise<void> {
  const db = await getDB()

  // Delete all projects in workspace
  const projects = await db.getAllFromIndex('projects', 'by-workspace', id)
  const tx = db.transaction(['workspaces', 'projects', 'items'], 'readwrite')

  await Promise.all([
    tx.objectStore('workspaces').delete(id),
    ...projects.map((p) => tx.objectStore('projects').delete(p.id)),
  ])

  // Delete all items in workspace
  const items = await db.getAllFromIndex('items', 'by-workspace', id)
  await Promise.all(items.map((item) => tx.objectStore('items').delete(item.id)))

  await tx.done
}

// ============================
// Project CRUD
// ============================

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const db = await getDB()
  const siblings = await db.getAllFromIndex('projects', 'by-workspace', input.workspaceId)
  const maxOrder = siblings.reduce((max, p) => Math.max(max, p.sortOrder), -1)
  const now = new Date().toISOString()

  const project: Project = {
    id: nanoid(),
    workspaceId: input.workspaceId,
    parentId: input.parentId,
    name: input.name.trim(),
    icon: input.icon ?? '📂',
    description: input.description,
    sortOrder: maxOrder + 1,
    archived: false,
    createdAt: now,
    updatedAt: now,
  }

  await db.put('projects', project)
  return project
}

export async function getProject(id: string): Promise<Project | null> {
  const db = await getDB()
  return (await db.get('projects', id)) ?? null
}

export async function listProjects(workspaceId: string): Promise<Project[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex('projects', 'by-workspace', workspaceId)
  return all.sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function updateProject(
  id: string,
  input: UpdateProjectInput
): Promise<Project | null> {
  const db = await getDB()
  const existing = await db.get('projects', id)
  if (!existing) return null

  const updated: Project = {
    ...existing,
    ...input,
    id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  }

  await db.put('projects', updated)
  return updated
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDB()
  const items = await db.getAllFromIndex('items', 'by-project', id)
  const tx = db.transaction(['projects', 'items'], 'readwrite')

  await Promise.all([
    tx.objectStore('projects').delete(id),
    ...items.map((item) => tx.objectStore('items').delete(item.id)),
  ])

  await tx.done
}
