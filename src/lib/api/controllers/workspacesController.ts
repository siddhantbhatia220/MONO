import { NextResponse } from 'next/server'

import { getWorkspaceTemplates } from '../services/workspacesService'

export async function getWorkspaces() {
  const templates = getWorkspaceTemplates()
  return NextResponse.json({
    templatesCount: templates.length,
    templates,
  })
}
