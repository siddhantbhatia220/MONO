'use client'

/**
 * MONO — Marketing & Promotional Homepage
 * A stunning, premium, fully animated landing page for the MONO Personal OS.
 * Features cinematic title reveals, organic backdrop glows, a simulated live app walkthrough,
 * and clear call-to-actions to launch the local workspace.
 */
import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  Folder,
  Inbox,
  Key,
  Monitor,
  MousePointer,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

// ============================
// Custom Github Icon SVG
// ============================
const GithubIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

// ============================
// Typewriter Helper Component
// ============================
function Typewriter({
  text,
  speed = 60,
  delay = 0,
}: {
  text: string
  speed?: number
  delay?: number
}) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let index = 0
    let timer: NodeJS.Timeout
    const startTyping = () => {
      timer = setInterval(() => {
        setDisplayedText(text.slice(0, index + 1))
        index++
        if (index >= text.length) {
          clearInterval(timer)
        }
      }, speed)
    }

    const delayTimeout = setTimeout(startTyping, delay)
    return () => {
      clearTimeout(delayTimeout)
      clearInterval(timer)
    }
  }, [text, speed, delay])

  return <span>{displayedText}</span>
}

// ============================
// Looping Interactive Mockup
// ============================
function ProductTourMockup() {
  const [currentStep, setCurrentStep] = useState(0)
  const [mockTheme, setMockTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const sequence = [
      { step: 0, duration: 3000 }, // Ctrl+K Keypress Simulation
      { step: 1, duration: 4000 }, // Command Palette typing
      { step: 2, duration: 5000 }, // Quick Capture typing
      { step: 3, duration: 3500 }, // Task row slide-in
      { step: 4, duration: 4000 }, // Complete task (strike-through)
      { step: 5, duration: 4000 }, // Smooth Theme transition (Light -> Dark)
    ]

    let timer: NodeJS.Timeout
    let seqIndex = 0

    const runNext = () => {
      const current = sequence[seqIndex]
      setCurrentStep(current.step)

      if (current.step === 5) {
        const t1 = setTimeout(() => setMockTheme('light'), 800)
        const t2 = setTimeout(() => setMockTheme('dark'), 2400)
        return () => {
          clearTimeout(t1)
          clearTimeout(t2)
        }
      } else {
        setMockTheme('dark')
      }

      timer = setTimeout(() => {
        seqIndex = (seqIndex + 1) % sequence.length
        runNext()
      }, current.duration)
    }

    runNext()

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const cursorCoords = [
    { x: '80%', y: '80%' }, // Idle bottom right
    { x: '50%', y: '25%' }, // Moving to Command Palette
    { x: '50%', y: '88%' }, // Moving to Quick Capture
    { x: '85%', y: '88%' }, // Moving to capture submit
    { x: '42%', y: '62%' }, // Moving to Item 3 checkbox
    { x: '88%', y: '12%' }, // Moving to mock theme switcher
  ]

  const activeCursor = cursorCoords[currentStep] || { x: '80%', y: '80%' }

  return (
    <div
      className={`
      relative w-full aspect-[16/10] rounded-2xl border transition-colors duration-500 overflow-hidden shadow-2xl flex text-left select-none
      ${
        mockTheme === 'dark'
          ? 'bg-[#09090b] border-zinc-850 text-zinc-100'
          : 'bg-white border-zinc-200 text-zinc-900'
      }
    `}
    >
      {/* Mock Sidebar */}
      <div
        className={`
        w-[30%] border-r p-3 flex flex-col gap-4 transition-colors duration-500
        ${mockTheme === 'dark' ? 'bg-[#0f0f11] border-zinc-850' : 'bg-zinc-50 border-zinc-200'}
      `}
      >
        {/* Mock window dots */}
        <div className="flex gap-1.5 mb-1">
          <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        <div className="flex items-center gap-1.5 font-bold text-xs">
          <span>⚡</span>
          <span>Work</span>
        </div>

        <div className="flex flex-col gap-1">
          {[
            { label: 'Inbox', icon: <Inbox size={11} />, active: true },
            { label: 'Today', icon: <Calendar size={11} /> },
          ].map((item) => (
            <div
              key={item.label}
              className={`
                flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors
                ${
                  item.active
                    ? mockTheme === 'dark'
                      ? 'bg-zinc-800 text-white'
                      : 'bg-zinc-200/60 text-zinc-900'
                    : 'text-zinc-400 dark:text-zinc-500'
                }
              `}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>

        <div>
          <p className="text-[9px] font-bold tracking-widest text-zinc-400 dark:text-zinc-650 uppercase mb-1.5 px-2">
            Projects
          </p>
          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            <Folder size={11} />
            <span>docs</span>
          </div>
        </div>
      </div>

      {/* Mock Main Panel */}
      <div className="flex-1 flex flex-col justify-between p-4 relative">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold">⚡ Work</h3>
              <span
                className={`
                text-[9px] font-semibold px-1.5 py-0.5 rounded-full
                ${mockTheme === 'dark' ? 'bg-zinc-800 text-zinc-450' : 'bg-zinc-100 text-zinc-500'}
              `}
              >
                {currentStep >= 3 ? '3 items' : '2 items'}
              </span>
            </div>
          </div>

          {/* List */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-transparent">
              <div
                className={`w-3.5 h-3.5 rounded border ${mockTheme === 'dark' ? 'border-zinc-800' : 'border-zinc-300'}`}
              />
              <span className="text-[11px] font-medium">Buy groceries</span>
            </div>

            <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-transparent">
              <div
                className={`w-3.5 h-3.5 rounded border ${mockTheme === 'dark' ? 'border-zinc-800' : 'border-zinc-300'}`}
              />
              <span className="text-[11px] font-medium">Design UI tokens</span>
            </div>

            {/* Dynamic inserted row */}
            <AnimatePresence>
              {currentStep >= 3 && (
                <motion.div
                  key="inserted-row"
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`
                    flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors
                    ${currentStep === 4 ? 'opacity-40' : ''}
                    ${mockTheme === 'dark' ? 'bg-zinc-900/50' : 'bg-zinc-50'}
                  `}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex-shrink-0 flex items-center justify-center">
                        {currentStep >= 4 ? (
                          <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            className={`
                              w-3.5 h-3.5 rounded flex items-center justify-center text-[8px] text-white font-bold
                              ${mockTheme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}
                            `}
                          >
                            ✓
                          </motion.div>
                        ) : (
                          <div
                            className={`w-3.5 h-3.5 rounded border ${mockTheme === 'dark' ? 'border-zinc-700' : 'border-zinc-300'}`}
                          />
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-medium truncate ${currentStep >= 4 ? 'line-through' : ''}`}
                      >
                        Prepare release notes
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        className={`
                        px-1 py-0.5 text-[8px] font-bold rounded
                        ${mockTheme === 'dark' ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-150 text-zinc-500'}
                      `}
                      >
                        #docs
                      </span>
                      <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550">
                        !
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mock Quick Capture Input */}
        <div
          className={`
          flex items-center gap-2 rounded-lg p-2 border transition-all duration-150
          ${
            currentStep === 2
              ? mockTheme === 'dark'
                ? 'border-zinc-400 bg-zinc-900'
                : 'border-zinc-400 bg-zinc-50'
              : mockTheme === 'dark'
                ? 'border-zinc-800 bg-zinc-900/40'
                : 'border-zinc-200 bg-zinc-50/40'
          }
        `}
        >
          <span className="text-zinc-400 dark:text-zinc-600 text-[10px]">+</span>
          <div className="text-[10px] font-medium text-zinc-450 dark:text-zinc-550 flex-1">
            {currentStep === 2 ? (
              <Typewriter text="Prepare release notes #docs !high" speed={50} />
            ) : (
              'New task... #tag !priority'
            )}
          </div>
        </div>

        {/* OVERLAY 1: Command Palette */}
        <AnimatePresence>
          {currentStep === 1 && (
            <motion.div
              key="mock-cmd-palette"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-x-6 top-10 bg-zinc-950 dark:bg-white text-white dark:text-zinc-900 border border-zinc-800 dark:border-zinc-200 rounded-xl p-3 shadow-2xl z-10 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-850 dark:border-zinc-200">
                <Search size={11} className="text-zinc-500" />
                <div className="text-[11px] font-semibold flex-1">
                  <Typewriter text="New task" speed={60} delay={400} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                {[
                  { label: 'New Item', sub: 'Create a task, note, or goal', active: true },
                  { label: 'New Workspace', sub: 'Create a new workspace' },
                ].map((cmd) => (
                  <div
                    key={cmd.label}
                    className={`
                      p-1.5 rounded-lg text-left flex flex-col gap-0.5
                      ${
                        cmd.active
                          ? mockTheme === 'dark'
                            ? 'bg-zinc-850 text-white'
                            : 'bg-zinc-100 text-zinc-900'
                          : 'opacity-55'
                      }
                    `}
                  >
                    <span className="text-[10px] font-bold">{cmd.label}</span>
                    <span className="text-[8px] text-zinc-450 dark:text-zinc-500">{cmd.sub}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* OVERLAY 2: Keyboard press simulation */}
        <AnimatePresence>
          {currentStep === 0 && (
            <motion.div
              key="mock-keyboard-overlay"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] z-20"
            >
              <div className="flex gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
                <motion.kbd
                  animate={{
                    scale: [1, 0.9, 1],
                    backgroundColor: ['#18181b', '#27272a', '#18181b'],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
                  className="px-3 py-2 text-xs font-bold text-zinc-300 bg-zinc-900 border border-zinc-700 rounded-lg shadow-inner"
                >
                  Ctrl
                </motion.kbd>
                <span className="text-zinc-500 self-center">+</span>
                <motion.kbd
                  animate={{
                    scale: [1, 0.9, 1],
                    backgroundColor: ['#18181b', '#27272a', '#18181b'],
                  }}
                  transition={{ duration: 1.2, delay: 0.3, repeat: Infinity, repeatDelay: 1 }}
                  className="px-3 py-2 text-xs font-bold text-zinc-300 bg-zinc-900 border border-zinc-700 rounded-lg shadow-inner"
                >
                  K
                </motion.kbd>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simulated Cursor */}
        <motion.div
          animate={{ x: activeCursor.x, y: activeCursor.y }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute z-50 pointer-events-none text-zinc-400 dark:text-zinc-600"
          style={{ left: 0, top: 0 }}
        >
          <MousePointer size={14} fill="currentColor" />

          {/* Clicks visual ripple */}
          {currentStep === 4 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full border border-black dark:border-white pointer-events-none"
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}

// ============================
// Marketing Page
// ============================
export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col relative overflow-hidden">
      {/* Background portal glowing mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.12, 0.96, 1],
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[10%] left-[20%] w-[80%] h-[80%] opacity-30 dark:opacity-10 blur-[130px] bg-gradient-to-tr from-zinc-300 via-zinc-150 to-zinc-400 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950"
        />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white dark:text-black font-black text-sm">M</span>
          </div>
          <span className="font-black tracking-tight text-lg">MONO</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/siddhantbhatia220/MONO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-450 dark:hover:text-zinc-100 transition-colors text-sm font-medium flex items-center gap-1.5"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <Link
            href="/app"
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-150 dark:text-black rounded-xl text-sm font-bold shadow-md transition-all duration-150"
          >
            Launch App
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-12 lg:py-24 flex flex-col gap-20">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Creator Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-6 shadow-sm">
                <Sparkles size={12} className="text-zinc-800 dark:text-zinc-100" />
                <span>Created by Siddhant Bhatia</span>
              </div>

              {/* Title Character Reveal */}
              <h1 className="text-5xl sm:text-6xl font-black text-black dark:text-white mb-4 tracking-tight flex items-center justify-center lg:justify-start gap-1.5 overflow-hidden">
                {'MONO'.split('').map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.15 + index * 0.08,
                      type: 'spring',
                      stiffness: 150,
                      damping: 13,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>

              <p className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200 mb-4 leading-snug">
                A Local-First Personal Operating System.
              </p>

              <p className="text-zinc-500 dark:text-zinc-450 leading-relaxed text-sm sm:text-base max-w-md mx-auto lg:mx-0 mb-8">
                Unify your to-do lists, daily tasks, notes, projects, and life goals in a visually
                silent, keyboard-first workspace that adapts to your thinking.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/app"
                  className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-150 dark:text-black rounded-2xl text-base font-black shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group transition-all duration-150"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <a
                  href="https://github.com/siddhantbhatia220/MONO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-zinc-200 hover:border-zinc-350 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-md text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>Star on GitHub</span>
                </a>
              </div>

              {/* Status Info */}
              <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-4">
                100% Free · Offline-First · No Registration Required
              </p>
            </motion.div>
          </div>

          {/* Right Column: Automated Interactive Walkthrough Mockup */}
          <div className="lg:col-span-7 hidden lg:block relative pl-6">
            <ProductTourMockup />
          </div>
        </section>

        {/* Pillars Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-zinc-200/50 dark:border-zinc-800/50">
          {[
            {
              icon: <Monitor size={22} className="text-zinc-800 dark:text-zinc-200" />,
              title: 'Local-First & Offline',
              desc: 'MONO operates 100% locally on your browser. Runs instantly offline using IndexedDB database wrappers. Your data never leaves your device.',
            },
            {
              icon: <Key size={22} className="text-zinc-800 dark:text-zinc-200" />,
              title: 'Keyboard-First Control',
              desc: 'Navigate faster without touching your mouse. Execute shortcuts and access commands instantly with the global Ctrl+K / ⌘K command launcher.',
            },
            {
              icon: <ShieldCheck size={22} className="text-zinc-800 dark:text-zinc-200" />,
              title: 'Visually Silent System',
              desc: 'A strictly monochrome gray-scale color palette that recedes into the background, prioritizing content structure over visual noise.',
            },
          ].map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="p-6 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-150"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center mb-4">
                {pillar.icon}
              </div>
              <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50 mb-2">
                {pillar.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </section>

        {/* Pricing / Open Source Block */}
        <section className="text-center py-12 border-t border-zinc-200/50 dark:border-zinc-800/50 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black tracking-tight mb-3">100% Open Source.</h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-450 leading-relaxed mb-6">
            MONO is developed as an open source project to provide a high-performance local
            operating system tool for developers and creators. No premium plans, no advertisements,
            no tracking cookies.
          </p>
          <Link
            href="/app"
            className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-150 dark:text-black text-xs font-bold rounded-xl shadow-md transition-all inline-block"
          >
            Launch Your Local OS →
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-450 dark:text-zinc-500">
        <p>© 2026 MONO. Built with Next.js & IndexedDB by Siddhant Bhatia.</p>
        <div className="flex gap-6">
          <a
            href="https://github.com/siddhantbhatia220/MONO/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            License
          </a>
          <a
            href="https://github.com/siddhantbhatia220/MONO/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            Contributing
          </a>
        </div>
      </footer>
    </div>
  )
}
