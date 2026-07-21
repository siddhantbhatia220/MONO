import { getItems } from '@/lib/api/controllers/itemsController'

export async function GET() {
  return getItems()
}
