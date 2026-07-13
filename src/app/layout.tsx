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
  title: 'MONO — Best Local-First To-Do List App & Personal OS',
  description:
    'MONO is the ultimate local-first, keyboard-driven personal operating system. Unify your to-do lists, tasks, notes, habits, and goals in a private, offline-first workspace.',
  keywords: [
    'to do list app',
    'best to do list app',
    'local-first task manager',
    'offline to do list',
    'keyboard-driven productivity',
    'privacy focused planner',
    'personal operating system',
    'minimalist task organizer',
    'offline notes manager',
    'collaborative markdown checklist',
  ],
  authors: [{ name: 'Siddhant Bhatia', url: 'https://github.com/siddhantbhatia220' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'MONO — Best Local-First To-Do List App & Personal OS',
    description:
      'Unify your to-do lists, tasks, notes, habits, and goals in a private, offline-first workspace.',
    url: 'https://github.com/siddhantbhatia220/MONO',
    siteName: 'MONO',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MONO — Local-First To-Do List & Personal OS',
    description: 'Unify your to-do lists, tasks, notes, habits, and goals in a private, offline-first workspace.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MONO',
    alternateName: 'MONO Personal OS',
    description:
      'A local-first, privacy-focused Personal Operating System that unifies to-do lists, notes, projects, and goals into a keyboard-driven workspace.',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Windows, macOS, Linux, Android, iOS, Web',
    url: 'https://github.com/siddhantbhatia220/MONO',
    author: {
      '@type': 'Person',
      name: 'Siddhant Bhatia',
      url: 'https://github.com/siddhantbhatia220',
    },
    browserRequirements: 'Requires JavaScript. Requires IndexedDB.',
    featureList: [
      'Universal Item Model (Task, Note, Goal, Event, Habit, Bookmark, Checklist)',
      '100% Local-first database with IndexedDB persistence',
      'Keyboard-first command palette and hotkeys',
      'Monochrome distraction-free interface',
      'Instant offline-capable startup',
    ],
    license: 'https://opensource.org/licenses/MIT',
  }

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
