import { getWorkspaces } from '@/lib/api/controllers/workspacesController'

export async function GET() {
  return getWorkspaces()
}
