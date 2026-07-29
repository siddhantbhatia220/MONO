'use client'

/**
 * MONO — Auth Modal Component
 *
 * Provides Login and Sign Up tabbed interface for account creation
 * and NestJS server JWT authentication.
 */
import React, { useState } from 'react'

import { useAuthStore } from '@/lib/store/authStore'
import { useUIStore } from '@/lib/store/uiStore'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

export function AuthModal() {
  const { activeModal, closeModal, addToast } = useUIStore()
  const { login, register } = useAuthStore()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    if (mode === 'register' && !name.trim()) return

    setLoading(true)
    try {
      if (mode === 'register') {
        await register(email, password, name)
      } else {
        await login(email, password)
      }
      addToast({
        message: mode === 'register' ? 'Account created successfully!' : 'Signed in successfully!',
        type: 'success',
      })
      closeModal()
    } catch (err) {
      console.error(err)
      addToast({ message: 'Authentication failed', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={activeModal === ('auth' as unknown as string)}
      onClose={closeModal}
      title={mode === 'login' ? 'Sign In to MONO' : 'Create Account'}
      description="Connect to your MONO account for multi-user collaboration and cloud sync."
      size="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
        {/* Mode Switcher Tabs */}
        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`
              flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer
              ${
                mode === 'login'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }
            `}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`
              flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer
              ${
                mode === 'register'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }
            `}
          >
            Create Account
          </button>
        </div>

        {/* Inputs */}
        {mode === 'register' && (
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Full Name
            </label>
            <Input
              type="text"
              placeholder="Siddhant Bhatia"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Password
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" variant="default" fullWidth loading={loading} className="mt-2">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
    </Modal>
  )
}
