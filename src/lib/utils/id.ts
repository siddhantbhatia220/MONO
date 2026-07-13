/**
 * MONO — ID Generation Utilities
 */

import { nanoid } from 'nanoid'

/** Generate a URL-safe unique ID */
export function generateId(): string {
  return nanoid()
}
