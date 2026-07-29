/**
 * MONO — Local Heuristic Auto-Categorizer
 *
 * Analyzes item text to suggest tags, priority, and item type without external AI APIs.
 * Powered by local NLP keyword extraction and heuristic rule engines.
 */
import { ItemType, Priority } from '@/lib/types/item'

export interface ClassificationResult {
  suggestedType?: ItemType
  suggestedPriority?: Priority
  suggestedTags: string[]
  confidence: number
}

const TYPE_KEYWORDS: Record<ItemType, string[]> = {
  [ItemType.Task]: [
    'do',
    'fix',
    'build',
    'create',
    'write',
    'send',
    'buy',
    'clean',
    'finish',
    'submit',
    'refactor',
    'deploy',
  ],
  [ItemType.Note]: ['note', 'idea', 'thought', 'summary', 'memo', 'outline', 'draft', 'brainstorm'],
  [ItemType.Goal]: [
    'goal',
    'target',
    'milestone',
    'achieve',
    'reach',
    'quarterly',
    'annual',
    'objective',
  ],
  [ItemType.Event]: [
    'meet',
    'meeting',
    'call',
    'sync',
    'zoom',
    'conference',
    'interview',
    'webinar',
    'appointment',
    'calendar',
  ],
  [ItemType.Habit]: [
    'daily',
    'everyday',
    'habit',
    'streak',
    'workout',
    'meditate',
    'read daily',
    'water',
    'exercise',
  ],
  [ItemType.Bookmark]: [
    'http',
    'https',
    'link',
    'article',
    'read later',
    'bookmark',
    'url',
    'site',
  ],
  [ItemType.Checklist]: ['list', 'checklist', 'packing', 'todos', 'items'],
}

const PRIORITY_KEYWORDS: Record<Priority, string[]> = {
  [Priority.Critical]: [
    'asap',
    'critical',
    'emergency',
    'blocker',
    'down',
    'fire',
    'urgent!!',
    'immediately',
  ],
  [Priority.High]: ['urgent', 'high', 'important', 'today', 'p1', 'soon', 'priority'],
  [Priority.Medium]: ['medium', 'p2', 'normal', 'standard'],
  [Priority.Low]: ['low', 'p3', 'eventually', 'someday', 'whenever'],
  [Priority.None]: [],
}

const TAG_KEYWORDS: Record<string, string[]> = {
  work: [
    'work',
    'client',
    'project',
    'client',
    'boss',
    'meeting',
    'report',
    'code',
    'pr',
    'feature',
    'bug',
  ],
  personal: ['home', 'family', 'grocery', 'buy', 'doctor', 'personal', 'bill', 'rent'],
  health: ['gym', 'workout', 'meditate', 'doctor', 'health', 'fitness', 'run', 'diet', 'sleep'],
  finance: ['tax', 'bill', 'money', 'budget', 'bank', 'crypto', 'pay', 'invoice', 'salary'],
  learning: ['read', 'book', 'course', 'study', 'learn', 'tutorial', 'article'],
}

/**
 * Classifies an item title or input string locally using heuristic rules.
 */
export function classifyInput(input: string): ClassificationResult {
  const text = input.toLowerCase()
  const words = text.split(/\s+/)

  let suggestedType: ItemType | undefined
  let suggestedPriority: Priority | undefined
  const suggestedTags = new Set<string>()

  // 1. Detect Item Type
  for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      suggestedType = type as ItemType
      break
    }
  }

  // 2. Detect Priority
  for (const [priority, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      suggestedPriority = priority as Priority
      break
    }
  }

  // 3. Detect Tags
  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      suggestedTags.add(tag)
    }
  }

  // 4. Extract explicit hashtags if any
  words.forEach((w) => {
    if (w.startsWith('#') && w.length > 1) {
      suggestedTags.add(w.slice(1).toLowerCase())
    }
  })

  const confidence = suggestedType || suggestedPriority || suggestedTags.size > 0 ? 0.85 : 0.2

  return {
    suggestedType,
    suggestedPriority,
    suggestedTags: Array.from(suggestedTags),
    confidence,
  }
}
