'use client'

/**
 * MONO — Theme Provider
 * Handles system/light/dark theme with no flash on load.
 */
import React, { useEffect } from 'react'

import { useAppStore } from '@/lib/store/appStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { preferences, setResolvedTheme } = useAppStore()

  useEffect(() => {
    const applyTheme = (theme: 'light' | 'dark') => {
      document.documentElement.setAttribute('data-theme', theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      setResolvedTheme(theme)
    }

    if (preferences.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      applyTheme(mq.matches ? 'dark' : 'light')

      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light')
      mq.addEventListener('change', listener)
      return () => mq.removeEventListener('change', listener)
    } else {
      applyTheme(preferences.theme)
    }
  }, [preferences.theme, setResolvedTheme])

  return <>{children}</>
}
