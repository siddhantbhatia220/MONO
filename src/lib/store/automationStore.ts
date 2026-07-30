import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { AutomationRule } from '../types/automation'

interface AutomationState {
  rules: AutomationRule[]
  addRule: (rule: Omit<AutomationRule, 'id' | 'createdAt'>) => void
  toggleRule: (id: string) => void
  deleteRule: (id: string) => void
}

export const useAutomationStore = create<AutomationState>()(
  persist(
    (set) => ({
      rules: [
        {
          id: 'default-rule-1',
          name: 'Auto-tag completed items as #done',
          enabled: true,
          triggerType: 'status_change',
          triggerValue: 'completed',
          actionType: 'add_tag',
          actionValue: 'done',
          createdAt: new Date().toISOString(),
        },
      ],
      addRule: (ruleInput) => {
        const newRule: AutomationRule = {
          ...ruleInput,
          id: nanoid(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ rules: [...state.rules, newRule] }))
      },
      toggleRule: (id) => {
        set((state) => ({
          rules: state.rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
        }))
      },
      deleteRule: (id) => {
        set((state) => ({
          rules: state.rules.filter((r) => r.id !== id),
        }))
      },
    }),
    {
      name: 'mono-automation-rules',
    }
  )
)
