/**
 * MONO — Root Layout (Server Component)
 * Applies theme, fonts, icons, PWA manifest, and advanced SEO metadata.
 */
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import { ThemeProvider } from '@/components/layout/ThemeProvider'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://github.com/siddhantbhatia220/MONO'),
  title: {
    default: 'MONO — Local-First Personal OS & To-Do List App | Siddhant Bhatia',
    template: '%s | MONO — Personal OS',
  },
  description:
    'MONO is the premier local-first, privacy-focused Personal Operating System and to-do list app engineered by Siddhant Bhatia. Seamlessly manage tasks, notes, habits, projects, and goals offline with keyboard-first speed.',
  keywords: [
    'MONO',
    'mono',
    'MONO personal os',
    'to do list app',
    'to-do list app',
    'best to do list app',
    'siddhant bhatia',
    'siddhant bhatia projects',
    'siddhant bhatia developer',
    'local-first task manager',
    'offline to do list',
    'keyboard-driven task app',
    'privacy focused task manager',
    'personal operating system',
    'minimalist task organizer',
    'kanban task manager',
    'offline markdown notes',
    'progressive web app task manager',
    'pwa task manager',
  ],
  authors: [{ name: 'Siddhant Bhatia', url: 'https://github.com/siddhantbhatia220' }],
  creator: 'Siddhant Bhatia',
  publisher: 'Siddhant Bhatia',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MONO Personal OS',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/icon-192.png'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
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
    title: 'MONO — Local-First Personal OS & To-Do List App by Siddhant Bhatia',
    description:
      'Unify your to-do lists, tasks, notes, habits, and goals in a private, offline-first workspace.',
    url: 'https://github.com/siddhantbhatia220/MONO',
    siteName: 'MONO',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'MONO Personal Operating System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MONO — Local-First Personal OS & To-Do List App by Siddhant Bhatia',
    description:
      'Unify your to-do lists, tasks, notes, habits, and goals in a private, offline-first workspace.',
    images: ['/icon-512.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLdApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MONO',
    alternateName: ['MONO Personal OS', 'MONO To-Do List App'],
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
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Universal Item Model (Task, Note, Goal, Event, Habit, Bookmark, Checklist)',
      '100% Local-first database with IndexedDB persistence',
      'Keyboard-first command palette and hotkeys',
      'Monochrome distraction-free interface',
      'PWA offline capability with sub-second startup',
    ],
  }

  const jsonLdPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Siddhant Bhatia',
    alternateName: ['Siddhant Bhatia developer', 'Siddhant Bhatia projects'],
    url: 'https://github.com/siddhantbhatia220',
    description:
      'Siddhant Bhatia is a software engineer specializing in building high-performance local-first web applications, productivity software, and personal operating systems like MONO.',
    jobTitle: 'Software Engineer',
    knowsAbout: [
      'Software Engineering',
      'Local-First Architecture',
      'Next.js',
      'React',
      'TypeScript',
      'Productivity Tools',
      'UX/UI Design',
    ],
    sameAs: ['https://github.com/siddhantbhatia220', 'https://github.com/siddhantbhatia220/MONO'],
  }

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MONO Personal OS by Siddhant Bhatia',
    alternateName: 'MONO',
    url: 'https://github.com/siddhantbhatia220/MONO',
    publisher: {
      '@type': 'Person',
      name: 'Siddhant Bhatia',
    },
  }

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
