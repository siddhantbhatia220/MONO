import { getHealth } from '@/lib/api/controllers/healthController'

export async function GET() {
  return getHealth()
}
