/**
 * MONO — Client-side Yjs CRDT Document Wrapper
 *
 * Provides conflict-free replicated data type (CRDT) document management
 * for Universal Items using Yjs.
 */
import * as Y from 'yjs'

import { Item } from '../types/item'

export class MonoCrdtDoc {
  public readonly doc: Y.Doc
  private readonly itemsMap: Y.Map<Y.Map<unknown>>

  constructor(docId = 'mono-workspace-doc') {
    this.doc = new Y.Doc({ guid: docId })
    this.itemsMap = this.doc.getMap('items')
  }

  /**
   * Set or update an item inside the Yjs CRDT map.
   */
  public updateItem(item: Item): void {
    this.doc.transact(() => {
      let yItem = this.itemsMap.get(item.id)
      if (!yItem) {
        yItem = new Y.Map()
        this.itemsMap.set(item.id, yItem)
      }

      yItem.set('id', item.id)
      yItem.set('title', item.title)
      yItem.set('notes', item.notes ?? '')
      yItem.set('status', item.status)
      yItem.set('priority', item.priority)
      yItem.set('type', item.type)
      yItem.set('tags', item.tags)
      yItem.set('updatedAt', item.updatedAt)
    })
  }

  /**
   * Remove an item from the Yjs CRDT map.
   */
  public removeItem(itemId: string): void {
    this.doc.transact(() => {
      this.itemsMap.delete(itemId)
    })
  }

  /**
   * Encode document state as binary update vector.
   */
  public encodeState(): Uint8Array {
    return Y.encodeStateAsUpdate(this.doc)
  }

  /**
   * Apply an incoming binary state update from remote peer or server.
   */
  public applyUpdate(update: Uint8Array): void {
    Y.applyUpdate(this.doc, update)
  }
}
