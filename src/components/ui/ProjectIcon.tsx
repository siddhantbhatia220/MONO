import React from 'react'
import * as Icons from 'lucide-react'

interface ProjectIconProps {
  name: string
  className?: string
}

export function ProjectIcon({ name, className = 'h-4 w-4' }: ProjectIconProps) {
  // Check if it is a legacy emoji icon (like 🌿, ⚡, 📁)
  const isEmoji = /\p{Emoji_Presentation}/u.test(name) || /\p{Emoji}/u.test(name)
  if (isEmoji && name.length <= 2) {
    return <span className={className} aria-hidden="true">{name}</span>
  }

  // Find dynamic lucide icon or fallback to Folder
  const IconComponent = (Icons as any)[name] || Icons.Folder
  return <IconComponent className={className} aria-hidden="true" />
}
