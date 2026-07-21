export interface WorkspaceTemplate {
  id: string
  name: string
  icon: string
  description: string
  projects: string[]
}

export function getWorkspaceTemplates(): WorkspaceTemplate[] {
  return [
    {
      id: 'personal',
      name: 'Personal',
      icon: '🌿',
      description: 'Daily tasks, habits, personal goals',
      projects: ['health', 'reading', 'chores'],
    },
    {
      id: 'work',
      name: 'Work',
      icon: '⚡',
      description: 'Projects, meetings, work tasks',
      projects: ['mono', 'marketing', 'hiring'],
    },
    {
      id: 'study',
      name: 'Study',
      icon: '📝',
      description: 'Notes, assignments, research',
      projects: ['cs101', 'thesis', 'vocabulary'],
    },
  ]
}
