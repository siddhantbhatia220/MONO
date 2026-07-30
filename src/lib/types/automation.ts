export type TriggerType = 'status_change' | 'priority_set' | 'tag_added'
export type ActionType = 'set_priority' | 'add_tag' | 'set_due_date'

export interface AutomationRule {
  id: string
  name: string
  enabled: boolean
  triggerType: TriggerType
  triggerValue: string
  actionType: ActionType
  actionValue: string
  createdAt: string
}
