/**
 * MONO — Root Layout (Server Component)
 * Applies theme, fonts, and wraps the app shell.
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MONO — One place. Every workflow.',
  description:
    'A local-first Personal Operating System that unifies tasks, notes, projects, and collaboration into one elegant, keyboard-first workspace.',
  keywords: [
    'productivity',
    'task manager',
    'personal os',
    'workspace',
    'notes',
    'offline-first',
  ],
  authors: [{ name: 'Siddhant Bhatia', url: 'https://github.com/siddhantbhatia220' }],
  openGraph: {
    title: 'MONO — One place. Every workflow.',
    description: 'A local-first Personal Operating System.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
