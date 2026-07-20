import { NextResponse } from 'next/server'

export async function GET() {
  const templates = [
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

  return NextResponse.json({
    templatesCount: templates.length,
    templates,
  })
}
