/**
 * MONO — View & Search Specifications
 *
 * Types for workspace view modes, search queries, and dynamic filters.
 */
import { ItemStatus, Priority } from './item'

export enum ViewMode {
  List = 'list',
  Board = 'board',
  Calendar = 'calendar',
  Timeline = 'timeline',
}

export interface FilterCriteria {
  searchQuery: string
  tags: string[]
  priority: Priority | 'all'
  status: ItemStatus | 'all'
  pinnedOnly: boolean
}

export interface BoardColumnConfig {
  id: ItemStatus
  title: string
  statuses: ItemStatus[]
}

export const DEFAULT_BOARD_COLUMNS: BoardColumnConfig[] = [
  { id: ItemStatus.Active, title: 'To Do', statuses: [ItemStatus.Active] },
  { id: ItemStatus.InProgress, title: 'In Progress', statuses: [ItemStatus.InProgress] },
  { id: ItemStatus.Completed, title: 'Completed', statuses: [ItemStatus.Completed] },
]

export const DEFAULT_FILTER_CRITERIA: FilterCriteria = {
  searchQuery: '',
  tags: [],
  priority: 'all',
  status: 'all',
  pinnedOnly: false,
}
