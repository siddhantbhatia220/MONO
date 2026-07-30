import { NextResponse } from 'next/server'

import { fetchWorkspaceItems } from '../services/itemsService'

export async function getItems() {
  const items = await fetchWorkspaceItems()
  return NextResponse.json({
    count: items.length,
    items,
  })
}
