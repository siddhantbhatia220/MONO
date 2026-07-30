import { useAutomationStore } from '../store/automationStore'
import { Item, Priority } from '../types/item'
import { parseNaturalDate } from '../utils/date'

export function evaluateAutomations(item: Item): Item {
  const rules = useAutomationStore.getState().rules.filter((r) => r.enabled)
  let updated = { ...item }

  for (const rule of rules) {
    let triggered = false

    if (rule.triggerType === 'status_change' && updated.status === rule.triggerValue) {
      triggered = true
    } else if (rule.triggerType === 'priority_set' && updated.priority === rule.triggerValue) {
      triggered = true
    } else if (rule.triggerType === 'tag_added' && updated.tags.includes(rule.triggerValue)) {
      triggered = true
    }

    if (!triggered) continue

    if (rule.actionType === 'add_tag') {
      if (!updated.tags.includes(rule.actionValue)) {
        updated = { ...updated, tags: [...updated.tags, rule.actionValue] }
      }
    } else if (rule.actionType === 'set_priority') {
      updated = { ...updated, priority: rule.actionValue as Priority }
    } else if (rule.actionType === 'set_due_date') {
      const parsedDate = parseNaturalDate(rule.actionValue)
      if (parsedDate) {
        updated = { ...updated, dueDate: parsedDate.toISOString() }
      }
    }
  }

  return updated
}
