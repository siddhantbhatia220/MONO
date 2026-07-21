import { NextResponse } from 'next/server'
import { getMockItems } from '../services/itemsService'

export async function getItems() {
  const items = getMockItems()
  return NextResponse.json({
    count: items.length,
    items,
  })
}
