/**
 * MONO — Saved Filter Preset Model
 *
 * Defines saved custom search and filter queries for 1-click execution.
 */
import { FilterCriteria } from './view'

export interface SavedFilter {
  id: string
  name: string
  criteria: FilterCriteria
  createdAt: string
}
