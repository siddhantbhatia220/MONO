'use client'

import React, { useState } from 'react'

import { Plus, Trash2, Zap } from 'lucide-react'

import { useAutomationStore } from '@/lib/store/automationStore'
import { useUIStore } from '@/lib/store/uiStore'
import { ActionType, TriggerType } from '@/lib/types/automation'

import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'

export function AutomationModal() {
  const { activeModal, closeModal } = useUIStore()
  const { rules, addRule, toggleRule, deleteRule } = useAutomationStore()

  const [name, setName] = useState('')
  const [triggerType, setTriggerType] = useState<TriggerType>('status_change')
  const [triggerValue, setTriggerValue] = useState('completed')
  const [actionType, setActionType] = useState<ActionType>('add_tag')
  const [actionValue, setActionValue] = useState('done')

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !triggerValue.trim() || !actionValue.trim()) return

    addRule({
      name: name.trim(),
      enabled: true,
      triggerType,
      triggerValue: triggerValue.trim(),
      actionType,
      actionValue: actionValue.trim(),
    })

    setName('')
  }

  return (
    <Modal
      open={activeModal === 'automations'}
      onClose={closeModal}
      title="Visual Automations"
      description="Create IF/THEN rules to automate repetitive workspace actions."
      size="lg"
    >
      <div className="flex flex-col gap-6 py-2">
        {/* Rule creation form */}
        <form
          onSubmit={handleCreateRule}
          className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            New Automation Rule
          </div>

          <Input
            placeholder="Rule Name (e.g., Tag done tasks)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 mb-1 uppercase">
                IF (Trigger)
              </label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value as TriggerType)}
                className="w-full p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
              >
                <option value="status_change">Status equals</option>
                <option value="priority_set">Priority equals</option>
                <option value="tag_added">Has Tag</option>
              </select>
              <input
                type="text"
                placeholder="Value (e.g. completed, high)"
                value={triggerValue}
                onChange={(e) => setTriggerValue(e.target.value)}
                className="w-full mt-1.5 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 mb-1 uppercase">
                THEN (Action)
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as ActionType)}
                className="w-full p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
              >
                <option value="add_tag">Add Tag</option>
                <option value="set_priority">Set Priority</option>
                <option value="set_due_date">Set Due Date</option>
              </select>
              <input
                type="text"
                placeholder="Value (e.g. done, high, tomorrow)"
                value={actionValue}
                onChange={(e) => setActionValue(e.target.value)}
                className="w-full mt-1.5 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <Button type="submit" variant="default" size="sm" className="mt-1 self-end">
            <Plus className="w-4 h-4 mr-1" /> Add Rule
          </Button>
        </form>

        {/* Existing Rules List */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Active Rules ({rules.length})
          </h3>
          {rules.length === 0 ? (
            <p className="text-xs text-zinc-400 italic">No automation rules created yet.</p>
          ) : (
            rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => toggleRule(rule.id)}
                    className="w-4 h-4 rounded accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {rule.name}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      IF{' '}
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {rule.triggerType}
                      </span>{' '}
                      = &quot;{rule.triggerValue}&quot; → THEN{' '}
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {rule.actionType}
                      </span>{' '}
                      &quot;{rule.actionValue}&quot;
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteRule(rule.id)}
                  className="text-zinc-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}
