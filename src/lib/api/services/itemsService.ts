export interface MockItem {
  id: string
  title: string
  notes: string
  status: string
  priority: string
  tags: string[]
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export function getMockItems(): MockItem[] {
  return [
    {
      id: 'mock-item-1',
      title: 'Review MONO system architecture specs',
      notes: 'Detailed diagrams in .agents/architecture.md',
      status: 'active',
      priority: 'high',
      tags: ['docs', 'dev'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-item-2',
      title: 'Prepare Phase 2 view layouts roadmap',
      notes: 'Plan board, timeline, and calendar modules',
      status: 'active',
      priority: 'medium',
      tags: ['planning'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-item-3',
      title: 'Buy groceries',
      notes: 'Milk, eggs, coffee beans',
      status: 'completed',
      priority: 'none',
      tags: ['personal'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    },
  ]
}
